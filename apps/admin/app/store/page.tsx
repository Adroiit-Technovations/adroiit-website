"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FolderPlus,
  Package,
  PackageX,
  Plus,
  ShoppingBag,
  TrendingDown,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";
import {
  ORDER_STATUSES,
  INCOMPLETE_ORDER_STATUSES,
} from "@/lib/constants/order-status";

type Period = "TODAY" | "7D" | "30D" | "MONTH" | "YEAR" | "CUSTOM";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  price: number | string;
  cost_price: number | string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
};

type Category = {
  id: string;
  name: string;
  is_active: boolean;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number | string;
  discount_amount: number | string;
  shipping_amount: number | string;
  tax_amount: number | string;
  total_amount: number | string;
  shipping_name: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  sku: string | null;
  quantity: number;
  unit_price: number | string;
  unit_cost: number | string;
  discount_amount: number | string;
  total_price: number | string;
  total_cost: number | string;
};

type DateRange = {
  start: string | null;
  end: string | null;
};

const PAGE_SIZE = 1000;
const ORDER_ID_BATCH_SIZE = 100;

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "TODAY", label: "Today" },
  { value: "7D", label: "7D" },
  { value: "30D", label: "30D" },
  { value: "MONTH", label: "Month" },
  { value: "YEAR", label: "Year" },
  { value: "CUSTOM", label: "Custom" },
];

function numeric(value: number | string | null | undefined) {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
}

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function number(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCustomDate(value: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

async function fetchAllRows<T>(
  buildQuery: (
    from: number,
    to: number
  ) => PromiseLike<{
    data: T[] | null;
    error: { message: string } | null;
  }>
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await buildQuery(
      from,
      from + PAGE_SIZE - 1
    );

    if (error) throw error;

    const page = data ?? [];
    rows.push(...page);

    if (page.length < PAGE_SIZE) break;

    from += PAGE_SIZE;
  }

  return rows;
}

function getDateRange(
  period: Period,
  customStartDate?: string,
  customEndDate?: string
): DateRange {
  const now = new Date();

  if (period === "CUSTOM") {
    if (!customStartDate || !customEndDate) {
      return { start: null, end: null };
    }

    const start = new Date(`${customStartDate}T00:00:00`);
    const end = new Date(`${customEndDate}T00:00:00`);

    end.setDate(end.getDate() + 1);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  const start = new Date(now);

  if (period === "TODAY") {
    start.setHours(0, 0, 0, 0);
  }

  if (period === "7D") {
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  }

  if (period === "30D") {
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
  }

  if (period === "MONTH") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  if (period === "YEAR") {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }

  const end = new Date(now);
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function periodLabel(
  period: Period,
  customStartDate: string,
  customEndDate: string
) {
  if (period === "CUSTOM") {
    if (!customStartDate || !customEndDate) return "Custom";

    return `${formatCustomDate(customStartDate)} – ${formatCustomDate(customEndDate)}`;
  }

  return PERIOD_OPTIONS.find(
    (option) => option.value === period
  )?.label;
}

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusClass(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    case "SHIPPED":
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
    case "PROCESSING":
      return "border-purple-400/20 bg-purple-400/10 text-purple-300";
    case "CONFIRMED":
      return "border-indigo-400/20 bg-indigo-400/10 text-indigo-300";
    case "PENDING":
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
    case "CANCELLED":
      return "border-red-400/20 bg-red-400/10 text-red-300";
    case "REFUNDED":
      return "border-orange-400/20 bg-orange-400/10 text-orange-300";
    default:
      return "border-white/10 bg-white/[0.04] text-[var(--admin-text-secondary)]";
  }
}

function statusIcon(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
    case "SHIPPED":
      return Package;
    case "PROCESSING":
      return Activity;
    case "CONFIRMED":
      return CheckCircle2;
    case "PENDING":
      return ClipboardList;
    case "CANCELLED":
      return PackageX;
    case "REFUNDED":
      return TrendingDown;
    default:
      return Activity;
  }
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border p-5 shadow-[var(--admin-shadow-sm)] ${className}`}
      style={{
        backgroundColor: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2
        className="text-lg font-bold tracking-tight"
        style={{ color: "var(--admin-primary-light)" }}
      >
        {title}
      </h2>

      {description && (
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--admin-text-muted)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  danger,
}: {
  title: string;
  value: string;
  subtitle: string;
  danger?: boolean;
}) {
  return (
    <div
      className="min-w-0 rounded-xl border p-4"
      style={{
        backgroundColor: "var(--admin-surface-2)",
        borderColor: "var(--admin-border)",
      }}
    >
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--admin-primary-light)" }}
      >
        {title}
      </p>

      <p
        className="mt-3 truncate text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: "var(--admin-text)" }}
      >
        {value}
      </p>

      <p
        className="mt-2 truncate text-xs"
        style={{
          color: danger
            ? "var(--admin-danger)"
            : "var(--admin-text-muted)",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function FinanceRow({
  label,
  value,
  negative,
  strong,
}: {
  label: string;
  value: string;
  negative?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${strong ? "pt-4" : ""}`}
      style={
        strong
          ? { borderTop: "1px solid var(--admin-border)" }
          : undefined
      }
    >
      <span
        className={strong ? "font-semibold" : "text-sm"}
        style={{
          color: strong
            ? "var(--admin-text)"
            : "var(--admin-text-secondary)",
        }}
      >
        {label}
      </span>

      <span
        className={strong ? "font-bold" : "text-sm font-medium"}
        style={{
          color: negative
            ? "var(--admin-danger)"
            : "var(--admin-text)",
        }}
      >
        {negative ? "-" : ""}
        {value}
      </span>
    </div>
  );
}

function DatePickerButton({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    try {
      input.showPicker?.();
    } catch {
      input.focus();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="flex h-10 min-w-[145px] items-center gap-2 rounded-xl border px-3 text-left text-sm font-medium transition-colors"
        style={{
          backgroundColor: "var(--admin-surface-2)",
          borderColor: "var(--admin-border)",
          color: value
            ? "var(--admin-text)"
            : "var(--admin-text-muted)",
        }}
      >
        <CalendarDays
          size={16}
          strokeWidth={1.8}
          className="shrink-0"
        />
        <span className="truncate">
          {value ? formatCustomDate(value) : label}
        </span>
      </button>

      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        aria-label={label}
      />
    </div>
  );
}

export default function StoreOverviewPage() {
  const supabase = useMemo(() => createClient(), []);

  const [period, setPeriod] = useState<Period>("30D");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [appliedCustomStartDate, setAppliedCustomStartDate] = useState("");
  const [appliedCustomEndDate, setAppliedCustomEndDate] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const requestSequenceRef = useRef(0);

  const dateRange = useMemo(
    () =>
      getDateRange(
        period,
        appliedCustomStartDate,
        appliedCustomEndDate
      ),
    [period, appliedCustomStartDate, appliedCustomEndDate]
  );

  const customRangeMissing =
    period === "CUSTOM" &&
    (!appliedCustomStartDate || !appliedCustomEndDate);

  const loadDashboard = useCallback(async () => {
    const requestId = ++requestSequenceRef.current;

    try {
      setError(null);

      const productsPromise = fetchAllRows<Product>((from, to) =>
        supabase
          .from("products")
          .select(
            "id,name,sku,price,cost_price,stock_quantity,low_stock_threshold,is_active,is_featured"
          )
          .order("created_at", { ascending: false })
          .range(from, to)
      );

      const categoriesPromise = fetchAllRows<Category>((from, to) =>
        supabase
          .from("categories")
          .select("id,name,is_active")
          .order("sort_order", { ascending: true })
          .range(from, to)
      );

      const ordersPromise = customRangeMissing
        ? Promise.resolve([] as Order[])
        : fetchAllRows<Order>((from, to) => {
            let query = supabase
              .from("orders")
              .select(
                "id,order_number,status,payment_status,subtotal,discount_amount,shipping_amount,tax_amount,total_amount,shipping_name,created_at"
              )
              .order("created_at", { ascending: false });

            if (dateRange.start) {
              query = query.gte("created_at", dateRange.start);
            }

            if (dateRange.end) {
              query = query.lt("created_at", dateRange.end);
            }

            return query.range(from, to);
          });

      const customersPromise = supabase
        .from("customers")
        .select("id", { count: "exact", head: true });

      const [
        fetchedProducts,
        fetchedCategories,
        fetchedOrders,
        customersResponse,
      ] = await Promise.all([
        productsPromise,
        categoriesPromise,
        ordersPromise,
        customersPromise,
      ]);

      if (customersResponse.error) {
        throw customersResponse.error;
      }

      const eligibleOrders = fetchedOrders.filter((order) => {
        const paymentStatus = order.payment_status.toUpperCase();
        const orderStatus = order.status.toUpperCase();

        return (
          paymentStatus === "PAID" &&
          orderStatus !== "CANCELLED" &&
          orderStatus !== "REFUNDED"
        );
      });

      const eligibleOrderIds = eligibleOrders.map(
        (order) => order.id
      );

      const fetchedOrderItems: OrderItem[] = [];

      for (
        let index = 0;
        index < eligibleOrderIds.length;
        index += ORDER_ID_BATCH_SIZE
      ) {
        const batch = eligibleOrderIds.slice(
          index,
          index + ORDER_ID_BATCH_SIZE
        );

        const batchItems = await fetchAllRows<OrderItem>(
          (from, to) =>
            supabase
              .from("order_items")
              .select(
                "id,order_id,product_id,product_name,sku,quantity,unit_price,unit_cost,discount_amount,total_price,total_cost"
              )
              .in("order_id", batch)
              .range(from, to)
        );

        fetchedOrderItems.push(...batchItems);
      }

      if (requestId !== requestSequenceRef.current) return;

      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setOrders(fetchedOrders);
      setOrderItems(fetchedOrderItems);
      setCustomerCount(customersResponse.count ?? 0);
    } catch (err) {
      if (requestId !== requestSequenceRef.current) return;

      console.error("Store dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load store data."
      );
    }
  }, [dateRange, supabase, customRangeMissing]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const applyCustomRange = () => {
    if (!customStartDate || !customEndDate) return;
    if (customStartDate > customEndDate) return;

    setAppliedCustomStartDate(customStartDate);
    setAppliedCustomEndDate(customEndDate);
    setPeriod("CUSTOM");
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    ORDER_STATUSES.forEach((status) => {
      counts[status] = 0;
    });

    orders.forEach((order) => {
      const status = order.status.toUpperCase();

      if (typeof counts[status] === "number") {
        counts[status] += 1;
      }
    });

    return counts;
  }, [orders]);

  const deliveredOrders = statusCounts.DELIVERED ?? 0;

  const paidOrders = useMemo(
    () =>
      orders.filter((order) => {
        const paymentStatus = order.payment_status.toUpperCase();
        const orderStatus = order.status.toUpperCase();

        return (
          paymentStatus === "PAID" &&
          orderStatus !== "CANCELLED" &&
          orderStatus !== "REFUNDED"
        );
      }),
    [orders]
  );

  const sales = useMemo(
    () =>
      paidOrders.reduce(
        (sum, order) => sum + numeric(order.total_amount),
        0
      ),
    [paidOrders]
  );

  const subtotal = useMemo(
    () =>
      paidOrders.reduce(
        (sum, order) => sum + numeric(order.subtotal),
        0
      ),
    [paidOrders]
  );

  const discounts = useMemo(
    () =>
      paidOrders.reduce(
        (sum, order) => sum + numeric(order.discount_amount),
        0
      ),
    [paidOrders]
  );

  const shipping = useMemo(
    () =>
      paidOrders.reduce(
        (sum, order) => sum + numeric(order.shipping_amount),
        0
      ),
    [paidOrders]
  );

  const tax = useMemo(
    () =>
      paidOrders.reduce(
        (sum, order) => sum + numeric(order.tax_amount),
        0
      ),
    [paidOrders]
  );

  const cost = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) => sum + numeric(item.total_cost),
        0
      ),
    [orderItems]
  );

  const productRevenue = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) => sum + numeric(item.total_price),
        0
      ),
    [orderItems]
  );

  const profit = productRevenue - cost;

  const profitMargin =
    productRevenue > 0
      ? (profit / productRevenue) * 100
      : 0;

  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (sum, product) =>
          sum +
          numeric(product.stock_quantity) *
            numeric(product.cost_price),
        0
      ),
    [products]
  );

  const retailInventoryValue = useMemo(
    () =>
      products.reduce(
        (sum, product) =>
          sum +
          numeric(product.stock_quantity) *
            numeric(product.price),
        0
      ),
    [products]
  );

  const stockUnits = useMemo(
    () =>
      products.reduce(
        (sum, product) =>
          sum + numeric(product.stock_quantity),
        0
      ),
    [products]
  );

  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.is_active &&
          numeric(product.stock_quantity) > 0 &&
          numeric(product.stock_quantity) <=
            numeric(product.low_stock_threshold)
      ),
    [products]
  );

  const outOfStockProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.is_active &&
          numeric(product.stock_quantity) === 0
      ),
    [products]
  );

  const activeProducts = products.filter(
    (product) => product.is_active
  ).length;

  const featuredProducts = products.filter(
    (product) => product.is_active && product.is_featured
  ).length;

  const activeCategories = categories.filter(
    (category) => category.is_active
  ).length;

  const incompleteOrders = useMemo(
    () =>
      orders.filter((order) =>
        (INCOMPLETE_ORDER_STATUSES as readonly string[]).includes(
          order.status.toUpperCase()
        )
      ),
    [orders]
  );

  const recentIncompleteOrders = incompleteOrders.slice(0, 8);

  const summaryPeriodLabel =
    periodLabel(
      period,
      appliedCustomStartDate,
      appliedCustomEndDate
    ) ?? "";

  const quickActions = [
    {
      label: "Add Product",
      href: "/store/products/create",
      Icon: Plus,
    },
    {
      label: "Add Category",
      href: "/store/categories",
      Icon: FolderPlus,
    },
    {
      label: "View Orders",
      href: "/store/orders",
      Icon: ShoppingBag,
    },
    {
      label: "Manage Inventory",
      href: "/store/inventory",
      Icon: Boxes,
    },
  ];

  return (
    <>
      {/* STORE PAGE HEADER */}

      <div className="mx-auto -mt-15 w-full max-w-[1380px] min-w-0 px-2 pt-0 sm:px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--admin-primary-light)" }}
            >
              Store Management
            </p>

            <h1
              className="mt-2 text-3xl font-bold tracking-tight sm:text-3xl"
              style={{ color: "var(--admin-text)" }}
            >
              Store Dashboard
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm leading-6"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Manage products, orders, inventory and monitor your
              store&apos;s overall performance.
            </p>
          </div>

          {/* QUICK ACTIONS */}

          <div
            className="w-full min-w-0 rounded-2xl border p-3 lg:w-auto lg:max-w-[720px] lg:shrink-0"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              boxShadow: "var(--admin-shadow-sm)",
            }}
          >
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--admin-text-subtle)" }}
              >
                Quick Actions
              </span>
            </div>

            <div className="flex min-w-0 flex-nowrap items-stretch gap-2 overflow-x-auto pb-1">
              {quickActions.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex min-h-10 min-w-[145px] flex-1 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition-all hover:brightness-110 sm:min-w-[155px] sm:text-sm"
                  style={{
                    backgroundColor: "var(--admin-primary)",
                    borderColor: "var(--admin-primary)",
                    color: "#ffffff",
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.9}
                    className="shrink-0"
                  />

                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}

      <div className="mx-auto w-full max-w-[1380px] min-w-0 space-y-6 px-2 pt-3 pb-10 sm:px-4">
        {error && (
          <div
            className="flex items-start gap-3 rounded-2xl border p-4"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--admin-danger) 8%, var(--admin-surface))",
              borderColor:
                "color-mix(in srgb, var(--admin-danger) 25%, transparent)",
              color: "var(--admin-danger)",
            }}
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                Unable to load store data
              </p>
              <p className="mt-1 text-xs opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* TOP DASHBOARD: STATS + ORDER STATUS */}

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          <Card className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2
                  className="text-lg font-bold tracking-tight"
                  style={{ color: "var(--admin-primary-light)" }}
                >
                  Store Statistics
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Key performance indicators for your store
                </p>
              </div>

              <div
                className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl border p-1"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                }}
              >
                {PERIOD_OPTIONS.map((option) => {
                  const active = period === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPeriod(option.value)}
                      className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: active
                          ? "var(--admin-primary)"
                          : "transparent",
                        color: active
                          ? "#ffffff"
                          : "var(--admin-text-muted)",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {period === "CUSTOM" && (
              <div
                className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border p-3"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                }}
              >
                <DatePickerButton
                  label="From date"
                  value={customStartDate}
                  onChange={setCustomStartDate}
                  max={customEndDate || undefined}
                />

                <span
                  className="hidden text-xs sm:block"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  to
                </span>

                <DatePickerButton
                  label="To date"
                  value={customEndDate}
                  onChange={setCustomEndDate}
                  min={customStartDate || undefined}
                />

                <button
                  type="button"
                  onClick={applyCustomRange}
                  disabled={
                    !customStartDate ||
                    !customEndDate ||
                    customStartDate > customEndDate
                  }
                  className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    backgroundColor: "var(--admin-primary)",
                    color: "#ffffff",
                  }}
                >
                  Apply
                </button>

                {appliedCustomStartDate && appliedCustomEndDate && (
                  <span
                    className="ml-auto text-xs"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    Showing {formatCustomDate(appliedCustomStartDate)} –{" "}
                    {formatCustomDate(appliedCustomEndDate)}
                  </span>
                )}
              </div>
            )}

            {customRangeMissing && (
              <div
                className="mb-5 rounded-xl border p-4 text-sm"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Select a start date and end date, then click Apply to view
                dashboard data for your custom period.
              </div>
            )}

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Total Delivered Orders"
                value={number(deliveredOrders)}
                subtitle="Successfully delivered orders"
              />

              <MetricCard
                title="Total Sales"
                value={money(sales)}
                subtitle={`${summaryPeriodLabel} sales`}
              />

              <MetricCard
                title="Total Profit"
                value={money(profit)}
                subtitle={`${profitMargin.toFixed(1)}% profit margin`}
                danger={profit < 0}
              />

              <MetricCard
                title="Inventory Value"
                value={money(inventoryValue)}
                subtitle="Current stock at cost price"
              />

              <MetricCard
                title="Retail Inventory Value"
                value={money(retailInventoryValue)}
                subtitle="Potential retail value of stock"
              />

              <MetricCard
                title="Total Customers"
                value={number(customerCount)}
                subtitle="Registered customers"
              />
            </div>
          </Card>

          {/* ORDERS BY STATUS */}

          <Card className="min-w-0">
            <SectionTitle
              title="Orders by Status"
              description="Order distribution for the selected period"
            />

            <div className="space-y-2">
              {ORDER_STATUSES.map((status) => {
                const Icon = statusIcon(status);
                const count = statusCounts[status] ?? 0;

                return (
                  <div
                    key={status}
                    className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                        style={{
                          color: "var(--admin-primary-light)",
                        }}
                      />

                      <span
                        className="truncate text-xs font-medium"
                        style={{
                          color: "var(--admin-text-secondary)",
                        }}
                      >
                        {statusLabel(status)}
                      </span>
                    </div>

                    <span
                      className={`rounded-lg border px-2 py-1 text-[11px] font-bold ${statusClass(status)}`}
                    >
                      {number(count)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RECENT INCOMPLETE ORDERS */}

        <Card className="min-w-0 overflow-hidden">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2
                className="text-lg font-bold tracking-tight"
                style={{ color: "var(--admin-primary-light)" }}
              >
                Recent Incomplete Orders
              </h2>

              <p
                className="mt-1 text-sm"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Latest pending, confirmed, processing and shipped orders
              </p>
            </div>

            <Link
              href="/store/orders"
              className="flex shrink-0 items-center gap-1.5 text-xs font-semibold"
              style={{ color: "var(--admin-primary-light)" }}
            >
              View all orders
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentIncompleteOrders.length === 0 ? (
            <div
              className="rounded-xl border p-8 text-center"
              style={{
                backgroundColor: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
              }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--admin-text-muted)" }}
              >
                No incomplete orders found for this period.
              </p>
            </div>
          ) : (
            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    {[
                      "Order",
                      "Customer",
                      "Status",
                      "Payment",
                      "Amount",
                      "Date",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-3 pb-3 text-xs font-semibold"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {recentIncompleteOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      <td className="px-3 py-3.5">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--admin-text)" }}
                        >
                          #{order.order_number}
                        </span>
                      </td>

                      <td className="max-w-[170px] truncate px-3 py-3.5">
                        <span
                          className="text-sm"
                          style={{
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          {order.shipping_name || "—"}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex rounded-lg border px-2 py-1 text-[10px] font-bold ${statusClass(order.status)}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className="text-xs font-medium"
                          style={{
                            color:
                              order.payment_status.toUpperCase() === "PAID"
                                ? "var(--admin-success)"
                                : "var(--admin-text-muted)",
                          }}
                        >
                          {statusLabel(order.payment_status)}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {money(numeric(order.total_amount))}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className="text-xs"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* FINANCIAL OVERVIEW */}

        <Card>
          <SectionTitle
            title="Financial Overview"
            description={`Financial breakdown for ${summaryPeriodLabel.toLowerCase()}`}
          />

          <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-4">
              <FinanceRow label="Gross Sales" value={money(subtotal)} />
              <FinanceRow
                label="Discounts"
                value={money(discounts)}
                negative
              />
              <FinanceRow label="Shipping" value={money(shipping)} />
              <FinanceRow label="Tax" value={money(tax)} />
              <FinanceRow
                label="Net Sales"
                value={money(sales)}
                strong
              />
            </div>

            <div className="space-y-4">
              <FinanceRow
                label="Product Revenue"
                value={money(productRevenue)}
              />
              <FinanceRow
                label="Cost of Goods Sold"
                value={money(cost)}
                negative
              />
              <FinanceRow
                label="Total Profit"
                value={money(profit)}
                strong
              />
            </div>

            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Profit Margin
              </p>

              <p
                className="mt-2 text-4xl font-bold"
                style={{
                  color:
                    profitMargin >= 0
                      ? "var(--admin-success)"
                      : "var(--admin-danger)",
                }}
              >
                {profitMargin.toFixed(1)}%
              </p>

              <div
                className="mt-5 h-2 overflow-hidden rounded-full"
                style={{
                  backgroundColor: "var(--admin-surface-hover)",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, profitMargin)
                    )}%`,
                    backgroundColor: "var(--admin-primary-light)",
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className="text-xs"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Total Profit
                </span>

                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--admin-text)" }}
                >
                  {money(profit)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* INVENTORY OVERVIEW */}

        <Card>
          <SectionTitle
            title="Inventory Overview"
            description="Current inventory position"
          />

          <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <FinanceRow
                label="Active Products"
                value={number(activeProducts)}
              />
              <FinanceRow
                label="Featured Products"
                value={number(featuredProducts)}
              />
              <FinanceRow
                label="Active Categories"
                value={number(activeCategories)}
              />
              <FinanceRow
                label="Units in Stock"
                value={number(stockUnits)}
              />
              <FinanceRow
                label="Inventory at Cost"
                value={money(inventoryValue)}
                strong
              />
            </div>

            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Retail Inventory Value
              </p>

              <p
                className="mt-2 text-3xl font-bold tracking-tight"
                style={{ color: "var(--admin-text)" }}
              >
                {money(retailInventoryValue)}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className="text-xs"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Potential gross value
                </span>

                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--admin-success)" }}
                >
                  {money(
                    Math.max(0, retailInventoryValue - inventoryValue)
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* STOCK ALERTS */}

        <Card className="min-w-0">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <SectionTitle
              title="Stock Alerts"
              description="Products requiring inventory attention"
            />

            <Link
              href="/store/inventory"
              className="flex shrink-0 items-center gap-1.5 text-xs font-semibold"
              style={{ color: "var(--admin-primary-light)" }}
            >
              Manage inventory
              <ChevronRight size={14} />
            </Link>
          </div>

          {outOfStockProducts.length === 0 &&
          lowStockProducts.length === 0 ? (
            <div
              className="rounded-xl border p-7 text-center"
              style={{
                backgroundColor: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--admin-success)" }}
              >
                Inventory is healthy
              </p>
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {outOfStockProducts.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl border p-3"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--admin-danger) 5%, var(--admin-surface-2))",
                    borderColor:
                      "color-mix(in srgb, var(--admin-danger) 20%, var(--admin-border))",
                  }}
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {product.name}
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--admin-danger)" }}
                    >
                      Out of stock
                    </p>
                  </div>
                </div>
              ))}

              {lowStockProducts.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl border p-3"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--admin-warning) 5%, var(--admin-surface-2))",
                    borderColor:
                      "color-mix(in srgb, var(--admin-warning) 20%, var(--admin-border))",
                  }}
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {product.name}
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--admin-warning)" }}
                    >
                      {number(product.stock_quantity)} units remaining
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}