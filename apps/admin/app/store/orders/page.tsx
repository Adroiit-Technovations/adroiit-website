"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useSearchParams } from "next/navigation";

import {
  AlertCircle,
  ArrowDownUp,
  CalendarDays,
  ChevronDown,
  Edit3,
  Mail,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  ORDER_STATUSES,
  INCOMPLETE_ORDER_STATUSES,
  type OrderStatus,
} from "@/lib/constants/order-status";

// ============================================================
// TYPES
// ============================================================

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

type DisplayOrderStatus =
  | "PENDING"
  | "RECEIVED"
  | OrderStatus;

type StatusFilter =
  | "ALL"
  | Exclude<DisplayOrderStatus, "PENDING">;

type PaymentFilter = "ALL" | PaymentStatus;

type SortOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest";

type Order = {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number | null;
  discount_amount: number | null;
  shipping_amount: number | null;
  tax_amount: number | null;
  total_amount: number | null;
  notes: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_email: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  created_at: string;
  updated_at: string;
};

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  sku: string | null;
  quantity: number;
  unit_price: number | null;
  total_price: number | null;
};

// ============================================================
// CONSTANTS
// ============================================================

const supabase = createClient();

const DISPLAY_ORDER_STATUSES: Exclude<
  DisplayOrderStatus,
  "PENDING"
>[] = [
  "RECEIVED",
  ...ORDER_STATUSES.filter(
    (status) => status !== "PENDING"
  ),
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

const FULFILLMENT_STATUSES: DisplayOrderStatus[] = [
  "RECEIVED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const STATUS_PROGRESS: DisplayOrderStatus[] = [
  "RECEIVED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

// ============================================================
// THEME-AWARE STYLES
// ============================================================

const CARD_CLASS =
  "rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-[var(--admin-shadow-sm)] transition-colors duration-200";

const CARD_SECONDARY_CLASS =
  "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text)] transition-colors duration-200";

const INPUT_CLASS =
  "h-10 w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 text-sm text-[var(--admin-text)] outline-none transition-colors placeholder:text-[var(--admin-text-subtle)] focus:border-[var(--admin-primary-light)] focus:ring-2 focus:ring-[var(--admin-primary-light)]/15 disabled:cursor-not-allowed disabled:opacity-60";

const BUTTON_SECONDARY_CLASS =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 text-sm font-medium text-[var(--admin-text-secondary)] transition-colors hover:bg-[var(--admin-surface-hover)] disabled:cursor-not-allowed disabled:opacity-50";

const MUTED_TEXT_CLASS =
  "text-[var(--admin-text-muted)]";

const SUBTLE_TEXT_CLASS =
  "text-[var(--admin-text-subtle)]";

// ============================================================
// HELPERS
// ============================================================

function formatMoney(
  value: number | null | undefined
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(
  value: string | null | undefined
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(
  value: string | null | undefined
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(
  name: string | null | undefined
): string {
  if (!name?.trim()) return "NA";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const firstInitial = parts[0][0] || "";
  const lastInitial =
    parts[parts.length - 1][0] || "";

  return (firstInitial + lastInitial).toUpperCase();
}

function getEffectiveOrderStatus(
  order: Pick<Order, "status" | "payment_status">
): DisplayOrderStatus {
  if (order.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (
    order.status === "REFUNDED" ||
    order.payment_status === "REFUNDED"
  ) {
    return "REFUNDED";
  }

  if (order.payment_status !== "PAID") {
    return "PENDING";
  }

  if (order.status === "PENDING") {
    return "RECEIVED";
  }

  return order.status;
}

function getStatusLabel(
  status: DisplayOrderStatus
): string {
  const labels: Record<DisplayOrderStatus, string> = {
    PENDING: "Pending Payment",
    RECEIVED: "Received",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };

  return labels[status];
}

function getPaymentLabel(
  status: PaymentStatus
): string {
  const labels: Record<PaymentStatus, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };

  return labels[status];
}

function getStatusColor(
  status: DisplayOrderStatus
): string {
  const colors: Record<DisplayOrderStatus, string> = {
    PENDING: "#8b8496",
    RECEIVED: "#b7791f",
    CONFIRMED: "#2876c7",
    PROCESSING: "#8053c8",
    SHIPPED: "#535fc5",
    DELIVERED: "#168653",
    CANCELLED: "#d14343",
    REFUNDED: "#c66b25",
  };

  return colors[status];
}

function getPaymentColor(
  status: PaymentStatus
): string {
  const colors: Record<PaymentStatus, string> = {
    PAID: "#168653",
    PENDING: "#b7791f",
    FAILED: "#d14343",
    REFUNDED: "#c66b25",
  };

  return colors[status];
}

function getBadgeStyle(
  color: string
): React.CSSProperties {
  return {
    color,
    borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
    backgroundColor: `color-mix(in srgb, ${color} 11%, var(--admin-surface))`,
  };
}

function isTerminalStatus(
  status: DisplayOrderStatus
): boolean {
  if (status === "RECEIVED") return false;

  return INCOMPLETE_ORDER_STATUSES.includes(
    status as OrderStatus
  );
}

function getAvailableStatusOptions(
  order: Order
): DisplayOrderStatus[] {
  const currentStatus =
    getEffectiveOrderStatus(order);

  if (isTerminalStatus(currentStatus)) {
    return [currentStatus];
  }

  if (order.payment_status !== "PAID") {
    return ["PENDING", "CANCELLED"];
  }

  const currentIndex =
    STATUS_PROGRESS.indexOf(currentStatus);

  const progression =
    currentIndex === -1
      ? STATUS_PROGRESS
      : STATUS_PROGRESS.slice(currentIndex);

  return [
    ...progression,
    "CANCELLED",
    "REFUNDED",
  ];
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function SelectField({
  value,
  onChange,
  children,
  className = "",
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`${INPUT_CLASS} appearance-none pr-9`}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-subtle)]"
      />
    </div>
  );
}

function OrderStatusBadge({
  status,
}: {
  status: DisplayOrderStatus;
}) {
  const color = getStatusColor(status);

  return (
    <span
      style={getBadgeStyle(color)}
      className="inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium"
    >
      {getStatusLabel(status)}
    </span>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const color = getPaymentColor(status);

  return (
    <span
      style={getBadgeStyle(color)}
      className="inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium"
    >
      {getPaymentLabel(status)}
    </span>
  );
}

// ============================================================
// STATISTICS CARD — WITHOUT ICONS
// ============================================================

function StatItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className={`${CARD_CLASS} p-4`}>
      <div className="min-w-0">
        <p
          className={`text-xs font-medium uppercase tracking-wide ${SUBTLE_TEXT_CLASS}`}
        >
          {label}
        </p>

        <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function OrdersPage() {
  // ----------------------------------------------------------
  // URL PARAMETERS
  // ----------------------------------------------------------

  const searchParams = useSearchParams();

  const customerFilterId =
    searchParams.get("customerId");

  const autoPopulatedCustomerId = useRef<string | null>(
    null
  );

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("ALL");

  const [sortOption, setSortOption] =
    useState<SortOption>("newest");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [orderToDelete, setOrderToDelete] =
    useState<Order | null>(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  // ----------------------------------------------------------
  // LOAD ORDERS
  // ----------------------------------------------------------

  const loadOrders = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const [ordersResult, customersResult] =
          await Promise.all([
            supabase
              .from("orders")
              .select(`
                id,
                order_number,
                customer_id,
                status,
                payment_status,
                subtotal,
                discount_amount,
                shipping_amount,
                tax_amount,
                total_amount,
                notes,
                shipping_name,
                shipping_phone,
                shipping_email,
                shipping_address,
                shipping_city,
                shipping_state,
                shipping_pincode,
                created_at,
                updated_at
              `)
              .order("created_at", {
                ascending: false,
              }),

            supabase
              .from("customers")
              .select("id, name, email, phone"),
          ]);

        if (ordersResult.error) {
          throw new Error(ordersResult.error.message);
        }

        if (customersResult.error) {
          throw new Error(customersResult.error.message);
        }

        const fetchedOrders =
          (ordersResult.data || []) as Order[];

        const fetchedCustomers =
          (customersResult.data || []) as Customer[];

        setOrders(fetchedOrders);
        setCustomers(fetchedCustomers);

        const orderIds = fetchedOrders.map(
          (order) => order.id
        );

        if (orderIds.length === 0) {
          setOrderItems([]);
        } else {
          const itemsResult = await supabase
            .from("order_items")
            .select(`
              id,
              order_id,
              product_id,
              product_name,
              sku,
              quantity,
              unit_price,
              total_price
            `)
            .in("order_id", orderIds);

          if (itemsResult.error) {
            throw new Error(itemsResult.error.message);
          }

          setOrderItems(
            (itemsResult.data || []) as OrderItem[]
          );
        }
      } catch (err) {
        console.error("Failed to load orders:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load orders."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  // ----------------------------------------------------------
  // DERIVED DATA
  // ----------------------------------------------------------

  const customerMap = useMemo(() => {
    const map = new Map<string, Customer>();

    customers.forEach((customer) => {
      map.set(customer.id, customer);
    });

    return map;
  }, [customers]);

  // ----------------------------------------------------------
  // AUTO-POPULATE EXISTING SEARCH INPUT
  // ----------------------------------------------------------

  useEffect(() => {
    if (!customerFilterId) {
      autoPopulatedCustomerId.current = null;
      return;
    }

    if (
      autoPopulatedCustomerId.current === customerFilterId
    ) {
      return;
    }

    const customer = customerMap.get(customerFilterId);

    const matchingOrder = orders.find(
      (order) => order.customer_id === customerFilterId
    );

    const customerSearchTerm =
      customer?.name?.trim() ||
      customer?.email?.trim() ||
      customer?.phone?.trim() ||
      matchingOrder?.shipping_name?.trim() ||
      matchingOrder?.shipping_email?.trim() ||
      matchingOrder?.shipping_phone?.trim() ||
      "";

    if (!customerSearchTerm) {
      return;
    }

    setSearch(customerSearchTerm);

    autoPopulatedCustomerId.current = customerFilterId;
  }, [customerFilterId, customerMap, orders]);

  const getCustomer = useCallback(
    (order: Order) => {
      if (!order.customer_id) return null;

      return (
        customerMap.get(order.customer_id) || null
      );
    },
    [customerMap]
  );

  const getOrderItemCount = useCallback(
    (orderId: string) =>
      orderItems
        .filter((item) => item.order_id === orderId)
        .reduce(
          (sum, item) =>
            sum + Number(item.quantity || 0),
          0
        ),
    [orderItems]
  );

  // ----------------------------------------------------------
  // FILTERED ORDERS
  // ----------------------------------------------------------

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = orders.filter((order) => {
      const customer = order.customer_id
        ? customerMap.get(order.customer_id)
        : null;

      const effectiveStatus =
        getEffectiveOrderStatus(order);

      const searchableText = [
        order.order_number,
        order.shipping_name,
        order.shipping_email,
        order.shipping_phone,
        order.shipping_city,
        order.shipping_state,
        customer?.name,
        customer?.email,
        customer?.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        effectiveStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        order.payment_status === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });

    return [...result].sort((a, b) => {
      if (sortOption === "newest") {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      }

      if (sortOption === "oldest") {
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      }

      if (sortOption === "highest") {
        return (
          Number(b.total_amount || 0) -
          Number(a.total_amount || 0)
        );
      }

      return (
        Number(a.total_amount || 0) -
        Number(b.total_amount || 0)
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    sortOption,
    customerMap,
  ]);

  // ----------------------------------------------------------
  // STATISTICS
  // ----------------------------------------------------------

  const stats = useMemo(() => {
    const getCount = (
      status: DisplayOrderStatus
    ) =>
      orders.filter(
        (order) =>
          getEffectiveOrderStatus(order) === status
      ).length;

    const totalSales = orders
      .filter(
        (order) =>
          order.payment_status === "PAID" &&
          order.status !== "CANCELLED" &&
          order.status !== "REFUNDED"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total_amount || 0),
        0
      );

    return {
      totalOrders: orders.length,
      receivedOrders: getCount("RECEIVED"),
      confirmedOrders: getCount("CONFIRMED"),
      processingOrders: getCount("PROCESSING"),
      shippedOrders: getCount("SHIPPED"),
      deliveredOrders: getCount("DELIVERED"),
      totalSales,
    };
  }, [orders]);

  const selectedOrderItems = useMemo(() => {
    if (!selectedOrder) return [];

    return orderItems.filter(
      (item) => item.order_id === selectedOrder.id
    );
  }, [selectedOrder, orderItems]);

  // ----------------------------------------------------------
  // ORDER MODAL
  // ----------------------------------------------------------

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeOrder = () => {
    if (savingStatus || deleting) return;

    setSelectedOrder(null);
  };

  // ----------------------------------------------------------
  // UPDATE ORDER STATUS
  // ----------------------------------------------------------

  const updateOrderStatus = async (
    orderId: string,
    requestedStatus: DisplayOrderStatus
  ) => {
    const currentOrder = orders.find(
      (order) => order.id === orderId
    );

    if (!currentOrder) return;

    const currentEffectiveStatus =
      getEffectiveOrderStatus(currentOrder);

    if (isTerminalStatus(currentEffectiveStatus)) {
      setError(
        "Delivered, cancelled and refunded orders cannot be changed."
      );
      return;
    }

    if (
      requestedStatus !== "RECEIVED" &&
      requestedStatus !== "PENDING" &&
      !ORDER_STATUSES.includes(
        requestedStatus as OrderStatus
      )
    ) {
      setError("Invalid order status.");
      return;
    }

    if (
      currentOrder.payment_status !== "PAID" &&
      FULFILLMENT_STATUSES.includes(requestedStatus)
    ) {
      setError(
        "The order must be paid before it can be received, confirmed, processed, shipped or delivered."
      );
      return;
    }

    if (
      STATUS_PROGRESS.includes(currentEffectiveStatus) &&
      STATUS_PROGRESS.includes(requestedStatus) &&
      STATUS_PROGRESS.indexOf(requestedStatus) <
        STATUS_PROGRESS.indexOf(currentEffectiveStatus)
    ) {
      setError(
        "An order cannot be moved back to an earlier fulfilment status."
      );
      return;
    }

    let statusToSave: OrderStatus =
      currentOrder.status;

    let paymentStatusToSave: PaymentStatus =
      currentOrder.payment_status;

    switch (requestedStatus) {
      case "PENDING":
      case "RECEIVED":
        statusToSave = "PENDING";
        break;

      case "CONFIRMED":
      case "PROCESSING":
      case "SHIPPED":
      case "DELIVERED":
      case "CANCELLED":
      case "REFUNDED":
        statusToSave = requestedStatus;
        break;
    }

    if (requestedStatus === "REFUNDED") {
      paymentStatusToSave = "REFUNDED";
    }

    try {
      setSavingStatus(true);
      setError("");

      const now = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: statusToSave,
          payment_status: paymentStatusToSave,
          updated_at: now,
        })
        .eq("id", orderId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const updatedOrder: Order = {
        ...currentOrder,
        status: statusToSave,
        payment_status: paymentStatusToSave,
        updated_at: now,
      };

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );

      setSelectedOrder((current) =>
        current?.id === orderId
          ? updatedOrder
          : current
      );
    } catch (err) {
      console.error(
        "Failed to update order status:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update order status."
      );
    } finally {
      setSavingStatus(false);
    }
  };

  // ----------------------------------------------------------
  // DELETE ORDER
  // ----------------------------------------------------------

  const openDeleteConfirmation = (
    order: Order
  ) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const closeDeleteConfirmation = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const deleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      setDeleting(true);
      setError("");

      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderToDelete.id);

      if (itemsError) {
        throw new Error(
          `Unable to delete order items: ${itemsError.message}`
        );
      }

      const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderToDelete.id);

      if (orderError) {
        throw new Error(
          `Unable to delete order: ${orderError.message}`
        );
      }

      setOrders((current) =>
        current.filter(
          (order) => order.id !== orderToDelete.id
        )
      );

      setOrderItems((current) =>
        current.filter(
          (item) => item.order_id !== orderToDelete.id
        )
      );

      if (selectedOrder?.id === orderToDelete.id) {
        setSelectedOrder(null);
      }

      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error("Failed to delete order:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete order."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ----------------------------------------------------------
  // ORDER ACTIONS
  // ----------------------------------------------------------

  const renderOrderActions = (order: Order) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        title="View & edit order"
        onClick={() => openOrder(order)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-primary)]/10 hover:text-[var(--admin-primary-light)]"
      >
        <Edit3 size={17} />
      </button>

      <button
        type="button"
        title="Delete order"
        onClick={() =>
          openDeleteConfirmation(order)
        }
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--admin-text-subtle)] transition-colors hover:bg-red-500/10 hover:text-red-500"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );

  // ==========================================================
  // PAGE RENDER
  // ==========================================================

  return (
    <main
      className="relative min-h-screen w-screen bg-[var(--admin-bg)] text-[var(--admin-text)] transition-colors duration-300"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginTop: "-55px",
      }}
    >
      <div className="-mt-15 mx-auto w-full max-w-[1410px] px-4 pb-8 pt-0 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em]"
              style={{
                color: "var(--admin-primary-light)",
              }}
            >
              Orders Management
            </p>

            <h1
              className="mt-2 text-3xl font-bold tracking-tight"
              style={{
                color: "var(--admin-text)",
              }}
            >
              Orders Dashboard
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm leading-6"
              style={{
                color: "var(--admin-text-muted)",
              }}
            >
              Manage customer orders, track payments and monitor order fulfillment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders(true)}
            disabled={refreshing}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: "var(--admin-primary)",
              color: "#ffffff",
            }}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/5 p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-red-500">
                Unable to process request
              </p>

              <p className="mt-1 break-words text-sm text-red-500/90">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 text-red-500 transition-colors hover:bg-red-500/10"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* SEVEN STATISTICS CARDS — NO ICONS */}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          <StatItem
            label="Total Orders"
            value={stats.totalOrders}
          />

          <StatItem
            label="Received"
            value={stats.receivedOrders}
          />

          <StatItem
            label="Confirmed"
            value={stats.confirmedOrders}
          />

          <StatItem
            label="Processing"
            value={stats.processingOrders}
          />

          <StatItem
            label="Shipped"
            value={stats.shippedOrders}
          />

          <StatItem
            label="Delivered"
            value={stats.deliveredOrders}
          />

          <StatItem
            label="Total Sales"
            value={formatMoney(stats.totalSales)}
          />
        </div>

        {/* FILTERS */}

        <div className={`${CARD_CLASS} mb-5 p-4`}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_190px_190px_190px]">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-subtle)]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search orders, customers..."
                className={`${INPUT_CLASS} pl-10`}
              />
            </div>

            <SelectField
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as StatusFilter)
              }
            >
              <option value="ALL">
                All Order Status
              </option>

              {DISPLAY_ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </SelectField>

            <SelectField
              value={paymentFilter}
              onChange={(value) =>
                setPaymentFilter(value as PaymentFilter)
              }
            >
              <option value="ALL">
                All Payment Status
              </option>

              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {getPaymentLabel(status)}
                </option>
              ))}
            </SelectField>

            <SelectField
              value={sortOption}
              onChange={(value) =>
                setSortOption(value as SortOption)
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="highest">
                Highest Amount
              </option>

              <option value="lowest">
                Lowest Amount
              </option>
            </SelectField>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className={`text-xs ${MUTED_TEXT_CLASS}`}>
              Showing{" "}
              <span className="font-medium text-[var(--admin-text)]">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--admin-text)]">
                {orders.length}
              </span>{" "}
              orders
            </p>

            {(search ||
              statusFilter !== "ALL" ||
              paymentFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPaymentFilter("ALL");
                }}
                className="text-xs font-medium text-[var(--admin-primary-light)] transition-colors hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP ORDERS TABLE */}

        <div
          className={`${CARD_CLASS} hidden overflow-hidden lg:block`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)]">
                  {[
                    "Order",
                    "Customer",
                    "Date",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${MUTED_TEXT_CLASS}`}
                    >
                      {heading}
                    </th>
                  ))}

                  <th
                    className={`px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide ${MUTED_TEXT_CLASS}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <RefreshCw
                        size={22}
                        className="mx-auto animate-spin text-[var(--admin-primary-light)]"
                      />

                      <p
                        className={`mt-3 text-sm ${MUTED_TEXT_CLASS}`}
                      >
                        Loading orders...
                      </p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--admin-surface-hover)] text-[var(--admin-text-subtle)]">
                        <ShoppingBag size={21} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-[var(--admin-text)]">
                        No orders found
                      </p>

                      <p
                        className={`mt-1 text-xs ${MUTED_TEXT_CLASS}`}
                      >
                        Try changing your filters or search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const customer = getCustomer(order);

                    const effectiveStatus =
                      getEffectiveOrderStatus(order);

                    const itemCount =
                      getOrderItemCount(order.id);

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[var(--admin-border)] last:border-0 transition-colors hover:bg-[var(--admin-surface-hover)]"
                      >
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => openOrder(order)}
                            className="text-left"
                          >
                            <p className="text-sm font-semibold text-[var(--admin-text)] transition-colors hover:text-[var(--admin-primary-light)]">
                              #{order.order_number}
                            </p>

                            <p
                              className={`mt-1 text-xs ${SUBTLE_TEXT_CLASS}`}
                            >
                              {order.id.slice(0, 8)}
                            </p>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--admin-primary)]/10 text-xs font-semibold text-[var(--admin-primary-light)]">
                              {getInitials(
                                customer?.name ||
                                  order.shipping_name
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[190px] truncate text-sm font-medium text-[var(--admin-text)]">
                                {customer?.name ||
                                  order.shipping_name ||
                                  "Guest Customer"}
                              </p>

                              <p
                                className={`max-w-[190px] truncate text-xs ${SUBTLE_TEXT_CLASS}`}
                              >
                                {customer?.email ||
                                  order.shipping_email ||
                                  "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div
                            className={`flex items-center gap-2 text-sm ${MUTED_TEXT_CLASS}`}
                          >
                            <CalendarDays
                              size={15}
                              className={SUBTLE_TEXT_CLASS}
                            />

                            {formatDate(order.created_at)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`text-sm ${MUTED_TEXT_CLASS}`}
                          >
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-[var(--admin-text)]">
                            {formatMoney(order.total_amount)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <PaymentStatusBadge
                            status={order.payment_status}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <OrderStatusBadge
                            status={effectiveStatus}
                          />
                        </td>

                        <td className="px-5 py-4">
                          {renderOrderActions(order)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE ORDERS */}

        <div className="space-y-3 lg:hidden">
          {loading ? (
            <div
              className={`${CARD_CLASS} px-5 py-14 text-center`}
            >
              <RefreshCw
                size={22}
                className="mx-auto animate-spin text-[var(--admin-primary-light)]"
              />

              <p
                className={`mt-3 text-sm ${MUTED_TEXT_CLASS}`}
              >
                Loading orders...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div
              className={`${CARD_CLASS} px-5 py-14 text-center`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--admin-surface-hover)] text-[var(--admin-text-subtle)]">
                <ShoppingBag size={21} />
              </div>

              <p className="mt-3 text-sm font-medium text-[var(--admin-text)]">
                No orders found
              </p>

              <p
                className={`mt-1 text-xs ${MUTED_TEXT_CLASS}`}
              >
                Try changing your filters or search.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const customer = getCustomer(order);

              const effectiveStatus =
                getEffectiveOrderStatus(order);

              const itemCount =
                getOrderItemCount(order.id);

              return (
                <div
                  key={order.id}
                  className={`${CARD_CLASS} p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      className="min-w-0 text-left"
                    >
                      <p className="truncate text-sm font-semibold text-[var(--admin-text)]">
                        #{order.order_number}
                      </p>

                      <p
                        className={`mt-1 text-xs ${SUBTLE_TEXT_CLASS}`}
                      >
                        {formatDateTime(order.created_at)}
                      </p>
                    </button>

                    {renderOrderActions(order)}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--admin-primary)]/10 text-xs font-semibold text-[var(--admin-primary-light)]">
                      {getInitials(
                        customer?.name ||
                          order.shipping_name
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--admin-text)]">
                        {customer?.name ||
                          order.shipping_name ||
                          "Guest Customer"}
                      </p>

                      <p
                        className={`truncate text-xs ${SUBTLE_TEXT_CLASS}`}
                      >
                        {customer?.email ||
                          order.shipping_email ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div
                      className={`${CARD_SECONDARY_CLASS} p-3`}
                    >
                      <p
                        className={`text-[11px] uppercase tracking-wide ${SUBTLE_TEXT_CLASS}`}
                      >
                        Items
                      </p>

                      <p className="mt-1 text-sm font-medium text-[var(--admin-text)]">
                        {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div
                      className={`${CARD_SECONDARY_CLASS} p-3`}
                    >
                      <p
                        className={`text-[11px] uppercase tracking-wide ${SUBTLE_TEXT_CLASS}`}
                      >
                        Total
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--admin-text)]">
                        {formatMoney(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <PaymentStatusBadge
                      status={order.payment_status}
                    />

                    <OrderStatusBadge
                      status={effectiveStatus}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* VIEW & EDIT ORDER MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] sm:p-5">
          <div
            className="absolute inset-0"
            onClick={closeOrder}
          />

          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-[var(--admin-shadow)]">

            {/* Modal Header */}

            <div className="flex shrink-0 items-start justify-between border-b border-[var(--admin-border)] px-5 py-4 sm:px-6">
              <div>
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${SUBTLE_TEXT_CLASS}`}
                >
                  View & Edit Order
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[var(--admin-text)]">
                  #{selectedOrder.order_number}
                </h2>

                <p
                  className={`mt-1 text-xs ${SUBTLE_TEXT_CLASS}`}
                >
                  Placed on{" "}
                  {formatDateTime(selectedOrder.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={closeOrder}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Content */}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr]">

                {/* LEFT COLUMN */}

                <div className="space-y-5">

                  {/* Customer */}

                  <section
                    className={`${CARD_CLASS} p-4 shadow-none`}
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <UserRound
                        size={17}
                        className="text-[var(--admin-primary-light)]"
                      />

                      <h3 className="text-sm font-semibold text-[var(--admin-text)]">
                        Customer
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p
                          className={`text-xs ${SUBTLE_TEXT_CLASS}`}
                        >
                          Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-[var(--admin-text)]">
                          {selectedOrder.shipping_name ||
                            getCustomer(selectedOrder)?.name ||
                            "Guest Customer"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p
                            className={`text-xs ${SUBTLE_TEXT_CLASS}`}
                          >
                            Email
                          </p>

                          <div
                            className={`mt-1 flex items-center gap-2 text-sm ${MUTED_TEXT_CLASS}`}
                          >
                            <Mail
                              size={14}
                              className="shrink-0 text-[var(--admin-text-subtle)]"
                            />

                            <span className="break-all">
                              {selectedOrder.shipping_email ||
                                getCustomer(selectedOrder)?.email ||
                                "—"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p
                            className={`text-xs ${SUBTLE_TEXT_CLASS}`}
                          >
                            Phone
                          </p>

                          <p
                            className={`mt-1 text-sm ${MUTED_TEXT_CLASS}`}
                          >
                            {selectedOrder.shipping_phone ||
                              getCustomer(selectedOrder)?.phone ||
                              "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Order Items */}

                  <section
                    className={`${CARD_CLASS} overflow-hidden shadow-none`}
                  >
                    <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package
                          size={17}
                          className="text-[var(--admin-primary-light)]"
                        />

                        <h3 className="text-sm font-semibold text-[var(--admin-text)]">
                          Order Items
                        </h3>
                      </div>

                      <span
                        className={`text-xs ${SUBTLE_TEXT_CLASS}`}
                      >
                        {selectedOrderItems.length} product
                        {selectedOrderItems.length === 1
                          ? ""
                          : "s"}
                      </span>
                    </div>

                    {selectedOrderItems.length === 0 ? (
                      <div
                        className={`px-4 py-8 text-center text-sm ${MUTED_TEXT_CLASS}`}
                      >
                        No order items found.
                      </div>
                    ) : (
                      <div className="divide-y divide-[var(--admin-border)]">
                        {selectedOrderItems.map((item) => {
                          const lineTotal =
                            item.total_price != null
                              ? Number(item.total_price)
                              : item.unit_price != null
                                ? Number(item.unit_price) *
                                  Number(item.quantity)
                                : null;

                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 px-4 py-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[var(--admin-text)]">
                                  {item.product_name}
                                </p>

                                <div
                                  className={`mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs ${SUBTLE_TEXT_CLASS}`}
                                >
                                  {item.sku && (
                                    <span>
                                      SKU: {item.sku}
                                    </span>
                                  )}

                                  <span>
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>

                              <p className="shrink-0 text-sm font-semibold text-[var(--admin-text)]">
                                {lineTotal != null
                                  ? formatMoney(lineTotal)
                                  : "—"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* Shipping Information */}

                  <section
                    className={`${CARD_CLASS} p-4 shadow-none`}
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <Package
                        size={17}
                        className="text-[var(--admin-primary-light)]"
                      />

                      <h3 className="text-sm font-semibold text-[var(--admin-text)]">
                        Shipping Information
                      </h3>
                    </div>

                    <div
                      className={`text-sm leading-6 ${MUTED_TEXT_CLASS}`}
                    >
                      <p className="font-medium text-[var(--admin-text)]">
                        {selectedOrder.shipping_name || "—"}
                      </p>

                      <p className="mt-1 whitespace-pre-line">
                        {selectedOrder.shipping_address || "—"}
                      </p>

                      <p>
                        {[
                          selectedOrder.shipping_city,
                          selectedOrder.shipping_state,
                          selectedOrder.shipping_pincode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </p>

                      {selectedOrder.shipping_phone && (
                        <p className="mt-2 text-[var(--admin-text-secondary)]">
                          {selectedOrder.shipping_phone}
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Notes */}

                  {selectedOrder.notes && (
                    <section
                      className={`${CARD_CLASS} p-4 shadow-none`}
                    >
                      <h3 className="text-sm font-semibold text-[var(--admin-text)]">
                        Notes
                      </h3>

                      <p
                        className={`mt-2 whitespace-pre-line text-sm leading-6 ${MUTED_TEXT_CLASS}`}
                      >
                        {selectedOrder.notes}
                      </p>
                    </section>
                  )}
                </div>

                {/* RIGHT COLUMN */}

                <div className="space-y-5">

                  {/* Order Status */}

                  <section
                    className={`${CARD_CLASS} p-4 shadow-none`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-[var(--admin-text)]">
                        Order Status
                      </h3>

                      <OrderStatusBadge
                        status={getEffectiveOrderStatus(
                          selectedOrder
                        )}
                      />
                    </div>

                    <SelectField
                      value={getEffectiveOrderStatus(
                        selectedOrder
                      )}
                      disabled={
                        savingStatus ||
                        isTerminalStatus(
                          getEffectiveOrderStatus(
                            selectedOrder
                          )
                        )
                      }
                      onChange={(value) =>
                        updateOrderStatus(
                          selectedOrder.id,
                          value as DisplayOrderStatus
                        )
                      }
                    >
                      {getAvailableStatusOptions(
                        selectedOrder
                      ).map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </SelectField>

                    {savingStatus && (
                      <div
                        className={`mt-2 flex items-center gap-2 text-xs ${MUTED_TEXT_CLASS}`}
                      >
                        <RefreshCw
                          size={13}
                          className="animate-spin"
                        />
                        Saving status...
                      </div>
                    )}

                    {selectedOrder.payment_status ===
                      "PAID" &&
                      getEffectiveOrderStatus(
                        selectedOrder
                      ) === "RECEIVED" && (
                        <p
                          className={`mt-3 text-xs leading-5 ${MUTED_TEXT_CLASS}`}
                        >
                          Payment is completed. This order has
                          been received and must be manually
                          confirmed by the admin before
                          processing.
                        </p>
                      )}

                    {selectedOrder.payment_status !==
                      "PAID" &&
                      selectedOrder.status !==
                        "CANCELLED" &&
                      selectedOrder.status !==
                        "REFUNDED" && (
                        <p
                          className={`mt-3 text-xs leading-5 ${MUTED_TEXT_CLASS}`}
                        >
                          This order remains in Pending Payment
                          until the payment is completed.
                        </p>
                      )}

                    {isTerminalStatus(
                      getEffectiveOrderStatus(
                        selectedOrder
                      )
                    ) && (
                      <p
                        className={`mt-3 text-xs leading-5 ${MUTED_TEXT_CLASS}`}
                      >
                        This order has reached a final status
                        and cannot be changed.
                      </p>
                    )}
                  </section>

                  {/* Payment */}

                  <section
                    className={`${CARD_CLASS} p-4 shadow-none`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-[var(--admin-text)]">
                        Payment
                      </h3>

                      <PaymentStatusBadge
                        status={selectedOrder.payment_status}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className={MUTED_TEXT_CLASS}>
                          Payment Status
                        </span>

                        <span className="font-medium text-[var(--admin-text)]">
                          {getPaymentLabel(
                            selectedOrder.payment_status
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className={MUTED_TEXT_CLASS}>
                          Order Status
                        </span>

                        <span className="font-medium text-[var(--admin-text)]">
                          {getStatusLabel(
                            getEffectiveOrderStatus(
                              selectedOrder
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Order Summary */}

                  <section
                    className={`${CARD_CLASS} p-4 shadow-none`}
                  >
                    <h3 className="mb-4 text-sm font-semibold text-[var(--admin-text)]">
                      Order Summary
                    </h3>

                    <div className="space-y-3 text-sm">
                      {[
                        [
                          "Subtotal",
                          selectedOrder.subtotal,
                        ],
                        [
                          "Discount",
                          selectedOrder.discount_amount,
                        ],
                        [
                          "Shipping",
                          selectedOrder.shipping_amount,
                        ],
                        ["Tax", selectedOrder.tax_amount],
                      ].map(([label, value]) => (
                        <div
                          key={String(label)}
                          className="flex items-center justify-between"
                        >
                          <span className={MUTED_TEXT_CLASS}>
                            {label}
                          </span>

                          <span className="font-medium text-[var(--admin-text)]">
                            {formatMoney(
                              value as number | null
                            )}
                          </span>
                        </div>
                      ))}

                      <div className="border-t border-[var(--admin-border)] pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[var(--admin-text)]">
                            Total
                          </span>

                          <span className="text-lg font-semibold text-[var(--admin-primary-light)]">
                            {formatMoney(
                              selectedOrder.total_amount
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Delete Order */}

                  <section className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                        <Trash2 size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-[var(--admin-text)]">
                          Delete Order
                        </h3>

                        <p
                          className={`mt-1 text-xs leading-5 ${MUTED_TEXT_CLASS}`}
                        >
                          Permanently remove this order and its
                          associated items.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            openDeleteConfirmation(
                              selectedOrder
                            )
                          }
                          className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-red-500/30 bg-[var(--admin-surface)] px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          <Trash2
                            size={14}
                            className="mr-2"
                          />
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-5 py-3 sm:px-6">
              <div
                className={`hidden items-center gap-2 text-xs sm:flex ${SUBTLE_TEXT_CLASS}`}
              >
                <ArrowDownUp size={13} />
                Last updated{" "}
                {formatDateTime(selectedOrder.updated_at)}
              </div>

              <button
                type="button"
                onClick={closeOrder}
                disabled={savingStatus || deleting}
                className={`${BUTTON_SECONDARY_CLASS} ml-auto`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={closeDeleteConfirmation}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-[var(--admin-shadow)]">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                  <Trash2 size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-[var(--admin-text)]">
                    Delete Order?
                  </h2>

                  <p
                    className={`mt-2 text-sm leading-6 ${MUTED_TEXT_CLASS}`}
                  >
                    Are you sure you want to permanently delete
                    order{" "}
                    <span className="font-semibold text-[var(--admin-text)]">
                      #{orderToDelete.order_number}
                    </span>
                    ?
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                <p className="text-xs leading-5 text-red-500">
                  This will permanently delete the order and its
                  associated order items. This action cannot be
                  undone.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={deleting}
                className={BUTTON_SECONDARY_CLASS}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteOrder}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="mr-2 animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={15}
                      className="mr-2"
                    />
                    Delete Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}