
"use client";

import Link from "next/link";
import Script from "next/script";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

type PaymentState =
  | "loading"
  | "ready"
  | "opening"
  | "verifying"
  | "paid"
  | "failed"
  | "pending"
  | "error";

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: {
      error?: {
        code?: string;
        description?: string;
        source?: string;
        step?: string;
        reason?: string;
        metadata?: Record<string, unknown>;
      };
    }) => void
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayOptions
    ) => RazorpayInstance;
  }
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PaymentPage() {
  const [paymentState, setPaymentState] =
    useState<PaymentState>("loading");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [orderNumber, setOrderNumber] =
    useState("");

  const [sessionId, setSessionId] =
    useState("");

  const [amount, setAmount] =
    useState(0);

  const [razorpayOrderId, setRazorpayOrderId] =
    useState("");

  const [razorpayKeyId, setRazorpayKeyId] =
    useState("");

  const [razorpayLoaded, setRazorpayLoaded] =
    useState(false);

  const initializedSessionRef = useRef(false);
  const paymentAttemptRef = useRef(false);
  const verificationStartedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const querySessionId =
      params.get("session_id")?.trim() ?? "";

    if (!querySessionId) {
      setPaymentState("error");
      setErrorMessage(
        "No payment session was provided. Please return to checkout and try again."
      );
      return;
    }

    if (initializedSessionRef.current) {
      return;
    }

    initializedSessionRef.current = true;

    setSessionId(querySessionId);

    void createPaymentOrder(querySessionId);
  }, []);

  async function createPaymentOrder(
    currentSessionId: string
  ) {
    try {
      setPaymentState("loading");
      setErrorMessage(null);

      const response = await fetch(
        "/api/payments/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: currentSessionId,
          }),
          cache: "no-store",
        }
      );

      let data: Record<string, unknown> | null =
        null;

      try {
        data = (await response.json()) as Record<
          string,
          unknown
        >;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          typeof data?.message === "string" &&
          data.message.trim()
            ? data.message
            : "Unable to create payment order."
        );
      }

      const returnedSessionId = String(
        data?.session_id ?? currentSessionId
      ).trim();

      const returnedRazorpayOrderId = String(
        data?.razorpay_order_id ?? ""
      ).trim();

      const returnedKeyId = String(
        data?.key_id ?? ""
      ).trim();

      const returnedAmount = Number(
        data?.amount ?? 0
      );

      if (!returnedSessionId) {
        throw new Error(
          "Payment session ID was not returned by the server."
        );
      }

      if (!returnedRazorpayOrderId) {
        throw new Error(
          "Razorpay did not return a valid payment order ID."
        );
      }

      if (!returnedKeyId) {
        throw new Error(
          "Razorpay key ID is not configured on the server."
        );
      }

      if (
        !Number.isFinite(returnedAmount) ||
        returnedAmount <= 0
      ) {
        throw new Error(
          "The payment amount returned by the server is invalid."
        );
      }

      setSessionId(returnedSessionId);
      setRazorpayOrderId(returnedRazorpayOrderId);
      setRazorpayKeyId(returnedKeyId);
      setAmount(returnedAmount);
      setOrderNumber(
        String(data?.order_number ?? "")
      );

      setPaymentState("ready");
    } catch (error) {
      console.error(
        "Razorpay payment order creation error:",
        error
      );

      setPaymentState("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create payment order."
      );
    }
  }

  async function verifyPayment(
    response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ) {
    if (verificationStartedRef.current) {
      return;
    }

    verificationStartedRef.current = true;

    try {
      setPaymentState("verifying");
      setErrorMessage(null);

      const verifyResponse = await fetch(
        "/api/payments/razorpay/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            razorpay_order_id:
              response.razorpay_order_id,
            razorpay_payment_id:
              response.razorpay_payment_id,
            razorpay_signature:
              response.razorpay_signature,
          }),
          cache: "no-store",
        }
      );

      let data: Record<string, unknown> | null =
        null;

      try {
        data = (await verifyResponse.json()) as Record<
          string,
          unknown
        >;
      } catch {
        data = null;
      }

      if (!verifyResponse.ok) {
        throw new Error(
          typeof data?.message === "string" &&
          data.message.trim()
            ? data.message
            : "Unable to verify the payment."
        );
      }

      // IMPORTANT:
      // Never assume PAID when the API omits payment_status.
      const status = String(
        data?.payment_status ?? ""
      )
        .trim()
        .toUpperCase();

      if (status === "PAID") {
        const confirmedAmount = Number(
          data?.amount ?? amount
        );

        setOrderNumber(
          String(data?.order_number ?? orderNumber)
        );

        if (
          Number.isFinite(confirmedAmount) &&
          confirmedAmount > 0
        ) {
          setAmount(confirmedAmount);
        }

        // Clear the cart only after the server explicitly
        // confirms that payment has been verified as PAID.
        try {
          localStorage.removeItem(
            "adroiit-store-cart"
          );

          window.dispatchEvent(
            new Event(
              "adroiit-store-cart-updated"
            )
          );
        } catch (cartError) {
          console.error(
            "Cart cleanup error:",
            cartError
          );
        }

        setPaymentState("paid");
        return;
      }

      if (status === "FAILED") {
        setPaymentState("failed");

        setErrorMessage(
          typeof data?.message === "string"
            ? data.message
            : "Your payment was not completed."
        );

        return;
      }

      // Unknown, missing, or pending status must never
      // be treated as a successful payment.
      setPaymentState("pending");

      setErrorMessage(
        typeof data?.message === "string" &&
        data.message.trim()
          ? data.message
          : "Payment confirmation is still pending. Please try again shortly."
      );
    } catch (error) {
      console.error(
        "Razorpay payment verification error:",
        error
      );

      setPaymentState("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to verify the payment."
      );
    } finally {
      paymentAttemptRef.current = false;
      verificationStartedRef.current = false;
    }
  }

  function openRazorpayCheckout() {
    if (!sessionId) {
      setErrorMessage(
        "Payment session is not available."
      );
      return;
    }

    if (!razorpayOrderId) {
      setErrorMessage(
        "Razorpay payment order is not available."
      );
      return;
    }

    if (!razorpayKeyId) {
      setErrorMessage(
        "Razorpay key ID is not available."
      );
      return;
    }

    if (!razorpayLoaded) {
      setErrorMessage(
        "Razorpay Checkout is still loading. Please try again."
      );
      return;
    }

    if (!window.Razorpay) {
      setErrorMessage(
        "Razorpay Checkout is unavailable. Please refresh the page and try again."
      );
      return;
    }

    if (paymentAttemptRef.current) {
      return;
    }

    paymentAttemptRef.current = true;

    setPaymentState("opening");
    setErrorMessage(null);

    try {
      const checkout = new window.Razorpay({
        key: razorpayKeyId,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Adroiit Technovations",
        description: "Adroiit Store Payment",
        order_id: razorpayOrderId,
        theme: {
          color: "#5921c7",
        },
        handler: (response) => {
          void verifyPayment(response);
        },
        modal: {
          escape: true,
          backdropclose: false,
          ondismiss: () => {
            if (verificationStartedRef.current) {
              return;
            }

            paymentAttemptRef.current = false;

            setPaymentState("ready");
            setErrorMessage(null);
          },
        },
      });

      checkout.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          paymentAttemptRef.current = false;

          setPaymentState("failed");

          setErrorMessage(
            response.error?.description ??
              "Your payment could not be completed."
          );
        }
      );

      checkout.open();
    } catch (error) {
      console.error(
        "Razorpay Checkout error:",
        error
      );

      paymentAttemptRef.current = false;

      setPaymentState("ready");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to open Razorpay Checkout."
      );
    }
  }

  const isProcessing = [
    "loading",
    "opening",
    "verifying",
  ].includes(paymentState);

  return (
    <main
      className={`${bricolage.className} min-h-screen bg-white text-[#17151d]`}
    >
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          setRazorpayLoaded(true);
        }}
        onError={() => {
          setRazorpayLoaded(false);

          setErrorMessage(
            "Unable to load Razorpay Checkout. Please refresh the page and try again."
          );
        }}
      />

      <div className="mx-auto w-full max-w-[1180px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/store"
            className="inline-flex h-[40px] items-center gap-2 rounded-[10px] border border-black/[0.09] bg-white px-4 text-[13px] font-semibold text-[#302c38] transition hover:border-[#5921c7]/30 hover:text-[#5921c7]"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5921c7]">
            Adroiit Store
          </p>

          <h1 className="mt-1 text-[30px] font-bold tracking-[-0.02em] text-[#17151d] sm:text-[34px]">
            Payment
          </h1>

          <p className="mt-1.5 text-[14px] text-[#716d78]">
            Complete your payment securely through Razorpay.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[16px] border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_rgba(23,21,29,0.04)] sm:p-7">
            {paymentState === "paid" && (
              <div className="py-10 text-center">
                <CheckCircle2
                  size={54}
                  className="mx-auto text-[#07885b]"
                />

                <h2 className="mt-5 text-[24px] font-bold">
                  Payment Successful
                </h2>

                <p className="mx-auto mt-2 max-w-[460px] text-[14px] leading-6 text-[#716d78]">
                  Your payment has been verified successfully. Your order has been confirmed.
                </p>

                {orderNumber && (
                  <div className="mt-6 inline-flex rounded-[10px] bg-[#5921c7]/[0.06] px-4 py-2.5 text-[13px] font-semibold text-[#5921c7]">
                    Order #{orderNumber}
                  </div>
                )}

                <div className="mt-7">
                  <Link
                    href="/store"
                    className="inline-flex h-[44px] items-center justify-center rounded-[10px] bg-[#5921c7] px-6 text-[13px] font-bold text-white transition hover:bg-[#6d32df]"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}

            {paymentState === "failed" && (
              <div className="py-10 text-center">
                <XCircle
                  size={54}
                  className="mx-auto text-[#d52f3f]"
                />

                <h2 className="mt-5 text-[24px] font-bold">
                  Payment Failed
                </h2>

                <p className="mx-auto mt-2 max-w-[460px] text-[14px] leading-6 text-[#716d78]">
                  {errorMessage ??
                    "Your payment was not completed. You can try again."}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setPaymentState("ready");
                  }}
                  className="mt-7 inline-flex h-[44px] items-center justify-center rounded-[10px] bg-[#5921c7] px-6 text-[13px] font-bold text-white transition hover:bg-[#6d32df]"
                >
                  Try Payment Again
                </button>
              </div>
            )}

            {paymentState === "pending" && (
              <div className="py-10 text-center">
                <Loader2
                  size={54}
                  className="mx-auto animate-spin text-[#5921c7]"
                />

                <h2 className="mt-5 text-[24px] font-bold">
                  Payment Pending
                </h2>

                <p className="mx-auto mt-2 max-w-[500px] text-[14px] leading-6 text-[#716d78]">
                  {errorMessage ??
                    "We could not confirm the final payment status yet. Please check again shortly."}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setPaymentState("ready");
                  }}
                  className="mt-7 inline-flex h-[44px] items-center justify-center rounded-[10px] border border-[#5921c7]/20 bg-[#5921c7]/[0.05] px-6 text-[13px] font-bold text-[#5921c7] transition hover:bg-[#5921c7]/[0.09]"
                >
                  Try Payment Again
                </button>
              </div>
            )}

            {paymentState === "error" && (
              <div className="py-10 text-center">
                <XCircle
                  size={54}
                  className="mx-auto text-[#d52f3f]"
                />

                <h2 className="mt-5 text-[24px] font-bold">
                  Unable to Process Payment
                </h2>

                <p className="mx-auto mt-2 max-w-[500px] text-[14px] leading-6 text-[#716d78]">
                  {errorMessage ??
                    "Something went wrong while preparing your payment."}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (sessionId) {
                      void createPaymentOrder(sessionId);
                    }
                  }}
                  className="mt-7 inline-flex h-[44px] items-center justify-center rounded-[10px] bg-[#5921c7] px-6 text-[13px] font-bold text-white transition hover:bg-[#6d32df]"
                >
                  Try Payment Again
                </button>
              </div>
            )}

            {![
              "paid",
              "failed",
              "pending",
              "error",
            ].includes(paymentState) && (
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#5921c7]/[0.07] text-[#5921c7]">
                    {paymentState === "verifying" ? (
                      <Loader2
                        size={21}
                        className="animate-spin"
                      />
                    ) : (
                      <CreditCard size={21} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-[18px] font-bold">
                      Payment Options
                    </h2>

                    <p className="mt-0.5 text-[13px] text-[#716d78]">
                      Choose a payment method available through Razorpay.
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mt-5 rounded-[11px] border border-[#d52f3f]/15 bg-[#d52f3f]/[0.05] px-4 py-3 text-[13px] leading-5 text-[#a92532]">
                    {errorMessage}
                  </div>
                )}

                <div className="mt-7 space-y-3">
                  <PaymentOption
                    title="UPI"
                    description="Google Pay, PhonePe, Paytm and other UPI apps"
                  />

                  <PaymentOption
                    title="Debit / Credit Card"
                    description="Visa, Mastercard and supported cards"
                  />

                  <PaymentOption
                    title="Net Banking"
                    description="Supported Indian banks"
                  />

                  <PaymentOption
                    title="Other Methods"
                    description="Payment methods enabled in your Razorpay Checkout configuration"
                  />
                </div>

                <div className="mt-6 flex items-start gap-2 rounded-[10px] bg-[#5921c7]/[0.04] px-3.5 py-3 text-[11px] leading-4 text-[#716d78]">
                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-[#5921c7]"
                  />

                  <span>
                    Payments are securely processed through Razorpay. Your card, UPI and banking credentials are handled by the payment gateway.
                  </span>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[16px] border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_rgba(23,21,29,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold">
                  Order Summary
                </h2>

                <span className="rounded-full bg-[#5921c7]/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5921c7]">
                  Secure
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-[#716d78]">
                    Order
                  </span>

                  <span className="text-[13px] font-semibold text-[#302c38]">
                    {orderNumber
                      ? `#${orderNumber}`
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-[#716d78]">
                    Payment Status
                  </span>

                  <span className="text-[12px] font-semibold text-[#302c38]">
                    {paymentState === "paid"
                      ? "Paid"
                      : paymentState === "failed"
                        ? "Failed"
                        : paymentState === "pending"
                          ? "Pending"
                          : isProcessing
                            ? "Processing"
                            : "Ready"}
                  </span>
                </div>

                <div className="border-t border-black/[0.07] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#716d78]">
                      Total
                    </span>

                    <span className="text-[22px] font-bold text-[#5921c7]">
                      {formatMoney(amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_rgba(23,21,29,0.04)] sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#5921c7]/[0.07] text-[#5921c7]">
                  {paymentState === "verifying" ||
                  paymentState === "opening" ||
                  paymentState === "loading" ? (
                    <Loader2
                      size={21}
                      className="animate-spin"
                    />
                  ) : (
                    <CreditCard size={21} />
                  )}
                </div>

                <div>
                  <h2 className="text-[18px] font-bold">
                    {paymentState === "verifying"
                      ? "Verifying Payment"
                      : paymentState === "opening"
                        ? "Opening Razorpay"
                        : "Pay Securely"}
                  </h2>

                  <p className="mt-0.5 text-[13px] text-[#716d78]">
                    {paymentState === "verifying"
                      ? "Please wait while we verify your transaction."
                      : "Continue to Razorpay's secure checkout."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openRazorpayCheckout}
                disabled={
                  paymentState !== "ready" ||
                  !razorpayOrderId ||
                  !razorpayKeyId ||
                  !razorpayLoaded
                }
                className="mt-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-[11px] bg-[#5921c7] text-[14px] font-bold text-white transition hover:bg-[#6d32df] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentState === "opening" ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Opening Payment...
                  </>
                ) : paymentState === "verifying" ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Verifying...
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Loading Payment...
                  </>
                ) : paymentState === "paid" ? (
                  <>
                    <CheckCircle2 size={18} />
                    Payment Completed
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Proceed to Pay
                  </>
                )}
              </button>

              <div className="mt-5 flex items-start gap-2 rounded-[10px] bg-[#5921c7]/[0.04] px-3.5 py-3 text-[11px] leading-4 text-[#716d78]">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-[#5921c7]"
                />

                <span>
                  You will be redirected to Razorpay to securely complete your payment. Do not refresh or close the page during payment.
                </span>
              </div>

              <p className="mt-4 text-center text-[10px] leading-4 text-[#aaa5b0]">
                Razorpay Checkout
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PaymentOption({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[11px] border border-black/[0.06] px-3.5 py-3">
      <div className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#5921c7]/[0.06]">
        <CheckCircle2
          size={15}
          className="text-[#5921c7]"
        />
      </div>

      <div>
        <p className="text-[13px] font-semibold text-[#302c38]">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] leading-4 text-[#8b8791]">
          {description}
        </p>
      </div>
    </div>
  );
}
