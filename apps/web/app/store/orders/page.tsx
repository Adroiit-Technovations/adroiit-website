
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Loader2,
  Package,
  ShoppingBag,
  ShoppingCart,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  CalendarDays,
  Receipt,
  Box,
} from "lucide-react";

import { Bricolage_Grotesque } from "next/font/google";

import { createClient } from "@/lib/supabase/client";

// ============================================================
// CONFIGURATION
// ============================================================

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// TYPES
// ============================================================

type CustomerOrder = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_email: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  billing_address: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_pincode: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  sku: string | null;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
};

// ============================================================
// FORMATTERS
// ============================================================

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount ?? 0));
}

function formatDate(date: string) {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function formatStatus(status: string) {
  const normalized = (status ?? "")
    .trim()
    .toUpperCase();

  const labels: Record<string, string> = {
    PENDING: "Pending",
    RECEIVED: "Order Received",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    COMPLETED: "Delivered",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
    FAILED: "Failed",
    PAID: "Paid",
  };

  return (
    labels[normalized] ??
    (normalized
      ? normalized.charAt(0) +
        normalized.slice(1).toLowerCase()
      : "Unknown")
  );
}

function getOrderStatusClasses(status: string) {
  const normalized = (status ?? "").trim().toUpperCase();

  switch (normalized) {
    case "CONFIRMED":
    case "PAID":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "PROCESSING":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "SHIPPED":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "DELIVERED":
    case "COMPLETED":
      return "border-green-200 bg-green-50 text-green-700";

    case "CANCELLED":
    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";

    case "REFUNDED":
      return "border-orange-200 bg-orange-50 text-orange-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getPaymentStatusClasses(status: string) {
  const normalized = (status ?? "").trim().toUpperCase();

  switch (normalized) {
    case "PAID":
      return "border-green-200 bg-green-50 text-green-700";

    case "REFUNDED":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getOrderStatusIcon(status: string) {
  const normalized = (status ?? "").trim().toUpperCase();

  switch (normalized) {
    case "DELIVERED":
    case "COMPLETED":
      return CheckCircle2;

    case "SHIPPED":
      return Truck;

    case "PROCESSING":
      return Package;

    case "CANCELLED":
    case "FAILED":
      return Package;

    default:
      return Clock3;
  }
}

// ============================================================
// COMPONENT
// ============================================================

export default function OrderHistoryPage() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [expandedOrderId, setExpandedOrderId] = useState<
    string | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD CUSTOMER ORDERS
  // ==========================================================

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      // ------------------------------------------------------
      // GET AUTHENTICATED CUSTOMER
      // ------------------------------------------------------

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/store/CustomerLogin");
        return;
      }

      // ------------------------------------------------------
      // FIND CUSTOMER RECORD
      // ------------------------------------------------------

      const {
        data: customer,
        error: customerError,
      } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (customerError) {
        throw new Error(customerError.message);
      }

      if (!customer) {
        setOrders([]);
        setOrderItems([]);
        return;
      }

      // ------------------------------------------------------
      // FETCH CUSTOMER ORDERS
      // ------------------------------------------------------

      const {
        data: customerOrders,
        error: ordersError,
      } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_number,
            status,
            payment_status,
            subtotal,
            discount_amount,
            shipping_amount,
            tax_amount,
            total_amount,
            shipping_name,
            shipping_phone,
            shipping_email,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_pincode,
            billing_address,
            billing_city,
            billing_state,
            billing_pincode,
            created_at
          `
        )
        .eq("customer_id", customer.id)
        .order("created_at", {
          ascending: false,
        });

      if (ordersError) {
        throw new Error(ordersError.message);
      }

      const normalizedOrders =
        (customerOrders ?? []) as CustomerOrder[];

      setOrders(normalizedOrders);

      // ------------------------------------------------------
      // NO ORDERS
      // ------------------------------------------------------

      if (normalizedOrders.length === 0) {
        setOrderItems([]);
        return;
      }

      // ------------------------------------------------------
      // FETCH ITEMS FOR THESE ORDERS
      // ------------------------------------------------------

      const orderIds = normalizedOrders.map(
        (order) => order.id
      );

      const {
        data: items,
        error: itemsError,
      } = await supabase
        .from("order_items")
        .select(
          `
            id,
            order_id,
            product_id,
            product_name,
            sku,
            quantity,
            unit_price,
            discount_amount,
            total_price
          `
        )
        .in("order_id", orderIds)
        .order("created_at", {
          ascending: true,
        });

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      setOrderItems((items ?? []) as OrderItem[]);
    } catch (loadError) {
      console.error(
        "Unable to load order history:",
        loadError
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    void loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================
  // HELPERS
  // ==========================================================

  const itemsForOrder = (orderId: string) =>
    orderItems.filter(
      (item) => item.order_id === orderId
    );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      className={`${bricolage.className} min-h-screen w-full bg-[#faf9fc] text-[#17151d]`}
    >
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-[#5921c7]/[0.08] bg-white">
        <div className="pointer-events-none absolute -right-20 -top-32 h-[340px] w-[340px] rounded-full bg-[#8c52ff]/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 left-[28%] h-[280px] w-[280px] rounded-full bg-[#5921c7]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.02em] text-[#8c52ff]">
            YOUR ORDER HISTORY
          </p>

          <h1 className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#30106f] bg-clip-text text-[26px] font-bold leading-tight tracking-[-0.045em] text-transparent sm:text-[25px]">
            My Orders
          </h1>

          <p className="mt-2 max-w-[1000px] text-[14px] leading-6 text-gray-700 sm:text-[15px]">
            Everything you have ordered, organised in
            one place. View your purchases and keep
            track of their status.
          </p>
        </div>
      </section>

      {/* ======================================================
          ORDER CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">

        {/* ----------------------------------------------------
            LOADING STATE
        ---------------------------------------------------- */}

        {loading && (
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[20px] border border-black/[0.07] bg-white">
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#5921c7]/[0.07]">
              <Loader2
                size={26}
                className="animate-spin text-[#5921c7]"
              />
            </div>

            <p className="mt-5 text-[14px] font-bold text-[#292431]">
              Loading your orders
            </p>

            <p className="mt-1 text-[12px] text-[#8b8594]">
              Please wait while we fetch your purchases.
            </p>
          </div>
        )}

        {/* ----------------------------------------------------
            ERROR STATE
        ---------------------------------------------------- */}

        {!loading && error && (
          <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[20px] border border-[#d52f3f]/[0.14] bg-white px-5 text-center">
            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-[19px] bg-[#fff1f1] text-[#d52f3f]">
              <Package size={27} />
            </div>

            <h2 className="mt-5 text-[19px] font-bold text-[#17151d]">
              Unable to load your orders
            </h2>

            <p className="mt-2 max-w-[420px] text-[12px] leading-6 text-[#716d78]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadOrders()}
              className="mt-6 inline-flex h-[42px] items-center gap-2 rounded-[10px] bg-[#5921c7] px-5 text-[12px] font-bold text-white transition hover:bg-[#4718a6]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ----------------------------------------------------
            EMPTY STATE
        ---------------------------------------------------- */}

        {!loading && !error && orders.length === 0 && (
          <div className="relative flex min-h-[410px] flex-col items-center justify-center overflow-hidden rounded-[20px] border border-black/[0.07] bg-white px-5 py-12 text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#8c52ff]/[0.06] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-[#5921c7]/[0.05] blur-2xl" />

            <div className="relative flex h-[82px] w-[82px] items-center justify-center rounded-[25px] bg-gradient-to-br from-[#5921c7]/[0.10] to-[#8c52ff]/[0.07] text-[#5921c7]">
              <ShoppingBag size={34} strokeWidth={1.6} />
            </div>

            <h2 className="relative mt-6 text-[23px] font-bold tracking-[-0.035em] text-[#17151d]">
              No orders yet
            </h2>

            <p className="relative mt-2 max-w-[360px] text-[12px] leading-6 text-[#716d78]">
              You haven't placed any orders yet. Explore
              our collection and discover products built
              to inspire innovation.
            </p>

            <Link
              href="/store"
              className="relative mt-7 inline-flex h-[44px] items-center justify-center gap-2 rounded-[11px] bg-[#5921c7] px-6 text-[12px] font-bold text-white shadow-[0_5px_16px_rgba(89,33,199,0.18)] transition hover:-translate-y-0.5 hover:bg-[#4718a6]"
            >
              <ShoppingCart size={15} />
              Explore Products
            </Link>
          </div>
        )}

        {/* ----------------------------------------------------
            ORDER LIST
        ---------------------------------------------------- */}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const expanded =
                expandedOrderId === order.id;

              const items = itemsForOrder(order.id);

              const shippingAddress = [
                order.shipping_address,
                order.shipping_city,
                order.shipping_state,
                order.shipping_pincode,
              ]
                .filter(Boolean)
                .join(", ");

              const StatusIcon = getOrderStatusIcon(
                order.status
              );

              return (
                <article
                  key={order.id}
                  className="group overflow-hidden rounded-[17px] border border-black/[0.075] bg-white shadow-[0_3px_16px_rgba(48,16,111,0.025)] transition duration-200 hover:border-[#5921c7]/[0.16] hover:shadow-[0_8px_26px_rgba(48,16,111,0.055)]"
                >
                  {/* ORDER SUMMARY */}

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOrderId(
                        expanded ? null : order.id
                      )
                    }
                    aria-expanded={expanded}
                    className="w-full p-4 text-left sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-[13px] bg-[#5921c7]/[0.07] text-[#5921c7]">
                          <Box size={20} />
                        </div>

                        <div className="min-w-0 pt-0.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#96909e]">
                            Order Number
                          </p>

                          <h3 className="mt-1 break-all text-[13px] font-bold text-[#5921c7] sm:text-[15px]">
                            {order.order_number}
                          </h3>

                          <p className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-[#8b8594]">
                            <CalendarDays size={11} />
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-bold sm:px-3 sm:text-[10px] ${getOrderStatusClasses(
                            order.status
                          )}`}
                        >
                          <StatusIcon size={11} />
                          {formatStatus(order.status)}
                        </span>

                        <div className="flex h-[29px] w-[29px] items-center justify-center rounded-full bg-[#f6f4f9] text-[#716d78] transition group-hover:bg-[#5921c7]/[0.07] group-hover:text-[#5921c7]">
                          {expanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/[0.055] pt-4 sm:grid-cols-3 sm:gap-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#96909e]">
                          Order Total
                        </p>

                        <p className="mt-1.5 text-[16px] font-bold tracking-[-0.025em] text-[#17151d] sm:text-[18px]">
                          {formatMoney(order.total_amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#96909e]">
                          Payment Status
                        </p>

                        <div className="mt-1.5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold ${getPaymentStatusClasses(
                              order.payment_status
                            )}`}
                          >
                            {formatStatus(order.payment_status)}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2 border-t border-black/[0.055] pt-3 sm:col-span-1 sm:border-0 sm:pt-0 sm:text-right">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#96909e]">
                          Items
                        </p>

                        <p className="mt-1.5 text-[13px] font-bold text-[#514b5b]">
                          {items.length}{" "}
                          {items.length === 1
                            ? "Product"
                            : "Products"}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* EXPANDED ORDER DETAILS */}

                  {expanded && (
                    <div className="border-t border-black/[0.07] bg-[#faf9fc]/75 p-4 sm:p-6">
                      <div className="space-y-6">

                        {/* ORDER ITEMS */}

                        <div>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <h4 className="text-[15px] font-bold text-[#17151d]">
                              Order Items
                            </h4>

                            <span className="rounded-full border border-black/[0.07] bg-white px-3 py-1 text-[10px] font-semibold text-[#716d78]">
                              {items.length}{" "}
                              {items.length === 1
                                ? "Item"
                                : "Items"}
                            </span>
                          </div>

                          {items.length === 0 ? (
                            <div className="rounded-[12px] border border-black/[0.06] bg-white p-5 text-center">
                              <Package
                                size={23}
                                className="mx-auto text-[#aaa4b1]"
                              />

                              <p className="mt-2 text-[11px] text-[#716d78]">
                                No item details are available
                                for this order.
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-hidden rounded-[13px] border border-black/[0.065] bg-white">
                              {items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.055] p-3.5 last:border-b-0 sm:p-4"
                                >
                                  <div className="flex min-w-0 flex-1 items-start gap-3">
                                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#f5f2fa] text-[#5921c7]">
                                      <Package size={17} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="text-[12px] font-bold leading-5 text-[#292431] sm:text-[13px]">
                                        {item.product_name}
                                      </p>

                                      {item.sku && (
                                        <p className="mt-0.5 text-[9px] font-medium text-[#96909e]">
                                          SKU: {item.sku}
                                        </p>
                                      )}

                                      <p className="mt-1 text-[10px] text-[#716d78]">
                                        Qty: {item.quantity}{" "}
                                        <span className="mx-1 text-[#c4bfca]">
                                          |
                                        </span>
                                        {formatMoney(
                                          item.unit_price
                                        )}{" "}
                                        each
                                      </p>
                                    </div>
                                  </div>

                                  <p className="shrink-0 text-[12px] font-bold text-[#17151d] sm:text-[13px]">
                                    {formatMoney(item.total_price)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* DELIVERY DETAILS */}

                        <div>
                          <h4 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#17151d]">
                            <MapPin
                              size={16}
                              className="text-[#5921c7]"
                            />
                            Delivery Details
                          </h4>

                          <div className="rounded-[13px] border border-black/[0.065] bg-white p-4 sm:p-5">
                            {order.shipping_name && (
                              <p className="text-[13px] font-bold text-[#292431]">
                                {order.shipping_name}
                              </p>
                            )}

                            {shippingAddress && (
                              <p className="mt-1.5 max-w-[600px] text-[11px] leading-6 text-[#716d78]">
                                {shippingAddress}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-black/[0.055] pt-3">
                              {order.shipping_phone && (
                                <p className="text-[10px] text-[#716d78]">
                                  <span className="font-semibold text-[#514b5b]">
                                    Phone:
                                  </span>{" "}
                                  {order.shipping_phone}
                                </p>
                              )}

                              {order.shipping_email && (
                                <p className="break-all text-[10px] text-[#716d78]">
                                  <span className="font-semibold text-[#514b5b]">
                                    Email:
                                  </span>{" "}
                                  {order.shipping_email}
                                </p>
                              )}
                            </div>

                            {!order.shipping_name &&
                              !shippingAddress &&
                              !order.shipping_phone &&
                              !order.shipping_email && (
                                <p className="text-[11px] text-[#716d78]">
                                  Delivery details are not
                                  available.
                                </p>
                              )}
                          </div>
                        </div>

                        {/* PAYMENT SUMMARY */}

                        <div className="flex justify-end">
                          <div className="w-full max-w-[370px] rounded-[13px] border border-black/[0.065] bg-white p-4 sm:p-5">
                            <div className="mb-4 flex items-center gap-2">
                              <Receipt
                                size={15}
                                className="text-[#5921c7]"
                              />

                              <h4 className="text-[12px] font-bold text-[#292431]">
                                Payment Summary
                              </h4>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between gap-4 text-[11px]">
                                <span className="text-[#8b8594]">
                                  Subtotal
                                </span>

                                <span className="font-semibold text-[#514b5b]">
                                  {formatMoney(order.subtotal)}
                                </span>
                              </div>

                              {Number(order.discount_amount) > 0 && (
                                <div className="flex justify-between gap-4 text-[11px]">
                                  <span className="text-[#07885b]">
                                    Discount
                                  </span>

                                  <span className="font-bold text-[#07885b]">
                                    -{formatMoney(order.discount_amount)}
                                  </span>
                                </div>
                              )}

                              <div className="flex justify-between gap-4 text-[11px]">
                                <span className="text-[#8b8594]">
                                  Shipping
                                </span>

                                <span className="font-semibold text-[#514b5b]">
                                  {formatMoney(order.shipping_amount)}
                                </span>
                              </div>

                              {Number(order.tax_amount) > 0 && (
                                <div className="flex justify-between gap-4 text-[11px]">
                                  <span className="text-[#8b8594]">
                                    Tax
                                  </span>

                                  <span className="font-semibold text-[#514b5b]">
                                    {formatMoney(order.tax_amount)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4 border-t border-dashed border-black/[0.10] pt-4">
                              <span className="text-[12px] font-bold text-[#292431]">
                                Total Amount
                              </span>

                              <span className="text-[19px] font-bold tracking-[-0.035em] text-[#5921c7]">
                                {formatMoney(order.total_amount)}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 rounded-[9px] bg-[#faf9fc] px-3 py-2">
                              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8b8594]">
                                Payment Status
                              </span>

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${getPaymentStatusClasses(
                                  order.payment_status
                                )}`}
                              >
                                {formatStatus(order.payment_status)}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
