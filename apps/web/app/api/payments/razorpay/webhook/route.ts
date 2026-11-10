
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// ============================================================
// TYPES
// ============================================================

type RazorpayPayment = {
  id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
};

type RazorpayRefund = {
  id?: string;
  payment_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
};

type PaymentSession = {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  status: string;
  total_amount: number;
};

// ============================================================
// 1. SUPABASE ADMIN CLIENT
// ============================================================

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured on the server.`);
  }

  return value;
}

function getSupabaseAdmin() {
  return createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// ============================================================
// 2. WEBHOOK SIGNATURE VALIDATION
// ============================================================

function safeEqualHex(
  received: string,
  expected: string
): boolean {
  if (
    !/^[a-f0-9]{64}$/i.test(received) ||
    !/^[a-f0-9]{64}$/i.test(expected)
  ) {
    return false;
  }

  const receivedBuffer = Buffer.from(received, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (
    receivedBuffer.length !== 32 ||
    expectedBuffer.length !== 32
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedBuffer,
    expectedBuffer
  );
}

// ============================================================
// 3. STANDARD WEBHOOK RESPONSE
// ============================================================

function webhookResponse(
  event: string,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({
    success: true,
    received: true,
    event,
    ...extra,
  });
}

// ============================================================
// 4. RAZORPAY API REQUEST
// ============================================================

async function razorpayGet<T>(path: string): Promise<T> {
  const keyId = requiredEnv("RAZORPAY_KEY_ID");
  const keySecret = requiredEnv("RAZORPAY_KEY_SECRET");

  const auth = Buffer.from(
    `${keyId}:${keySecret}`
  ).toString("base64");

  const response = await fetch(
    `https://api.razorpay.com/v1${path}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const responseText = await response.text();

  let data: unknown;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error(
      `Razorpay returned an invalid response (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    const errorData = data as {
      error?: {
        description?: string;
        reason?: string;
      };
    };

    throw new Error(
      errorData.error?.description ||
        errorData.error?.reason ||
        `Razorpay API returned HTTP ${response.status}.`
    );
  }

  return data as T;
}

// ============================================================
// 5. RECORD PAYMENT EXCEPTION
// ============================================================

async function recordPaymentException({
  supabase,
  session,
  razorpayOrderId,
  razorpayPaymentId,
  amountPaise,
  currency,
  reason,
  details,
}: {
  supabase: ReturnType<typeof getSupabaseAdmin>;
  session?: PaymentSession | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string;
  amountPaise: number;
  currency: string;
  reason: string;
  details?: Record<string, unknown>;
}) {
  if (
    !Number.isSafeInteger(amountPaise) ||
    amountPaise <= 0
  ) {
    throw new Error(
      "Cannot record payment exception with an invalid captured amount."
    );
  }

  const exceptionData = {
    payment_session_id: session?.id ?? null,
    user_id: session?.user_id ?? null,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    amount_paise: amountPaise,
    currency,
    reason,
    status: "REVIEW_REQUIRED",
    details: details ?? {},
    updated_at: new Date().toISOString(),
  };

  const { error: insertError } = await supabase
    .from("store_payment_exceptions")
    .upsert(
      exceptionData,
      {
        onConflict: "razorpay_payment_id",
        ignoreDuplicates: true,
      }
    );

  if (insertError) {
    throw new Error(
      `Unable to record captured payment exception: ${insertError.message}`
    );
  }

  const {
    data: exception,
    error: lookupError,
  } = await supabase
    .from("store_payment_exceptions")
    .select("id, reason, status")
    .eq("razorpay_payment_id", razorpayPaymentId)
    .single();

  if (lookupError || !exception) {
    throw new Error(
      `Unable to retrieve recorded payment exception: ${lookupError?.message ?? "Record not found."}`
    );
  }

  return exception;
}

// ============================================================
// 6. PROCESS CAPTURED PAYMENT
// ============================================================

async function processCapturedPayment(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  eventEntity: RazorpayPayment
) {
  const eventPaymentId = String(
    eventEntity.id ?? ""
  ).trim();

  const eventOrderId = String(
    eventEntity.order_id ?? ""
  ).trim();

  if (!eventPaymentId || !eventOrderId) {
    throw new Error(
      "Captured payment event is missing payment or order ID."
    );
  }

  // ----------------------------------------------------------
  // Fetch payment independently from Razorpay
  // ----------------------------------------------------------

  const payment = await razorpayGet<RazorpayPayment>(
    `/payments/${encodeURIComponent(eventPaymentId)}`
  );

  const razorpayPaymentId = String(
    payment.id ?? ""
  ).trim();

  const razorpayOrderId = String(
    payment.order_id ?? ""
  ).trim();

  const paymentStatus = String(
    payment.status ?? ""
  ).toLowerCase();

  const amountPaise = Number(payment.amount);

  const currency = String(
    payment.currency ?? ""
  ).toUpperCase();

  if (
    razorpayPaymentId !== eventPaymentId ||
    !razorpayOrderId
  ) {
    throw new Error(
      "Razorpay API payment identity does not match the webhook."
    );
  }

  if (paymentStatus !== "captured") {
    return {
      ignored: true,
      reason: "Razorpay API does not report a captured payment.",
    };
  }

  if (
    !Number.isSafeInteger(amountPaise) ||
    amountPaise <= 0
  ) {
    throw new Error(
      "Razorpay returned an invalid captured payment amount."
    );
  }

  // ----------------------------------------------------------
  // Find payment session using Razorpay's verified order ID
  // ----------------------------------------------------------

  const {
    data: paymentSession,
    error: sessionLookupError,
  } = await supabase
    .from("store_payment_sessions")
    .select(
      [
        "id",
        "user_id",
        "razorpay_order_id",
        "razorpay_payment_id",
        "status",
        "total_amount",
      ].join(",")
    )
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (sessionLookupError) {
    throw new Error(
      `Payment session lookup failed: ${sessionLookupError.message}`
    );
  }

  const session =
    paymentSession as PaymentSession | null;

  // ----------------------------------------------------------
  // Validate webhook payload against Razorpay API
  // ----------------------------------------------------------

  const eventAmount = Number(eventEntity.amount);

  const eventCurrency = String(
    eventEntity.currency ?? ""
  ).toUpperCase();

  const webhookPayloadMismatch =
    eventOrderId !== razorpayOrderId ||
    eventPaymentId !== razorpayPaymentId ||
    eventAmount !== amountPaise ||
    eventCurrency !== currency;

  // ----------------------------------------------------------
  // Unknown session
  // ----------------------------------------------------------

  if (!session) {
    const exception = await recordPaymentException({
      supabase,
      session: null,
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
      currency,
      reason: "UNKNOWN_SESSION",
      details: {
        webhook_event: "payment.captured",
        session_found: false,
        webhook_payload_mismatch: webhookPayloadMismatch,
        webhook_order_id: eventOrderId,
        webhook_amount: eventAmount,
        webhook_currency: eventCurrency,
      },
    });

    return {
      exception: true,
      exceptionId: exception.id,
      reason: exception.reason,
      message: "Captured payment has no matching checkout session.",
    };
  }

  // ----------------------------------------------------------
  // Verify session order association
  // ----------------------------------------------------------

  if (session.razorpay_order_id !== razorpayOrderId) {
    const exception = await recordPaymentException({
      supabase,
      session,
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
      currency,
      reason: "ORDER_ID_MISMATCH",
      details: {
        expected_order_id: session.razorpay_order_id,
        received_order_id: razorpayOrderId,
      },
    });

    return {
      exception: true,
      exceptionId: exception.id,
      reason: exception.reason,
    };
  }

  // ----------------------------------------------------------
  // Verify currency
  // ----------------------------------------------------------

  if (currency !== "INR") {
    const exception = await recordPaymentException({
      supabase,
      session,
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
      currency,
      reason: "CURRENCY_MISMATCH",
      details: {
        expected_currency: "INR",
        received_currency: currency,
      },
    });

    return {
      exception: true,
      exceptionId: exception.id,
      reason: exception.reason,
    };
  }

  // ----------------------------------------------------------
  // Verify webhook data against Razorpay API
  // ----------------------------------------------------------

  if (webhookPayloadMismatch) {
    const exception = await recordPaymentException({
      supabase,
      session,
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
      currency,
      reason: "WEBHOOK_API_MISMATCH",
      details: {
        webhook_order_id: eventOrderId,
        api_order_id: razorpayOrderId,
        webhook_amount: eventAmount,
        api_amount: amountPaise,
        webhook_currency: eventCurrency,
        api_currency: currency,
      },
    });

    return {
      exception: true,
      exceptionId: exception.id,
      reason: exception.reason,
    };
  }

  // ----------------------------------------------------------
  // Validate expected checkout amount
  // ----------------------------------------------------------

  const expectedAmount = Math.round(
    Number(session.total_amount ?? 0) * 100
  );

  if (
    !Number.isSafeInteger(expectedAmount) ||
    expectedAmount <= 0
  ) {
    const exception = await recordPaymentException({
      supabase,
      session,
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
      currency,
      reason: "INVALID_SESSION_AMOUNT",
      details: {
        session_total_amount: session.total_amount,
        expected_amount_paise: expectedAmount,
        captured_amount_paise: amountPaise,
      },
    });

    return {
      exception: true,
      exceptionId: exception.id,
      reason: exception.reason,
    };
  }

  if (amountPaise !== expectedAmount) {
    const exception = await recordPaymentException({
      supabase,
      session,
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
      currency,
      reason: "AMOUNT_MISMATCH",
      details: {
        expected_amount_paise: expectedAmount,
        captured_amount_paise: amountPaise,
      },
    });

    return {
      exception: true,
      exceptionId: exception.id,
      reason: exception.reason,
    };
  }

  // ----------------------------------------------------------
  // Finalize verified captured payment
  // ----------------------------------------------------------

  const {
    data: finalizeResult,
    error: finalizeError,
  } = await supabase.rpc(
    "finalize_store_payment",
    {
      p_session_id: session.id,
      p_razorpay_order_id: razorpayOrderId,
      p_razorpay_payment_id: razorpayPaymentId,
      p_razorpay_signature: null,
    }
  );

  if (finalizeError) {
    console.error(
      "Captured payment finalization failed:",
      {
        sessionId: session.id,
        razorpayOrderId,
        razorpayPaymentId,
        error: finalizeError,
      }
    );

    throw new Error(
      `Payment finalization failed: ${finalizeError.message}`
    );
  }

  let result = finalizeResult;

  if (typeof result === "string") {
    try {
      result = JSON.parse(result);
    } catch {
      throw new Error(
        "Payment finalization returned invalid JSON."
      );
    }
  }

  if (
    !result ||
    typeof result !== "object" ||
    result.success !== true
  ) {
    throw new Error(
      "Payment finalization did not confirm success."
    );
  }

  return {
    finalized: true,
    sessionId: session.id,
    result,
  };
}

// ============================================================
// 7. PROCESS REFUND EVENTS
// ============================================================

async function processRefundEvent(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  event: string,
  refundEntity: RazorpayRefund
) {
  const refundId = String(
    refundEntity.id ?? ""
  ).trim();

  const razorpayPaymentId = String(
    refundEntity.payment_id ?? ""
  ).trim();

  const amountPaise = Number(refundEntity.amount);

  const currency = String(
    refundEntity.currency ?? ""
  ).toUpperCase();

  const razorpayRefundStatus = String(
    refundEntity.status ?? ""
  ).toLowerCase();

  if (!refundId || !razorpayPaymentId) {
    throw new Error(
      "Refund event is missing refund ID or payment ID."
    );
  }

  if (
    !Number.isSafeInteger(amountPaise) ||
    amountPaise <= 0
  ) {
    throw new Error(
      "Refund event contains an invalid refund amount."
    );
  }

  let incomingStatus: "PENDING" | "PROCESSED" | "FAILED";

  if (
    event === "refund.processed" &&
    razorpayRefundStatus === "processed"
  ) {
    incomingStatus = "PROCESSED";
  } else if (
    event === "refund.failed" ||
    razorpayRefundStatus === "failed"
  ) {
    incomingStatus = "FAILED";
  } else {
    incomingStatus = "PENDING";
  }

  // ----------------------------------------------------------
  // Find original order and payment exception
  // ----------------------------------------------------------

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("id, total_amount, payment_status")
    .eq("razorpay_payment_id", razorpayPaymentId)
    .maybeSingle();

  if (orderError) {
    throw new Error(
      `Unable to locate refunded order: ${orderError.message}`
    );
  }

  const {
    data: exception,
    error: exceptionError,
  } = await supabase
    .from("store_payment_exceptions")
    .select(
      "id, amount_paise, total_refunded_paise, status"
    )
    .eq("razorpay_payment_id", razorpayPaymentId)
    .maybeSingle();

  if (exceptionError) {
    throw new Error(
      `Unable to locate payment exception: ${exceptionError.message}`
    );
  }

  // ----------------------------------------------------------
  // Preserve terminal refund states on duplicate webhooks
  // ----------------------------------------------------------

  const {
    data: existingRefund,
    error: existingRefundError,
  } = await supabase
    .from("store_payment_refunds")
    .select("id, status")
    .eq("razorpay_refund_id", refundId)
    .maybeSingle();

  if (existingRefundError) {
    throw new Error(
      `Unable to check existing refund: ${existingRefundError.message}`
    );
  }

  let finalStatus = incomingStatus;

  if (existingRefund?.status === "PROCESSED") {
    finalStatus = "PROCESSED";
  } else if (
    existingRefund?.status === "FAILED" &&
    incomingStatus === "PENDING"
  ) {
    finalStatus = "FAILED";
  }

  // ----------------------------------------------------------
  // Upsert refund ledger by Razorpay refund ID
  // ----------------------------------------------------------

  const refundData = {
    exception_id: exception?.id ?? null,
    order_id: order?.id ?? null,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_refund_id: refundId,
    amount_paise: amountPaise,
    currency,
    status: finalStatus,
    notes: {
      webhook_event: event,
      razorpay_refund_status: razorpayRefundStatus,
    },
    processed_at:
      finalStatus === "PROCESSED"
        ? new Date().toISOString()
        : null,
    updated_at: new Date().toISOString(),
  };

  const {
    error: refundUpsertError,
  } = await supabase
    .from("store_payment_refunds")
    .upsert(
      refundData,
      {
        onConflict: "razorpay_refund_id",
      }
    );

  if (refundUpsertError) {
    throw new Error(
      `Unable to save refund ledger: ${refundUpsertError.message}`
    );
  }

  // Only processed refunds contribute to refunded totals.

  if (finalStatus !== "PROCESSED") {
    return {
      refundId,
      razorpayPaymentId,
      refundStatus: finalStatus,
      refunded: false,
    };
  }

  // ----------------------------------------------------------
  // Calculate cumulative processed refunds
  // ----------------------------------------------------------

  const {
    data: processedRefunds,
    error: processedRefundsError,
  } = await supabase
    .from("store_payment_refunds")
    .select("amount_paise")
    .eq("razorpay_payment_id", razorpayPaymentId)
    .eq("status", "PROCESSED");

  if (processedRefundsError) {
    throw new Error(
      `Unable to calculate processed refunds: ${processedRefundsError.message}`
    );
  }

  const totalRefundedPaise = (
    processedRefunds ?? []
  ).reduce(
    (total, item) => total + Number(item.amount_paise),
    0
  );

  if (!Number.isSafeInteger(totalRefundedPaise)) {
    throw new Error(
      "Cumulative refund amount is invalid."
    );
  }

  const capturedAmountPaise = order
    ? Math.round(Number(order.total_amount) * 100)
    : exception
      ? Number(exception.amount_paise)
      : null;

  if (
    capturedAmountPaise !== null &&
    totalRefundedPaise > capturedAmountPaise
  ) {
    console.error(
      "Cumulative processed refunds exceed captured amount.",
      {
        razorpayPaymentId,
        capturedAmountPaise,
        totalRefundedPaise,
      }
    );

    throw new Error(
      "Processed refunds exceed the original captured payment amount. Manual review is required."
    );
  }

  const fullyRefunded =
    capturedAmountPaise !== null &&
    totalRefundedPaise >= capturedAmountPaise;

  // ----------------------------------------------------------
  // Update payment exception refund totals
  // ----------------------------------------------------------

  if (exception) {
    const { error: exceptionUpdateError } = await supabase
      .from("store_payment_exceptions")
      .update({
        total_refunded_paise: totalRefundedPaise,
        status: fullyRefunded
          ? "REFUNDED"
          : "REFUND_INITIATED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", exception.id);

    if (exceptionUpdateError) {
      throw new Error(
        `Unable to update payment exception refund totals: ${exceptionUpdateError.message}`
      );
    }
  }

  // ----------------------------------------------------------
  // Mark order REFUNDED only after full refund
  // ----------------------------------------------------------

  if (order && fullyRefunded) {
    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({
        payment_status: "REFUNDED",
        status: "REFUNDED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (orderUpdateError) {
      throw new Error(
        `Unable to update fully refunded order: ${orderUpdateError.message}`
      );
    }
  }

  return {
    refundId,
    razorpayPaymentId,
    refundStatus: finalStatus,
    totalRefundedPaise,
    capturedAmountPaise,
    fullyRefunded,
  };
}

// ============================================================
// 8. POST WEBHOOK
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // --------------------------------------------------------
    // STEP 1: VERIFY WEBHOOK CONFIGURATION
    // --------------------------------------------------------

    const webhookSecret = requiredEnv(
      "RAZORPAY_WEBHOOK_SECRET"
    );

    // --------------------------------------------------------
    // STEP 2: READ RAW BODY
    // --------------------------------------------------------

    const rawBody = await request.text();

    if (!rawBody) {
      return NextResponse.json(
        {
          success: false,
          error: "Empty webhook payload.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // STEP 3: VERIFY WEBHOOK SIGNATURE
    // --------------------------------------------------------

    const webhookSignature =
      request.headers.get("x-razorpay-signature") ?? "";

    if (!webhookSignature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing webhook signature.",
        },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (
      !safeEqualHex(
        webhookSignature,
        expectedSignature
      )
    ) {
      console.error(
        "Invalid Razorpay webhook signature."
      );

      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // STEP 4: PARSE PAYLOAD
    // --------------------------------------------------------

    let payload: Record<string, any>;

    try {
      const parsed = JSON.parse(rawBody);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new Error("Invalid payload structure.");
      }

      payload = parsed;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook payload.",
        },
        { status: 400 }
      );
    }

    const event = String(
      payload.event ?? ""
    ).trim();

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "Webhook event is missing.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // STEP 5: PAYMENT CAPTURED
    // ========================================================

    if (event === "payment.captured") {
      const paymentEntity =
        payload?.payload?.payment?.entity as
          | RazorpayPayment
          | undefined;

      if (!paymentEntity) {
        return NextResponse.json(
          {
            success: false,
            error: "Captured payment entity is missing.",
          },
          { status: 400 }
        );
      }

      const result = await processCapturedPayment(
        supabaseAdmin,
        paymentEntity
      );

      console.log(
        "Captured payment webhook processed.",
        result
      );

      return webhookResponse(event, result);
    }

    // ========================================================
    // STEP 6: PAYMENT FAILED
    // ========================================================

    if (event === "payment.failed") {
      const paymentEntity =
        payload?.payload?.payment?.entity;

      console.log(
        "Razorpay payment attempt failed.",
        {
          razorpayPaymentId: paymentEntity?.id ?? null,
          razorpayOrderId: paymentEntity?.order_id ?? null,
          reason:
            paymentEntity?.error_description ??
            paymentEntity?.error_reason ??
            null,
        }
      );

      /*
       * Failed payment attempts do not:
       * - Create orders.
       * - Deduct inventory.
       * - Create SALE inventory movements.
       * - Permanently fail a payment session.
       */

      return webhookResponse(event, {
        ignored: true,
        reason:
          "Failed payment attempts do not finalize orders.",
      });
    }

    // ========================================================
    // STEP 7: REFUND EVENTS
    // ========================================================

    if (
      event === "refund.created" ||
      event === "refund.processed" ||
      event === "refund.failed"
    ) {
      const refundEntity =
        payload?.payload?.refund?.entity as
          | RazorpayRefund
          | undefined;

      if (!refundEntity) {
        return NextResponse.json(
          {
            success: false,
            error: "Refund entity is missing.",
          },
          { status: 400 }
        );
      }

      const result = await processRefundEvent(
        supabaseAdmin,
        event,
        refundEntity
      );

      console.log(
        "Razorpay refund webhook processed.",
        result
      );

      return webhookResponse(event, result);
    }

    // ========================================================
    // STEP 8: IGNORE OTHER EVENTS
    // ========================================================

    return webhookResponse(event, {
      ignored: true,
      reason: "Event is not handled by this endpoint.",
    });

  } catch (error) {
    console.error(
      "Razorpay webhook processing error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}
