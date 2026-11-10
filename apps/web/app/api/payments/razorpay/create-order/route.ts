
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ADMIN_CHECKOUT_MESSAGE =
  "This email address is reserved for Adroiit administration and cannot be used for customer checkout. Please use another email address.";

type PaymentSession = {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number | string | null;
  status: string | null;
  razorpay_order_id: string | null;
  expires_at: string | null;
};

type RazorpayOrder = {
  id?: string;
  amount?: number;
  amount_paid?: number;
  amount_due?: number;
  currency?: string;
  status?: string;
  receipt?: string;
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured on the server.`);
  }

  return value;
}

/**
 * Admin identity configuration.
 * These values are read exclusively from server-side environment variables.
 */
function getAdminIdentity() {
  return {
    userId: requiredEnv("ADMIN_USER_ID").toLowerCase(),
    email: requiredEnv("ADMIN_EMAIL").toLowerCase(),
  };
}

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
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              }
            );
          } catch {
            // The route only needs to read the current auth state.
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

function isAdminEmail(value: unknown) {
  const admin = getAdminIdentity();

  return (
    String(value ?? "").trim().toLowerCase() === admin.email
  );
}

function isAdminUserId(value: unknown) {
  const admin = getAdminIdentity();

  return (
    String(value ?? "").trim().toLowerCase() === admin.userId
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

function getRazorpayConfig() {
  return {
    keyId: requiredEnv("RAZORPAY_KEY_ID"),
    keySecret: requiredEnv("RAZORPAY_KEY_SECRET"),
  };
}

function toPaise(value: unknown) {
  const rupees = Number(value ?? 0);

  if (
    !Number.isFinite(rupees) ||
    rupees <= 0
  ) {
    return null;
  }

  const paise = Math.round(rupees * 100);

  if (
    !Number.isSafeInteger(paise) ||
    paise <= 0
  ) {
    return null;
  }

  return paise;
}

function normalizePhone(value: unknown) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^91/, "");
}

function makeReceipt(sessionId: string) {
  return `ATPAY-${sessionId.replace(/-/g, "").slice(0, 24)}`;
}

async function razorpayRequest<T>(
  method: "GET" | "POST",
  path: string,
  keyId: string,
  keySecret: string,
  body?: unknown
) {
  const authorization = Buffer.from(
    `${keyId}:${keySecret}`
  ).toString("base64");

  const response = await fetch(
    `https://api.razorpay.com/v1${path}`,
    {
      method,
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      ...(body === undefined
        ? {}
        : { body: JSON.stringify(body) }),
      cache: "no-store",
    }
  );

  const responseText = await response.text();

  let data: T | RazorpayOrder = {} as T;

  try {
    data = responseText
      ? (JSON.parse(responseText) as T)
      : ({} as T);
  } catch {
    throw new Error(
      `Razorpay returned an invalid response (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    const error = data as RazorpayOrder;

    throw new Error(
      error.error?.description ||
        error.error?.reason ||
        `Razorpay returned HTTP ${response.status}.`
    );
  }

  return data as T;
}

async function getRazorpayOrder(
  orderId: string,
  keyId: string,
  keySecret: string
) {
  return razorpayRequest<RazorpayOrder>(
    "GET",
    `/orders/${encodeURIComponent(orderId)}`,
    keyId,
    keySecret
  );
}

export async function POST(request: NextRequest) {
  try {
    // Validate administrator configuration before processing checkout.
    const admin = getAdminIdentity();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment request body.",
        },
        { status: 400 }
      );
    }

    const sessionId =
      typeof body === "object" &&
      body !== null &&
      "session_id" in body
        ? String(
            (body as {
              session_id?: unknown;
            }).session_id ?? ""
          ).trim()
        : "";

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment session ID is required.",
        },
        { status: 400 }
      );
    }

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

    // Block the administrator account before any payment processing.
    if (
      userId.toLowerCase() === admin.userId ||
      authenticatedUser.email?.trim().toLowerCase() === admin.email
    ) {
      return getAdminCheckoutResponse();
    }

    const supabase = createAdminClient();

    const {
      data: row,
      error: sessionError,
    } = await supabase
      .from("store_payment_sessions")
      .select(
        "id,user_id,customer_name,customer_email,customer_phone,total_amount,status,razorpay_order_id,expires_at"
      )
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error(
        "Payment session lookup failed:",
        sessionError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            `Unable to load the payment session: ${sessionError.message}`,
        },
        { status: 500 }
      );
    }

    if (!row) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment session not found.",
        },
        { status: 404 }
      );
    }

    const session = row as PaymentSession;

    if (session.user_id !== userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to use this payment session.",
        },
        { status: 403 }
      );
    }

    // Block administrator-owned sessions and reserved administrator email.
    if (
      session.user_id.toLowerCase() === admin.userId ||
      session.customer_email.trim().toLowerCase() === admin.email
    ) {
      return getAdminCheckoutResponse();
    }

    const status = String(
      session.status ?? ""
    ).toUpperCase();

    if (status === "PAID") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This payment session has already been completed.",
        },
        { status: 409 }
      );
    }

    if (status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            `Payment session is ${status || "not pending"}.`,
        },
        { status: 409 }
      );
    }

    if (
      session.expires_at &&
      new Date(session.expires_at).getTime() <= Date.now()
    ) {
      await supabase
        .from("store_payment_sessions")
        .update({
          status: "EXPIRED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id)
        .eq("status", "PENDING");

      return NextResponse.json(
        {
          success: false,
          message:
            "This payment session has expired. Please return to checkout and try again.",
        },
        { status: 409 }
      );
    }

    const amountInPaise = toPaise(session.total_amount);

    if (!amountInPaise) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The payment amount stored for this session is invalid.",
        },
        { status: 400 }
      );
    }

    const { keyId, keySecret } = getRazorpayConfig();

    /*
     * Reuse the Razorpay order if this session already has one.
     * This makes retries safe and avoids unnecessary duplicate
     * Razorpay orders.
     */
    if (session.razorpay_order_id) {
      try {
        const existing = await getRazorpayOrder(
          session.razorpay_order_id,
          keyId,
          keySecret
        );

        if (
          existing.id === session.razorpay_order_id &&
          Number(existing.amount) === amountInPaise &&
          String(existing.currency).toUpperCase() === "INR"
        ) {
          if (
            String(existing.status).toLowerCase() === "paid"
          ) {
            return NextResponse.json(
              {
                success: false,
                message:
                  "Razorpay reports this payment order as already paid. Please use the payment verification flow.",
              },
              { status: 409 }
            );
          }

          return NextResponse.json({
            success: true,
            session_id: session.id,
            razorpay_order_id: session.razorpay_order_id,
            amount: Number(session.total_amount ?? 0),
            amount_in_paise: amountInPaise,
            currency: "INR",
            key_id: keyId,
            customer: {
              name: session.customer_name,
              email: session.customer_email,
              phone: normalizePhone(session.customer_phone),
            },
            reused: true,
          });
        }
      } catch (error) {
        console.warn(
          "Existing Razorpay order could not be reused; creating a fresh order:",
          error
        );

        await supabase
          .from("store_payment_sessions")
          .update({
            razorpay_order_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.id)
          .eq(
            "razorpay_order_id",
            session.razorpay_order_id
          );
      }
    }

    const razorpayOrder =
      await razorpayRequest<RazorpayOrder>(
        "POST",
        "/orders",
        keyId,
        keySecret,
        {
          amount: amountInPaise,
          currency: "INR",
          receipt: makeReceipt(session.id),
          notes: {
            payment_session_id: session.id,
          },
        }
      );

    const newRazorpayOrderId =
      String(razorpayOrder.id ?? "").trim();

    if (!newRazorpayOrderId) {
      throw new Error(
        "Razorpay did not return a valid order ID."
      );
    }

    if (
      Number(razorpayOrder.amount) !== amountInPaise ||
      String(razorpayOrder.currency).toUpperCase() !== "INR"
    ) {
      throw new Error(
        "Razorpay returned an amount or currency that does not match the payment session."
      );
    }

    const {
      data: updated,
      error: updateError,
    } = await supabase
      .from("store_payment_sessions")
      .update({
        razorpay_order_id: newRazorpayOrderId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id)
      .eq("user_id", userId)
      .eq("status", "PENDING")
      .is("razorpay_order_id", null)
      .select("id,razorpay_order_id")
      .maybeSingle();

    if (updateError) {
      console.error(
        "Unable to attach Razorpay order to payment session:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            `Razorpay order was created, but the payment session could not be updated: ${updateError.message}`,
        },
        { status: 500 }
      );
    }

    let effectiveOrderId =
      String(updated?.razorpay_order_id ?? "").trim();

    if (!effectiveOrderId) {
      const { data: current } = await supabase
        .from("store_payment_sessions")
        .select("razorpay_order_id")
        .eq("id", session.id)
        .maybeSingle();

      effectiveOrderId =
        String(
          current?.razorpay_order_id ?? newRazorpayOrderId
        ).trim();
    }

    return NextResponse.json({
      success: true,
      session_id: session.id,
      razorpay_order_id: effectiveOrderId,
      amount: Number(session.total_amount ?? 0),
      amount_in_paise: amountInPaise,
      currency: "INR",
      key_id: keyId,
      customer: {
        name: session.customer_name,
        email: session.customer_email,
        phone: normalizePhone(session.customer_phone),
      },
    });
  } catch (error) {
    console.error(
      "Razorpay create-order route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create payment order.",
      },
      { status: 500 }
    );
  }
}
