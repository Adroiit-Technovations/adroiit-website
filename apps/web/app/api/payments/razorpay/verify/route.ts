
import { createHmac, timingSafeEqual } from "crypto";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ============================================================
// ADMIN SECURITY CONFIGURATION
// ============================================================

const ADMIN_CHECKOUT_MESSAGE =
  "This email address is reserved for Adroiit administration and cannot be used for customer checkout. Please use another email address.";

function getAdminIdentity() {
  const userId = process.env.ADMIN_USER_ID?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!userId || !email) {
    throw new Error(
      "Admin security configuration is missing on the server."
    );
  }

  return {
    userId: userId.toLowerCase(),
    email,
  };
}

function isAdminUserId(value: unknown) {
  const admin = getAdminIdentity();

  return (
    String(value ?? "").trim().toLowerCase() === admin.userId
  );
}

function isAdminEmail(value: unknown) {
  const admin = getAdminIdentity();

  return (
    String(value ?? "").trim().toLowerCase() === admin.email
  );
}

function getAdminCheckoutResponse() {
  return NextResponse.json(
    {
      success: false,
      code: "ADMIN_CUSTOMER_NOT_ALLOWED",
      message: ADMIN_CHECKOUT_MESSAGE,
    },
    { status: 403 }
  );
}

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

type FinalizedPayment = {
  success?: boolean;
  exception?: boolean;
  exception_id?: string;
  reason?: string;
  status?: string;
  message?: string;
  order_id?: string;
  order_number?: string;
  total_amount?: number;
  already_processed?: boolean;
};

type PaymentException = {
  id: string;
  payment_session_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string;
  amount_paise: number;
  currency: string;
  reason: string;
  status: string;
  details?: Record<string, unknown>;
};

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured on the server.`);
  }

  return value;
}

// ============================================================
// SUPABASE ADMIN CLIENT
// ============================================================

function createAdminClient() {
  return createSupabaseAdmin(
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
// AUTHENTICATED USER
// ============================================================

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Existing authenticated session is sufficient.
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `Unable to read the authenticated session: ${error.message}`
    );
  }

  return data.user ?? null;
}

// ============================================================
// RAZORPAY CHECKOUT SIGNATURE VALIDATION
// ============================================================

function verifySignature({
  orderId,
  paymentId,
  signature,
  secret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  if (!/^[a-f0-9]{64}$/i.test(signature)) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  if (
    expectedBuffer.length !== 32 ||
    receivedBuffer.length !== 32
  ) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

// ============================================================
// RAZORPAY API REQUEST
// ============================================================

async function razorpayGet<T>(
  path: string,
  keyId: string,
  keySecret: string
): Promise<T> {
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
        `Razorpay returned HTTP ${response.status}.`
    );
  }

  return data as T;
}

// ============================================================
// FINALIZATION RESPONSE VALIDATION
// ============================================================

function parseFinalizedResult(
  value: unknown
): FinalizedPayment {
  let result = value;

  if (typeof result === "string") {
    try {
      result = JSON.parse(result);
    } catch {
      throw new Error(
        "The payment finalization function returned invalid data."
      );
    }
  }

  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result)
  ) {
    throw new Error(
      "The payment finalization function returned an invalid result."
    );
  }

  const parsed = result as FinalizedPayment;

  if (parsed.success !== true) {
    throw new Error(
      "The payment finalization function did not confirm success."
    );
  }

  // An exception is a successfully recorded payment outcome.
  // It does not require an order number.
  if (parsed.exception === true) {
    if (!parsed.exception_id && !parsed.reason) {
      throw new Error(
        "The payment exception was returned without an identifiable record."
      );
    }

    return parsed;
  }

  return parsed;
}

// ============================================================
// PAYMENT EXCEPTION RESPONSE
// ============================================================

function exceptionResponse(exception: {
  id?: string;
  reason?: string;
  status?: string;
  message?: string;
  amount_paise?: number;
}) {
  const reason = String(
    exception.reason ?? "PAYMENT_REQUIRES_REVIEW"
  );

  const messages: Record<string, string> = {
    SESSION_EXPIRED:
      "Your payment was captured, but the checkout session expired before your order could be confirmed.",

    SESSION_NOT_PENDING:
      "Your payment was captured, but the checkout session is no longer pending.",

    INSUFFICIENT_STOCK:
      "Your payment was captured, but the requested product quantity is no longer available.",

    PRODUCT_UNAVAILABLE:
      "Your payment was captured, but one or more products are no longer available.",

    INVALID_PAYMENT_SESSION_ITEMS:
      "Your payment was captured, but the order details require manual review.",

    INVALID_PRODUCT_ITEM:
      "Your payment was captured, but the order details require manual review.",

    INVALID_PRODUCT_ID:
      "Your payment was captured, but the order details require manual review.",

    INVALID_PRODUCT_QUANTITY:
      "Your payment was captured, but the order details require manual review.",

    INVALID_PRODUCT_PRICE:
      "Your payment was captured, but the order details require manual review.",

    ORDER_ALREADY_PAID_WITH_DIFFERENT_PAYMENT:
      "Your payment was captured, but this checkout already has another successful payment. The additional payment has been recorded for review.",
  };

  return NextResponse.json(
    {
      success: true,
      exception: true,
      order_created: false,
      payment_status: "CAPTURED",
      order_status: "REVIEW_REQUIRED",
      exception_id: exception.id ?? null,
      exception_reason: reason,
      exception_status: exception.status ?? "REVIEW_REQUIRED",
      amount:
        typeof exception.amount_paise === "number"
          ? exception.amount_paise / 100
          : null,
      message:
        exception.message ||
        messages[reason] ||
        "Your payment was captured, but your order could not be confirmed. The payment has been recorded for review. Please contact Adroiit support.",
    },
    { status: 200 }
  );
}

// ============================================================
// POST: VERIFY RAZORPAY PAYMENT
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // --------------------------------------------------------
    // 1. VALIDATE ADMIN SECURITY CONFIGURATION
    // --------------------------------------------------------

    const admin = getAdminIdentity();

    // --------------------------------------------------------
    // 2. PARSE REQUEST
    // --------------------------------------------------------

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment verification request.",
        },
        { status: 400 }
      );
    }

    const values =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : {};

    const sessionId = String(
      values.session_id ?? ""
    ).trim();

    const razorpayOrderId = String(
      values.razorpay_order_id ?? ""
    ).trim();

    const razorpayPaymentId = String(
      values.razorpay_payment_id ?? ""
    ).trim();

    const razorpaySignature = String(
      values.razorpay_signature ?? ""
    ).trim();

    if (
      !sessionId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete Razorpay payment verification data is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 3. AUTHENTICATE USER
    // --------------------------------------------------------

    const authenticatedUser = await getAuthenticatedUser();

    if (!authenticatedUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your login session has expired. Please sign in again.",
        },
        { status: 401 }
      );
    }

    const userId = authenticatedUser.id;
    const authenticatedEmail =
      authenticatedUser.email?.trim().toLowerCase() ?? "";

    // --------------------------------------------------------
    // 4. BLOCK ADMINISTRATOR ACCOUNT
    // --------------------------------------------------------

    if (
      userId.toLowerCase() === admin.userId ||
      authenticatedEmail === admin.email
    ) {
      return getAdminCheckoutResponse();
    }

    const supabase = createAdminClient();

    // --------------------------------------------------------
    // 5. LOAD PAYMENT SESSION
    // --------------------------------------------------------

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from("store_payment_sessions")
      .select(
        [
          "id",
          "user_id",
          "customer_email",
          "total_amount",
          "status",
          "razorpay_order_id",
          "expires_at",
        ].join(",")
      )
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError) {
      throw new Error(
        `Unable to load the payment session: ${sessionError.message}`
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment session not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------------
    // 6. VERIFY SESSION OWNERSHIP
    // --------------------------------------------------------

    if (session.user_id !== userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to verify this payment session.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------------
    // 7. BLOCK ADMIN-OWNED OR ADMIN-EMAIL SESSIONS
    // --------------------------------------------------------

    if (
      String(session.user_id ?? "").trim().toLowerCase() ===
        admin.userId ||
      String(session.customer_email ?? "")
        .trim()
        .toLowerCase() === admin.email
    ) {
      return getAdminCheckoutResponse();
    }

    // --------------------------------------------------------
    // 8. VERIFY RAZORPAY ORDER ID
    // --------------------------------------------------------

    if (
      String(session.razorpay_order_id ?? "").trim() !==
      razorpayOrderId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Razorpay order ID does not match the payment session.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 9. VERIFY CHECKOUT SIGNATURE
    // --------------------------------------------------------

    const razorpayKeyId = requiredEnv("RAZORPAY_KEY_ID");

    const razorpayKeySecret = requiredEnv(
      "RAZORPAY_KEY_SECRET"
    );

    const signatureValid = verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
      secret: razorpayKeySecret,
    });

    if (!signatureValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Razorpay payment signature verification failed.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 10. CHECK FOR AN ALREADY FINALIZED PAYMENT
    // --------------------------------------------------------

    const {
      data: existingOrder,
      error: existingOrderError,
    } = await supabase
      .from("orders")
      .select(
        [
          "id",
          "order_number",
          "total_amount",
          "payment_status",
          "razorpay_order_id",
          "razorpay_payment_id",
        ].join(",")
      )
      .eq("razorpay_payment_id", razorpayPaymentId)
      .maybeSingle();

    if (existingOrderError) {
      throw new Error(
        `Unable to check the existing order: ${existingOrderError.message}`
      );
    }

    if (existingOrder) {
      if (
        String(existingOrder.razorpay_order_id ?? "") !==
        razorpayOrderId
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The payment ID is already associated with a different Razorpay order.",
          },
          { status: 409 }
        );
      }

      if (
        String(existingOrder.payment_status ?? "").toUpperCase() !==
        "PAID"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The existing order is not marked as paid.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        exception: false,
        already_processed: true,
        payment_status: "PAID",
        order_created: true,
        order_id: existingOrder.id,
        order_number: existingOrder.order_number,
        amount: Number(existingOrder.total_amount ?? 0),
      });
    }

    // --------------------------------------------------------
    // 11. FETCH PAYMENT DIRECTLY FROM RAZORPAY
    // --------------------------------------------------------

    /*
     * Do this before rejecting the session status.
     *
     * A session may now be EXCEPTION because a captured payment
     * could not be converted into an order. We must still verify
     * the actual Razorpay payment before returning that result.
     */

    const payment = await razorpayGet<RazorpayPayment>(
      `/payments/${encodeURIComponent(razorpayPaymentId)}`,
      razorpayKeyId,
      razorpayKeySecret
    );

    // --------------------------------------------------------
    // 12. VALIDATE PAYMENT DETAILS
    // --------------------------------------------------------

    const sessionAmountInPaise = Math.round(
      Number(session.total_amount ?? 0) * 100
    );

    if (
      !Number.isSafeInteger(sessionAmountInPaise) ||
      sessionAmountInPaise <= 0
    ) {
      throw new Error("Invalid payment session amount.");
    }

    if (
      payment.id !== razorpayPaymentId ||
      payment.order_id !== razorpayOrderId ||
      Number(payment.amount) !== sessionAmountInPaise ||
      String(payment.currency ?? "").toUpperCase() !== "INR"
    ) {
      console.error("Razorpay payment details mismatch.", {
        sessionId,
        razorpayOrderId,
        razorpayPaymentId,
        expectedAmount: sessionAmountInPaise,
        receivedAmount: payment.amount,
        receivedCurrency: payment.currency,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Razorpay payment details do not match the payment session. Please contact support.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 13. CHECK RAZORPAY CAPTURE STATUS
    // --------------------------------------------------------

    const paymentStatus = String(
      payment.status ?? ""
    ).toLowerCase();

    if (paymentStatus !== "captured") {
      if (paymentStatus === "failed") {
        return NextResponse.json({
          success: true,
          exception: false,
          payment_status: "FAILED",
          order_created: false,
          order_number: "",
          amount: Number(session.total_amount ?? 0),
          message:
            "Razorpay reports that this payment failed.",
        });
      }

      return NextResponse.json({
        success: true,
        exception: false,
        payment_status: "PENDING",
        order_created: false,
        order_number: "",
        amount: Number(session.total_amount ?? 0),
        message:
          "Payment has not been captured by Razorpay yet.",
      });
    }

    // --------------------------------------------------------
    // 14. CHECK FOR A PREVIOUSLY RECORDED EXCEPTION
    // --------------------------------------------------------

    const {
      data: existingException,
      error: exceptionLookupError,
    } = await supabase
      .from("store_payment_exceptions")
      .select(
        [
          "id",
          "payment_session_id",
          "razorpay_order_id",
          "razorpay_payment_id",
          "amount_paise",
          "currency",
          "reason",
          "status",
        ].join(",")
      )
      .eq("razorpay_payment_id", razorpayPaymentId)
      .maybeSingle();

    if (exceptionLookupError) {
      throw new Error(
        `Unable to check the payment exception: ${exceptionLookupError.message}`
      );
    }

    if (existingException) {
      if (
        existingException.razorpay_order_id !== razorpayOrderId ||
        existingException.payment_session_id !== sessionId ||
        Number(existingException.amount_paise) !==
          sessionAmountInPaise ||
        String(existingException.currency).toUpperCase() !== "INR"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The recorded payment exception does not match this payment session. Please contact support.",
          },
          { status: 409 }
        );
      }

      return exceptionResponse({
        id: existingException.id,
        reason: existingException.reason,
        status: existingException.status,
        amount_paise: Number(existingException.amount_paise),
      });
    }

    // --------------------------------------------------------
    // 15. FINALIZE CAPTURED PAYMENT
    // --------------------------------------------------------

    /*
     * Only a Razorpay-verified captured payment reaches this RPC.
     *
     * The database function handles both outcomes:
     *
     * SUCCESS:
     * - Creates the PAID order.
     * - Creates order items.
     * - Deducts stock.
     * - Records inventory movements.
     * - Updates customer statistics.
     * - Updates coupon usage.
     *
     * EXCEPTION:
     * - Records the captured payment in store_payment_exceptions.
     * - Does not create an order.
     * - Does not deduct inventory.
     */

    const {
      data: finalized,
      error: finalizeError,
    } = await supabase.rpc(
      "finalize_store_payment",
      {
        p_session_id: sessionId,
        p_razorpay_order_id: razorpayOrderId,
        p_razorpay_payment_id: razorpayPaymentId,
        p_razorpay_signature: razorpaySignature,
      }
    );

    if (finalizeError) {
      console.error(
        "finalize_store_payment failed:",
        {
          sessionId,
          razorpayOrderId,
          razorpayPaymentId,
          error: finalizeError,
        }
      );

      throw new Error(
        "Payment was captured, but the Adroiit order could not be finalized. Please contact support. Your payment details have been retained by Razorpay."
      );
    }

    // --------------------------------------------------------
    // 16. VALIDATE FINALIZATION RESULT
    // --------------------------------------------------------

    const result = parseFinalizedResult(finalized);

    if (result.exception === true) {
      return exceptionResponse({
        id: result.exception_id,
        reason: result.reason,
        status: result.status,
        message: result.message,
        amount_paise: sessionAmountInPaise,
      });
    }

    // --------------------------------------------------------
    // 17. VALIDATE SUCCESSFUL ORDER
    // --------------------------------------------------------

    const finalizedOrderNumber = String(
      result.order_number ?? ""
    ).trim();

    if (!finalizedOrderNumber) {
      throw new Error(
        "Payment was verified, but no Adroiit order number was returned."
      );
    }

    // --------------------------------------------------------
    // 18. SUCCESS RESPONSE
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      exception: false,
      payment_status: "PAID",
      order_created: true,
      already_processed: Boolean(
        result.already_processed
      ),
      order_id: result.order_id ?? null,
      order_number: finalizedOrderNumber,
      amount: Number(
        result.total_amount ??
          session.total_amount ??
          0
      ),
    });

  } catch (error) {
    console.error(
      "Razorpay verification route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to verify the payment.",
      },
      { status: 500 }
    );
  }
}
