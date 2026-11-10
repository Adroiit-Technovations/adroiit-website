"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ChevronDown,
  Eye,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

type Order = {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
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
};

type SortOption =
  | "NEWEST"
  | "OLDEST"
  | "NAME_ASC"
  | "NAME_DESC"
  | "ORDERS_DESC"
  | "SPENT_DESC"
  | "SPENT_ASC";

type CustomerMetrics = {
  total_orders: number;
  total_spent: number;
};

const supabase = createClient();

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

function formatMoney(value: number | null | undefined) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "CU";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0]?.[0] || ""}${parts[
    parts.length - 1
  ]?.[0] || ""}`.toUpperCase();
}

function getOrderStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "DELIVERED":
      return {
        background: "rgba(52,211,153,0.10)",
        color: "var(--admin-success)",
        border: "rgba(52,211,153,0.20)",
      };

    case "CANCELLED":
    case "REFUNDED":
      return {
        background: "rgba(248,113,113,0.10)",
        color: "var(--admin-danger)",
        border: "rgba(248,113,113,0.20)",
      };

    case "PROCESSING":
    case "SHIPPED":
      return {
        background: "rgba(140,82,255,0.10)",
        color: "var(--admin-primary-light)",
        border: "rgba(140,82,255,0.20)",
      };

    default:
      return {
        background: "rgba(250,204,21,0.10)",
        color: "var(--admin-warning)",
        border: "rgba(250,204,21,0.20)",
      };
  }
}

function getOrderStatusLabel(status: string) {
  return ORDER_STATUS_LABELS[status.toUpperCase()] || status;
}

function SelectField({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border px-4 pr-10 text-sm outline-none transition"
        style={{
          backgroundColor: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
          color: "var(--admin-text)",
        }}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--admin-text-muted)" }}
      />
    </div>
  );
}

function StatItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="min-w-0 rounded-2xl border px-4 py-4"
      style={{
        backgroundColor: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      <p
        className="truncate text-sm font-medium"
        style={{ color: "var(--admin-text-secondary)" }}
      >
        {title}
      </p>

      <p
        className="mt-2 text-2xl font-bold tracking-tight"
        style={{ color: "var(--admin-text)" }}
      >
        {value}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl border px-3 py-3"
      style={{
        backgroundColor: "var(--admin-surface-2)",
        borderColor: "var(--admin-border)",
      }}
    >
      <p
        className="text-[11px] font-medium"
        style={{ color: "var(--admin-text-muted)" }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-sm font-bold"
        style={{ color: "var(--admin-text)" }}
      >
        {value}
      </p>
    </div>
  );
}

function getCustomerAddress(order: Order | null) {
  if (!order) return "";

  const address =
    order.shipping_address || order.billing_address || "";

  const city =
    order.shipping_city || order.billing_city;

  const state =
    order.shipping_state || order.billing_state;

  const pincode =
    order.shipping_pincode || order.billing_pincode;

  return [address, city, state, pincode]
    .filter(Boolean)
    .join(", ");
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [deletingCustomerId, setDeletingCustomerId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [sortOption, setSortOption] =
    useState<SortOption>("NEWEST");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [customerPendingDeletion, setCustomerPendingDeletion] =
    useState<Customer | null>(null);

  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [verifyingPassword, setVerifyingPassword] =
    useState(false);

  // ============================================================
  // LOAD CUSTOMERS AND ORDERS
  // ============================================================

  const loadCustomers = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [customerResult, orderResult] =
        await Promise.all([
          supabase
            .from("customers")
            .select(
              "id, name, email, phone, created_at, updated_at"
            )
            .order("created_at", {
              ascending: false,
            }),

          supabase
            .from("orders")
            .select(
              `id, order_number, customer_id, status, payment_status, total_amount, created_at,
               shipping_name, shipping_phone, shipping_email, shipping_address,
               shipping_city, shipping_state, shipping_pincode,
               billing_address, billing_city, billing_state, billing_pincode`
            )
            .order("created_at", {
              ascending: false,
            }),
        ]);

      if (customerResult.error) {
        throw new Error(customerResult.error.message);
      }

      if (orderResult.error) {
        throw new Error(orderResult.error.message);
      }

      setCustomers(
        (customerResult.data || []) as Customer[]
      );

      setOrders(
        ((orderResult.data || []) as Order[]).map(
          (order) => ({
            ...order,
            total_amount: Number(
              order.total_amount || 0
            ),
          })
        )
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load customers."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  // ============================================================
  // PAID ORDERS ONLY
  // ============================================================

  const paidOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          String(order.payment_status || "")
            .trim()
            .toUpperCase() === "PAID"
      ),
    [orders]
  );

  // ============================================================
  // CUSTOMER METRICS AND LAST ORDER DATE
  // ============================================================

  const metricsByCustomer = useMemo(() => {
    const result = new Map<string, CustomerMetrics>();

    for (const order of paidOrders) {
      if (!order.customer_id) continue;

      const current = result.get(order.customer_id) || {
        total_orders: 0,
        total_spent: 0,
      };

      current.total_orders += 1;
      current.total_spent += Number(
        order.total_amount || 0
      );

      result.set(order.customer_id, current);
    }

    return result;
  }, [paidOrders]);

  const customersWithMetrics = useMemo(() => {
    const latestOrderByCustomer = new Map<string, string>();

    for (const order of paidOrders) {
      if (!order.customer_id) continue;

      const currentLatest = latestOrderByCustomer.get(
        order.customer_id
      );

      if (
        !currentLatest ||
        new Date(order.created_at).getTime() >
          new Date(currentLatest).getTime()
      ) {
        latestOrderByCustomer.set(
          order.customer_id,
          order.created_at
        );
      }
    }

    return customers.map((customer) => ({
      ...customer,

      metrics:
        metricsByCustomer.get(customer.id) || {
          total_orders: 0,
          total_spent: 0,
        },

      last_ordered_at:
        latestOrderByCustomer.get(customer.id) || null,
    }));
  }, [customers, metricsByCustomer, paidOrders]);

  // ============================================================
  // SEARCH AND SORT
  // ============================================================

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = customersWithMetrics.filter(
      (customer) =>
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query)
    );

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "OLDEST":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );

        case "NAME_ASC":
          return a.name.localeCompare(b.name);

        case "NAME_DESC":
          return b.name.localeCompare(a.name);

        case "ORDERS_DESC":
          return (
            b.metrics.total_orders -
            a.metrics.total_orders
          );

        case "SPENT_DESC":
          return (
            b.metrics.total_spent -
            a.metrics.total_spent
          );

        case "SPENT_ASC":
          return (
            a.metrics.total_spent -
            b.metrics.total_spent
          );

        case "NEWEST":
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });
  }, [customersWithMetrics, search, sortOption]);

  // ============================================================
  // OVERALL STATISTICS
  // ============================================================

  const stats = useMemo(() => {
    const totalOrders = paidOrders.length;

    const totalSpent = paidOrders.reduce(
      (sum, order) =>
        sum + Number(order.total_amount || 0),
      0
    );

    return {
      customers: customers.length,
      totalOrders,
      totalSpent,
      averageOrderValue:
        totalOrders > 0
          ? totalSpent / totalOrders
          : 0,
    };
  }, [customers.length, paidOrders]);

  // ============================================================
  // SELECTED CUSTOMER ORDER HISTORY
  // ============================================================

  const selectedCustomerOrders = useMemo(() => {
    if (!selectedCustomer) return [];

    return paidOrders
      .filter(
        (order) =>
          order.customer_id === selectedCustomer.id
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  }, [paidOrders, selectedCustomer]);

  const selectedMetrics = useMemo(() => {
    const totalSpent = selectedCustomerOrders.reduce(
      (sum, order) =>
        sum + Number(order.total_amount || 0),
      0
    );

    return {
      totalOrders: selectedCustomerOrders.length,
      totalSpent,
      averageOrderValue:
        selectedCustomerOrders.length
          ? totalSpent / selectedCustomerOrders.length
          : 0,
    };
  }, [selectedCustomerOrders]);

  const latestCustomerOrder =
    selectedCustomerOrders[0] || null;

  const customerAddress =
    getCustomerAddress(latestCustomerOrder);

  // ============================================================
  // DELETE CUSTOMER WITH ADMIN PASSWORD
  // ============================================================

  const requestCustomerDeletion = (customer: Customer) => {
    setPasswordError("");
    setAdminPassword("");
    setCustomerPendingDeletion(customer);
  };

  const closeDeleteConfirmation = () => {
    if (verifyingPassword) return;

    setCustomerPendingDeletion(null);
    setAdminPassword("");
    setPasswordError("");
  };

  const confirmCustomerDeletion = async () => {
    if (!customerPendingDeletion) return;

    const password = adminPassword;

    if (!password.trim()) {
      setPasswordError(
        "Enter your admin password to continue."
      );
      return;
    }

    try {
      setVerifyingPassword(true);
      setPasswordError("");
      setError("");

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (
        userError ||
        !userData.user?.email ||
        !userData.user.id
      ) {
        throw new Error(
          "Your admin session could not be verified. Please sign in again."
        );
      }

      const currentAdminId = userData.user.id;
      const currentAdminEmail = userData.user.email;

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email: currentAdminEmail,
        password,
      });

      if (authError || !authData.user) {
        setPasswordError(
          "Incorrect admin password. Please try again."
        );
        return;
      }

      if (authData.user.id !== currentAdminId) {
        setPasswordError(
          "The credentials do not match the currently signed-in admin."
        );
        return;
      }

      const customer = customerPendingDeletion;

      setDeletingCustomerId(customer.id);

      // Preserve historical orders by removing the customer reference.
      const { error: detachError } = await supabase
        .from("orders")
        .update({ customer_id: null })
        .eq("customer_id", customer.id);

      if (detachError) {
        throw new Error(
          `Could not preserve order history: ${detachError.message}`
        );
      }

      const { error: deleteError } = await supabase
        .from("customers")
        .delete()
        .eq("id", customer.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setCustomers((current) =>
        current.filter(
          (item) => item.id !== customer.id
        )
      );

      setOrders((current) =>
        current.map((order) =>
          order.customer_id === customer.id
            ? { ...order, customer_id: null }
            : order
        )
      );

      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer(null);
      }

      setCustomerPendingDeletion(null);
      setAdminPassword("");
      setPasswordError("");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete customer."
      );

      await loadCustomers(true);
    } finally {
      setDeletingCustomerId(null);
      setVerifyingPassword(false);
    }
  };

  // ============================================================
  // PAGE UI
  // ============================================================

  return (
    <section
      className="mx-auto -mt-15 w-full max-w-[1350px]"
      style={{ color: "var(--admin-text)" }}
    >
      {/* HEADER */}

      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              color: "var(--admin-primary-light)",
            }}
          >
            Store Management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Customers
          </h1>

          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Manage customer profiles, paid orders and
            spending information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCustomers(true)}
          disabled={refreshing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: "#5921c7",
            borderColor: "#5921c7",
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
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm"
          style={{
            backgroundColor: "rgba(248,113,113,0.06)",
            borderColor: "rgba(248,113,113,0.18)",
            color: "var(--admin-danger)",
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              Customer operation failed
            </p>

            <p className="mt-1 break-words opacity-90">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0"
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatItem
          title="Total Customers"
          value={String(stats.customers)}
        />

        <StatItem
          title="Total Paid Orders"
          value={String(stats.totalOrders)}
        />

        <StatItem
          title="Overall Average Order Value"
          value={formatMoney(stats.averageOrderValue)}
        />

        <StatItem
          title="Total Customer Spend / Sales"
          value={formatMoney(stats.totalSpent)}
        />
      </div>

      {/* SEARCH AND SORT */}

      <div
        className="mb-5 rounded-2xl border p-3 sm:p-4"
        style={{
          backgroundColor: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
        }}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_210px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{
                color: "var(--admin-text-muted)",
              }}
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search customers by name, email or phone..."
              className="h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition"
              style={{
                backgroundColor: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            />
          </div>

          <SelectField
            value={sortOption}
            onChange={(value) =>
              setSortOption(value as SortOption)
            }
          >
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="NAME_ASC">Name A–Z</option>
            <option value="NAME_DESC">Name Z–A</option>
            <option value="ORDERS_DESC">Most Paid Orders</option>
            <option value="SPENT_DESC">Highest Spend</option>
            <option value="SPENT_ASC">Lowest Spend</option>
          </SelectField>
        </div>
      </div>

      {/* CUSTOMER COUNT */}

      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-sm"
          style={{ color: "var(--admin-text-muted)" }}
        >
          Showing{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--admin-text)" }}
          >
            {filteredCustomers.length}
          </span>{" "}
          customer{filteredCustomers.length === 1 ? "" : "s"}
        </p>

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-xs font-semibold"
            style={{
              color: "var(--admin-primary-light)",
            }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* LOADING / EMPTY / DATA */}

      {loading ? (
        <div
          className="flex min-h-[420px] items-center justify-center rounded-2xl border"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <RefreshCw
              size={22}
              className="animate-spin"
              style={{
                color: "var(--admin-primary-light)",
              }}
            />

            <p
              className="text-sm"
              style={{
                color: "var(--admin-text-muted)",
              }}
            >
              Loading customers...
            </p>
          </div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div
          className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border px-6 text-center"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
          }}
        >
          <h2 className="text-lg font-bold">
            No customers found
          </h2>

          <p
            className="mt-1 max-w-md text-sm"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Try changing your search criteria.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}

          <div
            className="hidden overflow-hidden rounded-2xl border lg:block"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    {[
                      "Customer",
                      "Contact",
                      "Paid Orders",
                      "Total Spent",
                      "Avg. Order",
                      "Last Ordered",
                      "Joined",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em]"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => {
                    const averageOrder =
                      customer.metrics.total_orders
                        ? customer.metrics.total_spent /
                          customer.metrics.total_orders
                        : 0;

                    return (
                      <tr
                        key={customer.id}
                        className="border-b last:border-b-0"
                        style={{
                          borderColor: "var(--admin-border)",
                        }}
                      >
                        <td className="px-5 py-4">
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-semibold"
                              style={{
                                color: "var(--admin-text)",
                              }}
                            >
                              {customer.name}
                            </p>

                            <p
                              className="mt-0.5 text-xs"
                              style={{
                                color: "var(--admin-text-muted)",
                              }}
                            >
                              ID: {customer.id.slice(0, 8)}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            {customer.email && (
                              <p
                                className="max-w-[240px] truncate text-xs"
                                style={{
                                  color: "var(--admin-text-secondary)",
                                }}
                              >
                                {customer.email}
                              </p>
                            )}

                            {customer.phone && (
                              <p
                                className="text-xs"
                                style={{
                                  color: "var(--admin-text-secondary)",
                                }}
                              >
                                {customer.phone}
                              </p>
                            )}

                            {!customer.email &&
                              !customer.phone && (
                                <span
                                  className="text-xs"
                                  style={{
                                    color: "var(--admin-text-muted)",
                                  }}
                                >
                                  No contact details
                                </span>
                              )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          {customer.metrics.total_orders}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          {formatMoney(customer.metrics.total_spent)}
                        </td>

                        <td
                          className="px-5 py-4 text-sm"
                          style={{
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          {formatMoney(averageOrder)}
                        </td>

                        <td
                          className="px-5 py-4 text-sm"
                          style={{
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          {customer.last_ordered_at
                            ? formatDate(customer.last_ordered_at)
                            : "Never"}
                        </td>

                        <td
                          className="px-5 py-4 text-sm"
                          style={{
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          {formatDate(customer.created_at)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCustomer(customer)
                              }
                              aria-label={`View ${customer.name}`}
                              title="View customer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:border-purple-500/40"
                              style={{
                                backgroundColor: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-primary-light)",
                              }}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                requestCustomerDeletion(customer)
                              }
                              disabled={
                                deletingCustomerId === customer.id
                              }
                              aria-label={`Delete ${customer.name}`}
                              title="Delete customer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50"
                              style={{
                                backgroundColor: "rgba(248,113,113,0.06)",
                                borderColor: "rgba(248,113,113,0.20)",
                                color: "var(--admin-danger)",
                              }}
                            >
                              {deletingCustomerId === customer.id ? (
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CUSTOMER CARDS */}

          <div className="space-y-3 lg:hidden">
            {filteredCustomers.map((customer) => {
              const averageOrder =
                customer.metrics.total_orders
                  ? customer.metrics.total_spent /
                    customer.metrics.total_orders
                  : 0;

              return (
                <div
                  key={customer.id}
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor: "var(--admin-surface)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                      style={{
                        backgroundColor: "rgba(89,33,199,0.10)",
                        color: "var(--admin-primary-light)",
                      }}
                    >
                      {getInitials(customer.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold">
                        {customer.name}
                      </h3>

                      <p
                        className="mt-0.5 truncate text-xs"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        {customer.email ||
                          customer.phone ||
                          "No contact details"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Metric
                      label="Paid Orders"
                      value={String(customer.metrics.total_orders)}
                    />

                    <Metric
                      label="Total Spent"
                      value={formatMoney(customer.metrics.total_spent)}
                    />

                    <Metric
                      label="Avg. Order"
                      value={formatMoney(averageOrder)}
                    />

                    <Metric
                      label="Last Ordered"
                      value={
                        customer.last_ordered_at
                          ? formatDate(customer.last_ordered_at)
                          : "Never"
                      }
                    />

                    <Metric
                      label="Joined"
                      value={formatDate(customer.created_at)}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCustomer(customer)
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    >
                      View Customer
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        requestCustomerDeletion(customer)
                      }
                      disabled={
                        deletingCustomerId === customer.id
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold disabled:opacity-50"
                      style={{
                        backgroundColor: "rgba(248,113,113,0.06)",
                        borderColor: "rgba(248,113,113,0.20)",
                        color: "var(--admin-danger)",
                      }}
                    >
                      {deletingCustomerId === customer.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CUSTOMER DETAILS MODAL */}

      {selectedCustomer && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomer(null);
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
            }}
          >
            {/* MODAL HEADER */}

            <div
              className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
              style={{
                borderColor: "var(--admin-border)",
              }}
            >
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">
                  {selectedCustomer.name}
                </h2>

                <p
                  className="mt-0.5 text-xs"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Customer since{" "}
                  {formatDate(selectedCustomer.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
                aria-label="Close customer details"
              >
                <X size={17} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-75px)] overflow-y-auto p-5 sm:p-6">
              {/* CUSTOMER METRICS */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric
                  label="Paid Orders"
                  value={String(selectedMetrics.totalOrders)}
                />

                <Metric
                  label="Total Spent"
                  value={formatMoney(selectedMetrics.totalSpent)}
                />

                <Metric
                  label="Average Order Value"
                  value={formatMoney(
                    selectedMetrics.averageOrderValue
                  )}
                />

                <Metric
                  label="Last Ordered"
                  value={
                    latestCustomerOrder
                      ? formatDate(latestCustomerOrder.created_at)
                      : "Never"
                  }
                />
              </div>

              {/* CONTACT INFORMATION */}

              <div className="mt-6">
                <h3 className="text-sm font-bold">
                  Contact Information
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Mail
                        size={15}
                        style={{
                          color: "var(--admin-primary-light)",
                        }}
                      />

                      <span
                        className="text-xs"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Email
                      </span>
                    </div>

                    <p className="mt-2 break-all text-sm font-medium">
                      {selectedCustomer.email || "Not provided"}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-3"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Phone
                        size={15}
                        style={{
                          color: "var(--admin-primary-light)",
                        }}
                      />

                      <span
                        className="text-xs"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Phone
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium">
                      {selectedCustomer.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CUSTOMER ADDRESS */}

              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={16}
                    style={{
                      color: "var(--admin-primary-light)",
                    }}
                  />

                  <h3 className="text-sm font-bold">
                    Customer Address
                  </h3>
                </div>

                <div
                  className="mt-3 rounded-xl border p-4"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <p
                    className="text-sm leading-6"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    {customerAddress ||
                      "No address is available in this customer’s order records."}
                  </p>

                  {latestCustomerOrder && (
                    <p
                      className="mt-2 text-[11px]"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Address from the latest order #
                      {latestCustomerOrder.order_number}.
                    </p>
                  )}
                </div>
              </div>

              {/* ORDER HISTORY */}

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold">
                      Order History
                    </h3>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Only paid orders are included in this order
                      history and in the customer metrics above.
                    </p>
                  </div>

                  <Link
                    href={`/store/orders?customerId=${encodeURIComponent(
                      selectedCustomer.id
                    )}`}
                    onClick={() => setSelectedCustomer(null)}
                    className="shrink-0 text-xs font-semibold"
                    style={{
                      color: "var(--admin-primary-light)",
                    }}
                  >
                    View Orders
                  </Link>
                </div>

                <div
                  className="mt-3 overflow-hidden rounded-2xl border"
                  style={{
                    borderColor: "var(--admin-border)",
                  }}
                >
                  {selectedCustomerOrders.length === 0 ? (
                    <div
                      className="px-4 py-8 text-center"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                      }}
                    >
                      <ShoppingBag
                        size={22}
                        className="mx-auto"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      />

                      <p
                        className="mt-2 text-sm"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        No paid orders found for this customer.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {selectedCustomerOrders
                        .slice(0, 10)
                        .map((order) => {
                          const statusStyle =
                            getOrderStatusClass(order.status);

                          return (
                            <div
                              key={order.id}
                              className="flex flex-col gap-3 border-b px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                              style={{
                                backgroundColor: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                              }}
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold">
                                    #{order.order_number}
                                  </p>

                                  <span
                                    className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                                    style={{
                                      backgroundColor: statusStyle.background,
                                      borderColor: statusStyle.border,
                                      color: statusStyle.color,
                                    }}
                                  >
                                    {getOrderStatusLabel(order.status)}
                                  </span>

                                  <span
                                    className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                                    style={{
                                      backgroundColor: "rgba(52,211,153,0.08)",
                                      borderColor: "rgba(52,211,153,0.20)",
                                      color: "var(--admin-success)",
                                    }}
                                  >
                                    PAID
                                  </span>
                                </div>

                                <p
                                  className="mt-1 text-xs"
                                  style={{
                                    color: "var(--admin-text-muted)",
                                  }}
                                >
                                  {formatDateTime(order.created_at)}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-bold">
                                  {formatMoney(order.total_amount)}
                                </p>

                                <p
                                  className="mt-0.5 text-[11px]"
                                  style={{
                                    color: "var(--admin-text-muted)",
                                  }}
                                >
                                  Included in customer spend
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN PASSWORD CONFIRMATION */}

      {customerPendingDeletion && (
        <div
          className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteConfirmation();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-customer-title"
            className="w-full max-w-md rounded-2xl border p-5 shadow-2xl sm:p-6"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "rgba(248,113,113,0.10)",
                  color: "var(--admin-danger)",
                }}
              >
                <LockKeyhole size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="delete-customer-title"
                  className="text-lg font-bold"
                >
                  Confirm customer deletion
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Enter your admin account password to delete{" "}
                  <strong
                    style={{ color: "var(--admin-text)" }}
                  >
                    {customerPendingDeletion.name}
                  </strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={verifyingPassword}
                aria-label="Close password confirmation"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border disabled:opacity-50"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-muted)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5">
              <label
                htmlFor="admin-delete-password"
                className="mb-2 block text-xs font-semibold"
                style={{
                  color: "var(--admin-text-secondary)",
                }}
              >
                Admin password
              </label>

              <input
                id="admin-delete-password"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={adminPassword}
                onChange={(event) => {
                  setAdminPassword(event.target.value);

                  if (passwordError) {
                    setPasswordError("");
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !verifyingPassword
                  ) {
                    void confirmCustomerDeletion();
                  }
                }}
                placeholder="Enter your admin password"
                disabled={verifyingPassword}
                className="h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-purple-500"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: passwordError
                    ? "var(--admin-danger)"
                    : "var(--admin-border)",
                  color: "var(--admin-text)",
                }}
              />

              {passwordError && (
                <p
                  className="mt-2 text-xs"
                  style={{
                    color: "var(--admin-danger)",
                  }}
                >
                  {passwordError}
                </p>
              )}

              <p
                className="mt-3 text-xs leading-5"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                The customer's order records will be retained,
                but their customer profile link will be removed.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={verifyingPassword}
                className="h-10 rounded-xl border px-4 text-sm font-semibold disabled:opacity-50"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void confirmCustomerDeletion()
                }
                disabled={verifyingPassword || !adminPassword}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "#dc2626",
                }}
              >
                {verifyingPassword ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Verify & Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}