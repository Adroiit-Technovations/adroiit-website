
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Edit3,
  Loader2,
  Plus,
  Power,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { createClient } from "@/lib/supabase/client";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

type DiscountType = "PERCENTAGE" | "FIXED";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_count: number;
  per_customer_limit: number | null;
  is_active: boolean;
  show_on_checkout: boolean;
  created_at: string;
  updated_at: string;
};

type CouponForm = {
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: string;
  min_order_amount: string;
  max_discount_amount: string;
  starts_at: string;
  expires_at: string;
  usage_limit: string;
  per_customer_limit: string;
  is_active: boolean;
  show_on_checkout: boolean;
};

const EMPTY_FORM: CouponForm = {
  code: "",
  description: "",
  discount_type: "PERCENTAGE",
  discount_value: "",
  min_order_amount: "0",
  max_discount_amount: "",
  starts_at: "",
  expires_at: "",
  usage_limit: "",
  per_customer_limit: "",
  is_active: true,
  show_on_checkout: true,
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDate(value: string | null) {
  if (!value) return "No limit";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function couponState(coupon: Coupon) {
  const now = Date.now();

  if (!coupon.is_active) return "INACTIVE";

  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now) {
    return "SCHEDULED";
  }

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= now) {
    return "EXPIRED";
  }

  if (
    coupon.usage_limit !== null &&
    coupon.usage_count >= coupon.usage_limit
  ) {
    return "LIMIT REACHED";
  }

  return "ACTIVE";
}

function statusStyle(status: string) {
  switch (status) {
    case "ACTIVE":
      return {
        backgroundColor: "rgba(16,185,129,0.10)",
        color: "#059669",
      };

    case "SCHEDULED":
      return {
        backgroundColor: "rgba(89,33,199,0.10)",
        color: "var(--admin-primary-light)",
      };

    case "EXPIRED":
    case "LIMIT REACHED":
      return {
        backgroundColor: "rgba(245,158,11,0.10)",
        color: "#b45309",
      };

    default:
      return {
        backgroundColor: "rgba(113,113,122,0.12)",
        color: "var(--admin-text-muted)",
      };
  }
}

function formFromCoupon(coupon: Coupon): CouponForm {
  return {
    code: coupon.code,
    description: coupon.description ?? "",
    discount_type: coupon.discount_type,
    discount_value: String(coupon.discount_value),
    min_order_amount: String(coupon.min_order_amount),
    max_discount_amount:
      coupon.max_discount_amount === null
        ? ""
        : String(coupon.max_discount_amount),
    starts_at: toDateTimeLocal(coupon.starts_at),
    expires_at: toDateTimeLocal(coupon.expires_at),
    usage_limit:
      coupon.usage_limit === null ? "" : String(coupon.usage_limit),
    per_customer_limit:
      coupon.per_customer_limit === null
        ? ""
        : String(coupon.per_customer_limit),
    is_active: coupon.is_active,
    show_on_checkout: coupon.show_on_checkout ?? true,
  };
}

export default function CouponsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponForm>(EMPTY_FORM);

  const [updatingCouponIds, setUpdatingCouponIds] = useState<Set<string>>(
    () => new Set()
  );

  async function loadCoupons(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from("coupons")
        .select(
          "id,code,description,discount_type,discount_value,min_order_amount,max_discount_amount,starts_at,expires_at,usage_limit,usage_count,per_customer_limit,is_active,show_on_checkout,created_at,updated_at"
        )
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setCoupons((data ?? []) as Coupon[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load coupons."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCoupons = useMemo(() => {
    const term = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const status = couponState(coupon);

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const matchesSearch =
        !term ||
        coupon.code.toLowerCase().includes(term) ||
        (coupon.description ?? "").toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [coupons, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: coupons.length,
      active: coupons.filter(
        (coupon) => couponState(coupon) === "ACTIVE"
      ).length,
      scheduled: coupons.filter(
        (coupon) => couponState(coupon) === "SCHEDULED"
      ).length,
      used: coupons.reduce(
        (total, coupon) => total + Number(coupon.usage_count ?? 0),
        0
      ),
    };
  }, [coupons]);

  function openCreate() {
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingCoupon(coupon);
    setForm(formFromCoupon(coupon));
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
  }

  function updateForm<K extends keyof CouponForm>(
    key: K,
    value: CouponForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateForm() {
    const code = form.code.trim().toUpperCase();
    const value = Number(form.discount_value);
    const minOrder = Number(form.min_order_amount || 0);

    const maxDiscount = form.max_discount_amount.trim()
      ? Number(form.max_discount_amount)
      : null;

    const usageLimit = form.usage_limit.trim()
      ? Number(form.usage_limit)
      : null;

    const perCustomerLimit = form.per_customer_limit.trim()
      ? Number(form.per_customer_limit)
      : null;

    if (!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(code)) {
      return "Coupon code must be 2-40 characters using letters, numbers, hyphen or underscore.";
    }

    if (!Number.isFinite(value) || value <= 0) {
      return "Enter a discount value greater than zero.";
    }

    if (form.discount_type === "PERCENTAGE" && value > 100) {
      return "Percentage discount cannot exceed 100%.";
    }

    if (!Number.isFinite(minOrder) || minOrder < 0) {
      return "Minimum order amount cannot be negative.";
    }

    if (
      maxDiscount !== null &&
      (!Number.isFinite(maxDiscount) || maxDiscount <= 0)
    ) {
      return "Maximum discount amount must be greater than zero.";
    }

    if (
      usageLimit !== null &&
      (!Number.isInteger(usageLimit) || usageLimit < 1)
    ) {
      return "Total usage limit must be a whole number of at least 1.";
    }

    if (
      perCustomerLimit !== null &&
      (!Number.isInteger(perCustomerLimit) || perCustomerLimit < 1)
    ) {
      return "Per-customer limit must be a whole number of at least 1.";
    }

    if (form.starts_at && form.expires_at) {
      const starts = new Date(form.starts_at).getTime();
      const expires = new Date(form.expires_at).getTime();

      if (
        !Number.isFinite(starts) ||
        !Number.isFinite(expires) ||
        expires <= starts
      ) {
        return "Expiry date/time must be later than the start date/time.";
      }
    }

    return null;
  }

  async function saveCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || null,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_amount: Number(form.min_order_amount || 0),
      max_discount_amount: form.max_discount_amount.trim()
        ? Number(form.max_discount_amount)
        : null,
      starts_at: form.starts_at
        ? new Date(form.starts_at).toISOString()
        : null,
      expires_at: form.expires_at
        ? new Date(form.expires_at).toISOString()
        : null,
      usage_limit: form.usage_limit.trim()
        ? Number(form.usage_limit)
        : null,
      per_customer_limit: form.per_customer_limit.trim()
        ? Number(form.per_customer_limit)
        : null,
      is_active: form.is_active,
      show_on_checkout: form.show_on_checkout,
    };

    try {
      const query = editingCoupon
        ? supabase
            .from("coupons")
            .update(payload)
            .eq("id", editingCoupon.id)
        : supabase.from("coupons").insert(payload);

      const { error: saveError } = await query;

      if (saveError) {
        throw new Error(
          saveError.code === "23505"
            ? "A coupon with this code already exists."
            : saveError.message
        );
      }

      setSuccess(
        editingCoupon
          ? "Coupon updated successfully."
          : "Coupon created successfully."
      );

      setModalOpen(false);
      setEditingCoupon(null);
      setForm(EMPTY_FORM);

      await loadCoupons(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save coupon."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateCouponField(
    coupon: Coupon,
    field: "is_active" | "show_on_checkout",
    value: boolean
  ) {
    if (updatingCouponIds.has(coupon.id)) return;

    setUpdatingCouponIds((current) => {
      const next = new Set(current);
      next.add(coupon.id);
      return next;
    });

    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from("coupons")
        .update({ [field]: value })
        .eq("id", coupon.id);

      if (updateError) throw updateError;

      setCoupons((current) =>
        current.map((item) =>
          item.id === coupon.id
            ? { ...item, [field]: value }
            : item
        )
      );

      setSuccess(
        field === "is_active"
          ? value
            ? `${coupon.code} has been activated.`
            : `${coupon.code} has been deactivated.`
          : value
            ? `${coupon.code} will be displayed on checkout.`
            : `${coupon.code} has been hidden from checkout.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update coupon."
      );
    } finally {
      setUpdatingCouponIds((current) => {
        const next = new Set(current);
        next.delete(coupon.id);
        return next;
      });
    }
  }

  async function toggleCoupon(coupon: Coupon) {
    await updateCouponField(coupon, "is_active", !coupon.is_active);
  }

  async function toggleCheckoutVisibility(coupon: Coupon) {
    await updateCouponField(
      coupon,
      "show_on_checkout",
      !coupon.show_on_checkout
    );
  }

  async function deleteCoupon() {
    if (!deleteTarget) return;

    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: deleteError } = await supabase
        .from("coupons")
        .delete()
        .eq("id", deleteTarget.id);

      if (deleteError) throw deleteError;

      setSuccess(`${deleteTarget.code} was deleted.`);
      setDeleteTarget(null);

      await loadCoupons(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete coupon."
      );
    } finally {
      setDeleting(false);
    }
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setSuccess(`${code} copied to clipboard.`);
      setError(null);
    } catch {
      setError("Unable to copy the coupon code.");
    }
  }

  return (
    <div className={`${bricolage.className} mx-auto -mt-15 w-full max-w-[1350px]`}>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--admin-primary-light)" }}
          >
            Offers and Discounts Management
          </p>

          <h1
            className="mt-1 text-[30px] font-bold"
            style={{ color: "var(--admin-text)" }}
          >
            Offers and Discounts Dashboard
          </h1>

          <p
            className="mt-1 max-w-2xl text-[13px]"
            style={{ color: "var(--admin-text-muted)" }}
          >
            Create and manage promotional codes and the conditions customers
            must satisfy before they can use them.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadCoupons(true)}
            disabled={refreshing}
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[11px] border px-4 text-[13px] font-semibold disabled:opacity-50"
            style={{
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-secondary)",
            }}
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[11px] px-5 text-[13px] font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: "var(--admin-primary)" }}
          >
            <Plus size={16} />
            Create Coupon
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {(error || success) && (
        <div
          role="status"
          className="mb-5 rounded-[12px] border px-4 py-3 text-[12px]"
          style={
            error
              ? {
                  borderColor: "rgba(248,113,113,0.25)",
                  backgroundColor: "rgba(248,113,113,0.08)",
                  color: "var(--admin-danger)",
                }
              : {
                  borderColor: "rgba(16,185,129,0.20)",
                  backgroundColor: "rgba(16,185,129,0.08)",
                  color: "#059669",
                }
          }
        >
          {error ?? success}
        </div>
      )}

      {/* STATISTICS */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total Codes", String(stats.total)],
          ["Active", String(stats.active)],
          ["Scheduled", String(stats.scheduled)],
          ["Successful Uses", String(stats.used)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[16px] border p-4"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <p
              className="text-[11px]"
              style={{ color: "var(--admin-text-muted)" }}
            >
              {label}
            </p>

            <p
              className="mt-1 text-xl font-bold"
              style={{ color: "var(--admin-text)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div
        className="mb-5 rounded-[18px] border p-4"
        style={{
          backgroundColor: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
        }}
      >
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--admin-text-subtle)" }}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by coupon code or description..."
              className="h-11 w-full rounded-xl border pl-11 pr-4 text-sm outline-none"
              style={{
                backgroundColor: "var(--admin-bg)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            />
          </div>

          <div className="relative xl:w-60">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border px-4 pr-9 text-sm outline-none"
              style={{
                backgroundColor: "var(--admin-bg)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="EXPIRED">Expired</option>
              <option value="LIMIT REACHED">Limit Reached</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--admin-text-subtle)" }}
            />
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div
          className="flex min-h-[420px] items-center justify-center rounded-2xl border"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={23}
              className="animate-spin"
              style={{ color: "var(--admin-primary-light)" }}
            />

            <p
              className="text-sm"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Loading coupons...
            </p>
          </div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        /* EMPTY STATE */
        <div
          className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border px-6 text-center"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
          }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "rgba(89,33,199,0.10)",
              color: "var(--admin-primary-light)",
            }}
          >
            <Tag size={26} />
          </div>

          <h2
            className="mt-4 text-lg font-bold"
            style={{ color: "var(--admin-text)" }}
          >
            {coupons.length === 0 ? "No coupons yet" : "No coupons found"}
          </h2>

          <p
            className="mt-1 max-w-md text-sm"
            style={{ color: "var(--admin-text-muted)" }}
          >
            {coupons.length === 0
              ? "Create your first promotional code for the Adroiit Store."
              : "Try changing your search or status filter."}
          </p>

          {coupons.length === 0 && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--admin-primary)" }}
            >
              <Plus size={15} />
              Create Coupon
            </button>
          )}
        </div>
      ) : (
        <>
          {/* =====================================================
              DESKTOP TABLE
              Fixed layout: all columns fit available width.
          ====================================================== */}
          <div
            className="hidden overflow-hidden rounded-2xl border lg:block"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "13%" }} />
              </colgroup>

              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor: "var(--admin-border)",
                    backgroundColor: "var(--admin-surface-2)",
                  }}
                >
                  {[
                    "Coupon",
                    "Discount",
                    "Order Condition",
                    "Validity",
                    "Usage",
                    "Status",
                    "Checkout Visibility",
                    "Actions",
                  ].map((heading, index) => (
                    <th
                      key={heading}
                      className={`px-2 py-4 text-[10px] font-bold uppercase tracking-[0.04em] xl:px-3 ${
                        index >= 6 ? "text-center" : "text-left"
                      }`}
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredCoupons.map((coupon) => {
                  const status = couponState(coupon);
                  const isUpdating = updatingCouponIds.has(coupon.id);
                  const percent =
                    coupon.discount_type === "PERCENTAGE";

                  return (
                    <tr
                      key={coupon.id}
                      className="border-b last:border-b-0 transition-colors hover:bg-[var(--admin-surface-2)]"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      {/* COUPON */}
                      <td className="px-2 py-4 xl:px-3">
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-1">
                            <p
                              className="min-w-0 truncate font-mono text-[12px] font-bold"
                              style={{ color: "var(--admin-text)" }}
                              title={coupon.code}
                            >
                              {coupon.code}
                            </p>

                            <button
                              type="button"
                              onClick={() => void copyCode(coupon.code)}
                              title="Copy code"
                              aria-label={`Copy ${coupon.code}`}
                              className="shrink-0"
                              style={{ color: "var(--admin-text-subtle)" }}
                            >
                              <Copy size={12} />
                            </button>
                          </div>

                          <p
                            className="mt-1 line-clamp-2 break-words text-[10px] leading-4"
                            style={{ color: "var(--admin-text-muted)" }}
                            title={coupon.description || "No description"}
                          >
                            {coupon.description || "No description"}
                          </p>
                        </div>
                      </td>

                      {/* DISCOUNT */}
                      <td className="px-2 py-4 xl:px-3">
                        <p
                          className="text-[12px] font-bold"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {percent
                            ? `${coupon.discount_value}%`
                            : formatMoney(coupon.discount_value)}
                        </p>

                        <p
                          className="mt-1 text-[10px]"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          Off
                        </p>

                        {coupon.max_discount_amount !== null && (
                          <p
                            className="mt-1 break-words text-[10px]"
                            style={{ color: "var(--admin-text-muted)" }}
                          >
                            Cap {formatMoney(coupon.max_discount_amount)}
                          </p>
                        )}
                      </td>

                      {/* ORDER CONDITION */}
                      <td className="px-2 py-4 xl:px-3">
                        <p
                          className="break-words text-[11px]"
                          style={{ color: "var(--admin-text-secondary)" }}
                        >
                          {coupon.min_order_amount > 0
                            ? `Minimum ${formatMoney(coupon.min_order_amount)}`
                            : "No minimum"}
                        </p>

                        <p
                          className="mt-1 break-words text-[10px]"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          {coupon.per_customer_limit === null
                            ? "No customer limit"
                            : `${coupon.per_customer_limit} use${
                                coupon.per_customer_limit === 1 ? "" : "s"
                              } / customer`}
                        </p>
                      </td>

                      {/* VALIDITY */}
                      <td className="px-2 py-4 xl:px-3">
                        <p
                          className="text-[10px] leading-4"
                          style={{ color: "var(--admin-text-secondary)" }}
                        >
                          <Clock3
                            size={11}
                            className="mr-1 inline-block"
                          />
                          {formatDate(coupon.starts_at)}
                        </p>

                        <p
                          className="mt-1 break-words text-[10px] leading-4"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          Ends {formatDate(coupon.expires_at)}
                        </p>
                      </td>

                      {/* USAGE */}
                      <td className="px-2 py-4 xl:px-3">
                        <p
                          className="text-[12px] font-semibold tabular-nums"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {coupon.usage_count}
                          {coupon.usage_limit !== null
                            ? ` / ${coupon.usage_limit}`
                            : ""}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-2 py-4 xl:px-3">
                        <span
                          className="inline-block max-w-full whitespace-normal break-words rounded-full px-2 py-1 text-center text-[9px] font-bold leading-3"
                          style={statusStyle(status)}
                        >
                          {status}
                        </span>
                      </td>

                      {/* CHECKOUT VISIBILITY - CENTER ALIGNED */}
                      <td className="px-2 py-4 text-center xl:px-3">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <InlineToggle
                            checked={coupon.show_on_checkout}
                            disabled={isUpdating}
                            label={`Show ${coupon.code} on checkout`}
                            onChange={() =>
                              void toggleCheckoutVisibility(coupon)
                            }
                          />

                          <span
                            className="text-[10px] font-semibold"
                            style={{
                              color: coupon.show_on_checkout
                                ? "#059669"
                                : "var(--admin-text-muted)",
                            }}
                          >
                            {coupon.show_on_checkout ? "Visible" : "Hidden"}
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS - CENTER ALIGNED */}
                      <td className="px-2 py-4 text-center xl:px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => void toggleCoupon(coupon)}
                            disabled={isUpdating}
                            title={
                              coupon.is_active
                                ? "Deactivate coupon"
                                : "Activate coupon"
                            }
                            aria-label={
                              coupon.is_active
                                ? `Deactivate ${coupon.code}`
                                : `Activate ${coupon.code}`
                            }
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                            style={{
                              borderColor: coupon.is_active
                                ? "rgba(16,185,129,0.30)"
                                : "rgba(239,68,68,0.30)",
                              backgroundColor: coupon.is_active
                                ? "rgba(16,185,129,0.10)"
                                : "rgba(239,68,68,0.10)",
                              color: coupon.is_active
                                ? "#059669"
                                : "#dc2626",
                            }}
                          >
                            {isUpdating ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <Power size={13} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEdit(coupon)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
                            style={{
                              borderColor: "var(--admin-border)",
                              color: "var(--admin-text-secondary)",
                            }}
                            title="Edit coupon"
                            aria-label={`Edit ${coupon.code}`}
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(coupon)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
                            style={{
                              borderColor: "var(--admin-border)",
                              color: "var(--admin-danger)",
                            }}
                            title="Delete coupon"
                            aria-label={`Delete ${coupon.code}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =====================================================
              MOBILE CARDS
          ====================================================== */}
          <div className="space-y-3 lg:hidden">
            {filteredCoupons.map((coupon) => {
              const status = couponState(coupon);
              const isUpdating = updatingCouponIds.has(coupon.id);

              return (
                <div
                  key={coupon.id}
                  className="rounded-2xl border p-5"
                  style={{
                    backgroundColor: "var(--admin-surface)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className="font-mono text-sm font-bold"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {coupon.code}
                        </p>

                        <button
                          type="button"
                          onClick={() => void copyCode(coupon.code)}
                          title="Copy code"
                          aria-label={`Copy ${coupon.code}`}
                          style={{ color: "var(--admin-text-subtle)" }}
                        >
                          <Copy size={13} />
                        </button>
                      </div>

                      <p
                        className="mt-1 break-words text-xs"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        {coupon.description || "No description"}
                      </p>
                    </div>

                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={statusStyle(status)}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <InfoBox
                      label="Discount"
                      value={
                        coupon.discount_type === "PERCENTAGE"
                          ? `${coupon.discount_value}%`
                          : formatMoney(coupon.discount_value)
                      }
                    />

                    <InfoBox
                      label="Minimum"
                      value={
                        coupon.min_order_amount > 0
                          ? formatMoney(coupon.min_order_amount)
                          : "None"
                      }
                    />

                    <InfoBox
                      label="Uses"
                      value={`${coupon.usage_count}${
                        coupon.usage_limit !== null
                          ? ` / ${coupon.usage_limit}`
                          : ""
                      }`}
                    />

                    <InfoBox
                      label="Customer Limit"
                      value={
                        coupon.per_customer_limit === null
                          ? "None"
                          : String(coupon.per_customer_limit)
                      }
                    />
                  </div>

                  {/* CHECKOUT VISIBILITY */}
                  <div
                    className="mt-4 flex items-center justify-between rounded-xl border p-3"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-surface-2)",
                    }}
                  >
                    <div>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "var(--admin-text)" }}
                      >
                        Checkout Visibility
                      </p>

                      <p
                        className="mt-1 text-[11px]"
                        style={{
                          color: coupon.show_on_checkout
                            ? "#059669"
                            : "var(--admin-text-muted)",
                        }}
                      >
                        {coupon.show_on_checkout
                          ? "Displayed on checkout"
                          : "Hidden from checkout"}
                      </p>
                    </div>

                    <InlineToggle
                      checked={coupon.show_on_checkout}
                      disabled={isUpdating}
                      label={`Show ${coupon.code} on checkout`}
                      onChange={() =>
                        void toggleCheckoutVisibility(coupon)
                      }
                    />
                  </div>

                  {/* VALIDITY */}
                  <div
                    className="mt-4 border-t pt-4"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Validity
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--admin-text-secondary)" }}
                    >
                      {formatDate(coupon.starts_at)}
                    </p>

                    <p
                      className="mt-1 text-[11px]"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Ends {formatDate(coupon.expires_at)}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div
                    className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <button
                      type="button"
                      onClick={() => void toggleCoupon(coupon)}
                      disabled={isUpdating}
                      title={
                        coupon.is_active
                          ? "Deactivate coupon"
                          : "Activate coupon"
                      }
                      aria-label={
                        coupon.is_active
                          ? `Deactivate ${coupon.code}`
                          : `Activate ${coupon.code}`
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border disabled:opacity-40"
                      style={{
                        borderColor: coupon.is_active
                          ? "rgba(16,185,129,0.30)"
                          : "rgba(239,68,68,0.30)",
                        backgroundColor: coupon.is_active
                          ? "rgba(16,185,129,0.10)"
                          : "rgba(239,68,68,0.10)",
                        color: coupon.is_active ? "#059669" : "#dc2626",
                      }}
                    >
                      {isUpdating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Power size={16} />
                      )}
                    </button>

                    <span
                      className="mr-auto text-[11px] font-semibold"
                      style={{
                        color: coupon.is_active ? "#059669" : "#dc2626",
                      }}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>

                    <button
                      type="button"
                      onClick={() => openEdit(coupon)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border"
                      style={{
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text-secondary)",
                      }}
                      title="Edit coupon"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(coupon)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border"
                      style={{
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-danger)",
                      }}
                      title="Delete coupon"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* =========================================================
          CREATE / EDIT MODAL
      ========================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5">
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[22px] border"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 sm:px-6"
              style={{
                backgroundColor: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
              }}
            >
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--admin-text)" }}
                >
                  {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                </h2>

                <p
                  className="mt-0.5 text-[12px]"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Configure the exact conditions under which the promo code
                  can be used.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveCoupon} className="p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Coupon Code" hint="Example: WELCOME10">
                  <div className="flex gap-2">
                    <input
                      value={form.code}
                      onChange={(event) =>
                        updateForm("code", event.target.value.toUpperCase())
                      }
                      disabled={Boolean(editingCoupon)}
                      placeholder="WELCOME10"
                      required
                      maxLength={40}
                      className="h-11 w-full rounded-xl border px-3 text-sm font-mono uppercase outline-none disabled:opacity-60"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />

                    {!editingCoupon && (
                      <button
                        type="button"
                        onClick={() => updateForm("code", generateCode())}
                        className="h-11 shrink-0 rounded-xl border px-3 text-xs font-semibold"
                        style={{
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text-secondary)",
                        }}
                      >
                        Generate
                      </button>
                    )}
                  </div>
                </Field>

                <Field label="Description">
                  <input
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    placeholder="10% off for new customers"
                    className="h-11 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field label="Discount Type">
                  <div className="relative">
                    <select
                      value={form.discount_type}
                      onChange={(event) =>
                        updateForm(
                          "discount_type",
                          event.target.value as DiscountType
                        )
                      }
                      className="h-11 w-full appearance-none rounded-xl border px-3 pr-9 text-sm outline-none"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₹)</option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--admin-text-subtle)" }}
                    />
                  </div>
                </Field>

                <Field
                  label={
                    form.discount_type === "PERCENTAGE"
                      ? "Discount Percentage"
                      : "Discount Amount"
                  }
                >
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max={
                        form.discount_type === "PERCENTAGE"
                          ? "100"
                          : undefined
                      }
                      value={form.discount_value}
                      onChange={(event) =>
                        updateForm("discount_value", event.target.value)
                      }
                      placeholder={
                        form.discount_type === "PERCENTAGE" ? "10" : "100"
                      }
                      required
                      className="h-11 w-full rounded-xl border px-3 pr-10 text-sm outline-none"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />

                    <span
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {form.discount_type === "PERCENTAGE" ? "%" : "₹"}
                    </span>
                  </div>
                </Field>

                <Field
                  label="Minimum Order Amount"
                  hint="Leave 0 for no minimum"
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.min_order_amount}
                    onChange={(event) =>
                      updateForm("min_order_amount", event.target.value)
                    }
                    required
                    className="h-11 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field
                  label="Maximum Discount"
                  hint="Useful for percentage coupons"
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.max_discount_amount}
                    onChange={(event) =>
                      updateForm("max_discount_amount", event.target.value)
                    }
                    placeholder="No cap"
                    className="h-11 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field label="Starts At" hint="Optional">
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(event) =>
                      updateForm("starts_at", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field label="Expires At" hint="Optional">
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(event) =>
                      updateForm("expires_at", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field label="Total Usage Limit" hint="Blank = unlimited">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.usage_limit}
                    onChange={(event) =>
                      updateForm("usage_limit", event.target.value)
                    }
                    placeholder="Unlimited"
                    className="h-11 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field label="Per-Customer Limit" hint="Blank = unlimited">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.per_customer_limit}
                    onChange={(event) =>
                      updateForm("per_customer_limit", event.target.value)
                    }
                    placeholder="Unlimited"
                    className="h-11 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </Field>
              </div>

              {/* INDEPENDENT SETTINGS */}
              <div
                className="mt-5 space-y-4 rounded-2xl border p-4"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                }}
              >
                <ToggleSetting
                  title="Coupon Active"
                  description="Controls whether customers can apply this coupon. Deactivating a coupon prevents it from being used, regardless of its checkout visibility."
                  checked={form.is_active}
                  onChange={(checked) => updateForm("is_active", checked)}
                />

                <div
                  className="border-t"
                  style={{ borderColor: "var(--admin-border)" }}
                />

                <ToggleSetting
                  title="Display on Checkout"
                  description="Controls whether this coupon appears in the checkout page's available coupon list. The coupon must also be active and valid to be used."
                  checked={form.show_on_checkout}
                  onChange={(checked) =>
                    updateForm("show_on_checkout", checked)
                  }
                />
              </div>

              {/* FORM ACTIONS */}
              <div
                className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="h-11 rounded-xl border px-5 text-sm font-semibold disabled:opacity-50"
                  style={{
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: "var(--admin-primary)" }}
                >
                  {saving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Check size={15} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingCoupon
                      ? "Save Changes"
                      : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION
      ========================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-[20px] border p-6"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "rgba(248,113,113,0.10)",
                color: "var(--admin-danger)",
              }}
            >
              <Trash2 size={19} />
            </div>

            <h2 className="mt-5 text-lg font-bold">Delete Coupon?</h2>

            <p
              className="mt-2 text-sm leading-6"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Delete{" "}
              <strong style={{ color: "var(--admin-text)" }}>
                {deleteTarget.code}
              </strong>
              ? Existing paid orders keep their recorded coupon information.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="h-11 rounded-xl border px-5 text-sm font-semibold disabled:opacity-50"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void deleteCoupon()}
                disabled={deleting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: "var(--admin-danger)" }}
              >
                {deleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}

                {deleting ? "Deleting..." : "Delete Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   REUSABLE CHECKOUT VISIBILITY SWITCH
============================================================ */

function InlineToggle({
  checked,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-[#5921c7]" : "bg-zinc-400"
      }`}
      style={{
        outlineColor: "var(--admin-primary)",
      }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ============================================================
   MODAL TOGGLE SETTING
============================================================ */

function ToggleSetting({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--admin-text)" }}
        >
          {title}
        </p>

        <p
          className="mt-1 max-w-xl text-xs leading-5"
          style={{ color: "var(--admin-text-muted)" }}
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          checked ? "bg-[#5921c7]" : "bg-zinc-400"
        }`}
        style={{
          outlineColor: "var(--admin-primary)",
        }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ============================================================
   INFORMATION BOX
============================================================ */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{
        backgroundColor: "var(--admin-surface-2)",
        borderColor: "var(--admin-border)",
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.08em]"
        style={{ color: "var(--admin-text-muted)" }}
      >
        {label}
      </p>

      <p
        className="mt-1 break-words text-sm font-semibold"
        style={{ color: "var(--admin-text)" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   FORM FIELD
============================================================ */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label
          className="text-xs font-semibold"
          style={{ color: "var(--admin-text-secondary)" }}
        >
          {label}
        </label>

        {hint && (
          <span
            className="text-[10px]"
            style={{ color: "var(--admin-text-subtle)" }}
          >
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

/* ============================================================
   COUPON CODE GENERATOR
============================================================ */

function generateCode() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ADRO${suffix}`;
}
