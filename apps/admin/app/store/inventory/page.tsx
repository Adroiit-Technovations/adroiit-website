"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Boxes,
  Check,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Product = {
  id: string;
  name: string;
  sku: string | null;
  category_id: string | null;
  price: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  updated_at: string;
};

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

type InventoryMovement = {
  id: string;
  product_id: string;
  movement_type:
    | "STOCK_IN"
    | "STOCK_OUT"
    | "ADJUSTMENT";
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  notes: string | null;
  created_at: string;
};

type StockStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

type MovementType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "ADJUSTMENT";

type StockFilter = "ALL" | StockStatus;

type SortOption =
  | "NAME_ASC"
  | "NAME_DESC"
  | "STOCK_LOW"
  | "STOCK_HIGH"
  | "VALUE_HIGH"
  | "VALUE_LOW"
  | "UPDATED";

// ============================================================
// HELPERS
// ============================================================

function formatMoney(
  value: number | null | undefined
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStockStatus(
  stock: number,
  threshold: number
): StockStatus {
  if (stock <= 0) {
    return "OUT_OF_STOCK";
  }

  if (stock <= threshold) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

function getStockStatusLabel(
  status: StockStatus
) {
  switch (status) {
    case "OUT_OF_STOCK":
      return "Out of Stock";

    case "LOW_STOCK":
      return "Low Stock";

    default:
      return "In Stock";
  }
}

function getStockStatusColor(
  status: StockStatus
) {
  switch (status) {
    case "OUT_OF_STOCK":
      return "var(--admin-danger)";

    case "LOW_STOCK":
      return "var(--admin-warning)";

    default:
      return "var(--admin-success)";
  }
}

function getStockStatusStyle(
  status: StockStatus
) {
  switch (status) {
    case "OUT_OF_STOCK":
      return {
        background: "rgba(248,113,113,0.08)",
        border: "rgba(248,113,113,0.18)",
        color: "var(--admin-danger)",
      };

    case "LOW_STOCK":
      return {
        background: "rgba(250,204,21,0.08)",
        border: "rgba(250,204,21,0.18)",
        color: "var(--admin-warning)",
      };

    default:
      return {
        background: "rgba(52,211,153,0.08)",
        border: "rgba(52,211,153,0.18)",
        color: "var(--admin-success)",
      };
  }
}

function getMovementLabel(
  type: MovementType
) {
  switch (type) {
    case "STOCK_IN":
      return "Stock In";

    case "STOCK_OUT":
      return "Stock Out";

    default:
      return "Adjustment";
  }
}

function getMovementStyle(
  type: MovementType
) {
  switch (type) {
    case "STOCK_IN":
      return {
        background: "rgba(52,211,153,0.08)",
        border: "rgba(52,211,153,0.18)",
        color: "var(--admin-success)",
      };

    case "STOCK_OUT":
      return {
        background: "rgba(248,113,113,0.08)",
        border: "rgba(248,113,113,0.18)",
        color: "var(--admin-danger)",
      };

    default:
      return {
        background: "rgba(140,82,255,0.08)",
        border: "rgba(140,82,255,0.18)",
        color: "var(--admin-primary-light)",
      };
  }
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "PR";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    (parts[0]?.[0] || "") +
    (parts[parts.length - 1]?.[0] || "")
  ).toUpperCase();
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function SelectField({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full appearance-none rounded-xl border px-4 pr-10 text-sm outline-none"
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
        style={{
          color: "var(--admin-text-muted)",
        }}
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
      className="rounded-2xl border px-4 py-4"
      style={{
        backgroundColor: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      <span
        className="truncate text-sm font-medium"
        style={{
          color: "var(--admin-text-secondary)",
        }}
      >
        {title}
      </span>

      <p
        className="mt-2 text-2xl font-bold tracking-tight"
        style={{
          color: "var(--admin-text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function StockStatusDot({
  status,
}: {
  status: StockStatus;
}) {
  const color = getStockStatusColor(status);

  return (
    <span
      className="inline-flex items-center"
      title={getStockStatusLabel(status)}
      aria-label={getStockStatusLabel(status)}
    >
      <span
        className="h-3 w-3 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />
    </span>
  );
}

function StockStatusBadge({
  status,
}: {
  status: StockStatus;
}) {
  const style = getStockStatusStyle(status);

  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        backgroundColor: style.background,
        borderColor: style.border,
        color: style.color,
      }}
    >
      {getStockStatusLabel(status)}
    </span>
  );
}

function MovementBadge({
  type,
}: {
  type: MovementType;
}) {
  const style = getMovementStyle(type);

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        backgroundColor: style.background,
        borderColor: style.border,
        color: style.color,
      }}
    >
      {type === "STOCK_IN" ? (
        <ArrowDown size={12} />
      ) : type === "STOCK_OUT" ? (
        <ArrowUp size={12} />
      ) : (
        <ArrowUpDown size={12} />
      )}

      {getMovementLabel(type)}
    </span>
  );
}

function ActivityProduct({
  product,
  imageUrl,
}: {
  product: Product | null;
  imageUrl: string | undefined;
}) {
  const productName = product?.name || "Deleted Product";

  return (
    <div className="flex min-w-[280px] items-center gap-3">
      <div
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border"
        style={{
          backgroundColor: "var(--admin-surface-2)",
          borderColor: "var(--admin-border)",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-xs font-bold"
            style={{
              color: "var(--admin-primary-light)",
            }}
          >
            {getInitials(productName)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          {productName}
        </p>

        <p
          className="mt-0.5 truncate text-xs"
          style={{
            color: "var(--admin-text-muted)",
          }}
        >
          {product?.sku
            ? `SKU: ${product.sku}`
            : "No SKU"}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// INVENTORY PAGE
// ============================================================

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("NAME_ASC");

  const [movementProductId, setMovementProductId] = useState<string | null>(null);
  const [movementType, setMovementType] = useState<MovementType>("STOCK_IN");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [movementNotes, setMovementNotes] = useState("");

  const [savingMovement, setSavingMovement] = useState(false);
  const [deletingMovementId, setDeletingMovementId] = useState<string | null>(null);

  const [showHistory, setShowHistory] = useState(true);
  const [viewActivity, setViewActivity] = useState<InventoryMovement | null>(null);

  // ============================================================
  // LOAD INVENTORY
  // ============================================================

  const loadInventory = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [
          productsResult,
          categoriesResult,
          imagesResult,
          movementsResult,
        ] = await Promise.all([
          supabase
            .from("products")
            .select(`
              id,
              name,
              sku,
              category_id,
              price,
              cost_price,
              stock_quantity,
              low_stock_threshold,
              is_active,
              updated_at
            `)
            .order("name", {
              ascending: true,
            }),

          supabase
            .from("categories")
            .select(`
              id,
              name
            `)
            .order("sort_order", {
              ascending: true,
            }),

          supabase
            .from("product_images")
            .select(`
              id,
              product_id,
              image_url,
              sort_order
            `)
            .order("sort_order", {
              ascending: true,
            }),

          supabase
            .from("inventory_movements")
            .select(`
              id,
              product_id,
              movement_type,
              quantity,
              previous_quantity,
              new_quantity,
              notes,
              created_at
            `)
            .order("created_at", {
              ascending: false,
            })
            .limit(15),
        ]);

        if (productsResult.error) {
          throw new Error(productsResult.error.message);
        }

        if (categoriesResult.error) {
          throw new Error(categoriesResult.error.message);
        }

        if (imagesResult.error) {
          throw new Error(imagesResult.error.message);
        }

        if (movementsResult.error) {
          throw new Error(movementsResult.error.message);
        }

        setProducts(
          (productsResult.data || []).map((product) => ({
            ...product,
            price: Number(product.price || 0),
            cost_price: Number(product.cost_price || 0),
            stock_quantity: Number(product.stock_quantity || 0),
            low_stock_threshold: Number(product.low_stock_threshold || 0),
          }))
        );

        setCategories(categoriesResult.data || []);
        setProductImages(imagesResult.data || []);

        setMovements(
          (movementsResult.data || []).map((movement) => ({
            ...movement,
            movement_type: movement.movement_type as MovementType,
            quantity: Number(movement.quantity || 0),
            previous_quantity: Number(movement.previous_quantity || 0),
            new_quantity: Number(movement.new_quantity || 0),
          }))
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load inventory."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  // ============================================================
  // DERIVED DATA
  // ============================================================

  const categoryMap = useMemo(() => {
    return new Map(
      categories.map((category) => [
        category.id,
        category.name,
      ])
    );
  }, [categories]);

  const imageMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const image of productImages) {
      if (!map.has(image.product_id)) {
        map.set(image.product_id, image.image_url);
      }
    }

    return map;
  }, [productImages]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const status = getStockStatus(
        product.stock_quantity,
        product.low_stock_threshold
      );

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.sku || "").toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category_id === categoryFilter;

      const matchesStock =
        stockFilter === "ALL" ||
        status === stockFilter;

      return matchesSearch && matchesCategory && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      const aValue = a.stock_quantity * a.cost_price;
      const bValue = b.stock_quantity * b.cost_price;

      switch (sortOption) {
        case "NAME_DESC":
          return b.name.localeCompare(a.name);

        case "STOCK_LOW":
          return a.stock_quantity - b.stock_quantity;

        case "STOCK_HIGH":
          return b.stock_quantity - a.stock_quantity;

        case "VALUE_HIGH":
          return bValue - aValue;

        case "VALUE_LOW":
          return aValue - bValue;

        case "UPDATED":
          return (
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
          );

        case "NAME_ASC":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [
    categoryFilter,
    products,
    search,
    sortOption,
    stockFilter,
  ]);

  // ============================================================
  // INVENTORY STATISTICS
  // ============================================================

  const stats = useMemo(() => {
    const totalUnits = products.reduce(
      (sum, product) =>
        sum + product.stock_quantity,
      0
    );

    // Cost value of all available stock.
    const inventoryValue = products.reduce(
      (sum, product) =>
        sum +
        product.stock_quantity * product.cost_price,
      0
    );

    // Retail value of all available stock.
    const retailInventoryValue = products.reduce(
      (sum, product) =>
        sum +
        product.stock_quantity * product.price,
      0
    );

    const lowStock = products.filter(
      (product) =>
        getStockStatus(
          product.stock_quantity,
          product.low_stock_threshold
        ) === "LOW_STOCK"
    ).length;

    const outOfStock = products.filter(
      (product) =>
        getStockStatus(
          product.stock_quantity,
          product.low_stock_threshold
        ) === "OUT_OF_STOCK"
    ).length;

    return {
      totalCategories: categories.length,
      totalProducts: products.length,
      totalUnits,
      inventoryValue,
      retailInventoryValue,
      lowStock,
      outOfStock,
    };
  }, [categories, products]);

  // ============================================================
  // MOVEMENT MODAL DATA
  // ============================================================

  const movementProduct = movementProductId
    ? products.find(
        (product) => product.id === movementProductId
      ) || null
    : null;

  const viewedActivityProduct = viewActivity
    ? products.find(
        (product) => product.id === viewActivity.product_id
      ) || null
    : null;

  const viewedActivityImage = viewActivity
    ? imageMap.get(viewActivity.product_id)
    : undefined;

  const movementResultStock = useMemo(() => {
    if (!movementProduct) return 0;

    const current = movementProduct.stock_quantity;

    if (movementType === "STOCK_IN") {
      const quantity = Number(movementQuantity) || 0;
      return current + quantity;
    }

    if (movementType === "STOCK_OUT") {
      const quantity = Number(movementQuantity) || 0;
      return current - quantity;
    }

    return Number(adjustmentQuantity) || 0;
  }, [
    adjustmentQuantity,
    movementProduct,
    movementQuantity,
    movementType,
  ]);

  // ============================================================
  // STOCK MOVEMENT HANDLERS
  // ============================================================

  function openEditMovement(product: Product) {
    openMovement(product, "ADJUSTMENT");
  }

  function openMovement(
    product: Product,
    type: MovementType
  ) {
    setMovementProductId(product.id);
    setMovementType(type);
    setMovementQuantity("");
    setAdjustmentQuantity(String(product.stock_quantity));
    setMovementNotes("");
    setError("");
  }

  function closeMovement() {
    if (savingMovement) return;

    setMovementProductId(null);
    setMovementQuantity("");
    setAdjustmentQuantity("");
    setMovementNotes("");
  }

  async function saveMovement() {
    if (!movementProduct) return;

    try {
      setSavingMovement(true);
      setError("");

      const {
        data: currentProduct,
        error: productError,
      } = await supabase
        .from("products")
        .select(`
          id,
          stock_quantity
        `)
        .eq("id", movementProduct.id)
        .single();

      if (productError) {
        throw new Error(productError.message);
      }

      if (!currentProduct) {
        throw new Error("Product could not be found.");
      }

      const previousQuantity = Number(
        currentProduct.stock_quantity || 0
      );

      let newQuantity = previousQuantity;
      let movementAmount = 0;

      if (movementType === "STOCK_IN") {
        const quantity = Number(movementQuantity);

        if (
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isInteger(quantity)
        ) {
          throw new Error(
            "Enter a valid stock-in quantity."
          );
        }

        movementAmount = quantity;
        newQuantity = previousQuantity + quantity;
      }

      if (movementType === "STOCK_OUT") {
        const quantity = Number(movementQuantity);

        if (
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isInteger(quantity)
        ) {
          throw new Error(
            "Enter a valid stock-out quantity."
          );
        }

        if (quantity > previousQuantity) {
          throw new Error(
            "Stock out quantity cannot exceed current stock."
          );
        }

        movementAmount = quantity;
        newQuantity = previousQuantity - quantity;
      }

      if (movementType === "ADJUSTMENT") {
        const targetQuantity = Number(adjustmentQuantity);

        if (
          !Number.isFinite(targetQuantity) ||
          targetQuantity < 0 ||
          !Number.isInteger(targetQuantity)
        ) {
          throw new Error(
            "Enter a valid adjustment quantity."
          );
        }

        newQuantity = targetQuantity;

        movementAmount = Math.abs(
          newQuantity - previousQuantity
        );
      }

      if (
        newQuantity === previousQuantity &&
        movementType === "ADJUSTMENT"
      ) {
        throw new Error(
          "The adjusted quantity is the same as the current stock."
        );
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", movementProduct.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const { error: movementError } = await supabase
        .from("inventory_movements")
        .insert({
          product_id: movementProduct.id,
          movement_type: movementType,
          quantity: movementAmount,
          previous_quantity: previousQuantity,
          new_quantity: newQuantity,
          notes: movementNotes.trim() || null,
        });

      if (movementError) {
        await supabase
          .from("products")
          .update({
            stock_quantity: previousQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", movementProduct.id);

        throw new Error(movementError.message);
      }

      setProducts((current) =>
        current.map((product) =>
          product.id === movementProduct.id
            ? {
                ...product,
                stock_quantity: newQuantity,
                updated_at: new Date().toISOString(),
              }
            : product
        )
      );

      closeMovement();

      await loadInventory(true);
    } catch (movementError) {
      setError(
        movementError instanceof Error
          ? movementError.message
          : "Unable to update stock."
      );
    } finally {
      setSavingMovement(false);
    }
  }

  // ============================================================
  // DELETE INVENTORY ACTIVITY
  // ============================================================

  async function deleteActivity(
    movement: InventoryMovement
  ) {
    if (deletingMovementId || savingMovement) {
      return;
    }

    const product = products.find(
      (item) => item.id === movement.product_id
    );

    const confirmed = window.confirm(
      `Delete this ${getMovementLabel(
        movement.movement_type
      ).toLowerCase()} activity${
        product ? ` for "${product.name}"` : ""
      }?\n\nThis will remove only the activity record and will not change the current stock.`
    );

    if (!confirmed) return;

    try {
      setDeletingMovementId(movement.id);
      setError("");

      const { error: deleteError } = await supabase
        .from("inventory_movements")
        .delete()
        .eq("id", movement.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setMovements((current) =>
        current.filter((item) => item.id !== movement.id)
      );

      if (viewActivity?.id === movement.id) {
        setViewActivity(null);
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete inventory activity."
      );
    } finally {
      setDeletingMovementId(null);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      className="mx-auto -mt-15 w-full max-w-[1350px]"
      style={{
        color: "var(--admin-text)",
      }}
    >
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-[0.18em]"
            style={{
              color: "var(--admin-primary-light)",
            }}
          >
            Inventory Management
          </p>

          <h1
            className="mt-2 text-3xl font-bold tracking-tight sm:text-3xl"
          >
            Inventory Dashboard
          </h1>

          <p
            className="mt-1.5 text-sm"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Track stock levels, inventory value and stock movements.
          </p>
        </div>

        {/* Purple Refresh Button */}
        <button
          type="button"
          onClick={() => void loadInventory(true)}
          disabled={refreshing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: "var(--admin-primary)",
            borderColor: "var(--admin-primary)",
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

      {/* Error */}
      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm"
          style={{
            backgroundColor: "rgba(248,113,113,0.06)",
            borderColor: "rgba(248,113,113,0.18)",
            color: "var(--admin-danger)",
          }}
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              Inventory action failed
            </p>

            <p className="mt-1 break-words opacity-90">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0"
            aria-label="Close error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatItem
          title="Total Categories"
          value={String(stats.totalCategories)}
        />

        <StatItem
          title="Total Products"
          value={String(stats.totalProducts)}
        />

        <StatItem
          title="Low Stock"
          value={String(stats.lowStock)}
        />

        <StatItem
          title="Out of Stock"
          value={String(stats.outOfStock)}
        />

        <StatItem
          title="Cost Inventory Value"
          value={formatMoney(stats.inventoryValue)}
        />

        <StatItem
          title="Retail Inventory Value"
          value={formatMoney(stats.retailInventoryValue)}
        />
      </div>

      {/* Filters */}
      <div
        className="mb-5 rounded-2xl border p-3 sm:p-4"
        style={{
          backgroundColor: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            style={{
              color: "var(--admin-primary-light)",
            }}
          />

          <span className="text-sm font-semibold">
            Inventory Filters
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px_210px]">
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
              placeholder="Search product name or SKU..."
              className="h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none"
              style={{
                backgroundColor: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            />
          </div>

          <SelectField
            value={categoryFilter}
            onChange={setCategoryFilter}
          >
            <option value="ALL">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={stockFilter}
            onChange={(value) =>
              setStockFilter(value as StockFilter)
            }
          >
            <option value="ALL">All Stock Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </SelectField>

          <SelectField
            value={sortOption}
            onChange={(value) =>
              setSortOption(value as SortOption)
            }
          >
            <option value="NAME_ASC">Product A–Z</option>
            <option value="NAME_DESC">Product Z–A</option>
            <option value="STOCK_LOW">Stock Low–High</option>
            <option value="STOCK_HIGH">Stock High–Low</option>
            <option value="VALUE_HIGH">Value High–Low</option>
            <option value="VALUE_LOW">Value Low–High</option>
            <option value="UPDATED">Recently Updated</option>
          </SelectField>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-sm"
          style={{
            color: "var(--admin-text-muted)",
          }}
        >
          Showing{" "}
          <span
            className="font-semibold"
            style={{
              color: "var(--admin-text)",
            }}
          >
            {filteredProducts.length}
          </span>{" "}
          product
          {filteredProducts.length === 1 ? "" : "s"}
        </p>

        {(search ||
          categoryFilter !== "ALL" ||
          stockFilter !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategoryFilter("ALL");
              setStockFilter("ALL");
            }}
            className="text-xs font-semibold"
            style={{
              color: "var(--admin-primary-light)",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Product inventory table */}
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
              Loading inventory...
            </p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border px-6 text-center"
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
            <Boxes size={25} />
          </div>

          <h2
            className="mt-4 text-lg font-bold"
            style={{
              color: "#8c52ff",
            }}
          >
            No inventory items found
          </h2>

          <p
            className="mt-1 max-w-md text-sm"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Try changing your search, category or stock filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div
            className="hidden overflow-hidden rounded-2xl border lg:block"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] border-collapse">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    {[
                      "Product",
                      "Category",
                      "Stock",
                      "Threshold",
                      "Cost Price",
                      "Inventory Value",
                      "Status",
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
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(
                      product.stock_quantity,
                      product.low_stock_threshold
                    );

                    const value =
                      product.stock_quantity * product.cost_price;

                    const imageUrl = imageMap.get(product.id);

                    const stockStatusColor =
                      getStockStatusColor(status);

                    return (
                      <tr
                        key={product.id}
                        className="border-b last:border-b-0"
                        style={{
                          borderColor: "var(--admin-border)",
                        }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl"
                              style={{
                                backgroundColor: "var(--admin-surface-2)",
                              }}
                            >
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              ) : (
                                <div
                                  className="flex h-full w-full items-center justify-center text-xs font-bold"
                                  style={{
                                    color: "var(--admin-primary-light)",
                                  }}
                                >
                                  {getInitials(product.name)}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[230px] truncate text-sm font-semibold">
                                {product.name}
                              </p>

                              <p
                                className="mt-0.5 text-xs"
                                style={{
                                  color: "var(--admin-text-muted)",
                                }}
                              >
                                SKU: {product.sku || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className="text-sm"
                            style={{
                              color: "var(--admin-text-secondary)",
                            }}
                          >
                            {product.category_id
                              ? categoryMap.get(product.category_id) ||
                                "Uncategorized"
                              : "Uncategorized"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className="text-sm font-bold"
                            style={{
                              color: stockStatusColor,
                            }}
                          >
                            {product.stock_quantity}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className="text-sm"
                            style={{
                              color: "var(--admin-text-secondary)",
                            }}
                          >
                            {product.low_stock_threshold}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold">
                            {formatMoney(product.cost_price)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-bold">
                            {formatMoney(value)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StockStatusDot status={status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                openEditMovement(product)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                              style={{
                                backgroundColor: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-text-secondary)",
                              }}
                              title="Edit stock"
                              aria-label={`Edit stock for ${product.name}`}
                            >
                              <Edit3 size={15} />
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

          {/* Mobile */}
          <div className="space-y-3 lg:hidden">
            {filteredProducts.map((product) => {
              const status = getStockStatus(
                product.stock_quantity,
                product.low_stock_threshold
              );

              const value =
                product.stock_quantity * product.cost_price;

              const imageUrl = imageMap.get(product.id);

              const stockStatusColor =
                getStockStatusColor(status);

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor: "var(--admin-surface)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                      }}
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center text-xs font-bold"
                          style={{
                            color: "var(--admin-primary-light)",
                          }}
                        >
                          {getInitials(product.name)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {product.name}
                          </p>

                          <p
                            className="mt-1 text-xs"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            {product.sku
                              ? `SKU: ${product.sku}`
                              : "No SKU"}
                          </p>
                        </div>

                        <StockStatusBadge status={status} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div
                      className="rounded-xl border px-3 py-3"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                      }}
                    >
                      <p
                        className="text-[11px]"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Stock
                      </p>

                      <p
                        className="mt-1 text-lg font-bold"
                        style={{
                          color: stockStatusColor,
                        }}
                      >
                        {product.stock_quantity}
                      </p>

                      <p
                        className="text-[11px]"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Threshold {product.low_stock_threshold}
                      </p>
                    </div>

                    <div
                      className="rounded-xl border px-3 py-3"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                      }}
                    >
                      <p
                        className="text-[11px]"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Inventory Value
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {formatMoney(value)}
                      </p>

                      <p
                        className="text-[11px]"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Cost {formatMoney(product.cost_price)}
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-3 flex items-center justify-end border-t pt-3"
                    style={{
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openEditMovement(product)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text-secondary)",
                      }}
                      title="Edit stock"
                      aria-label={`Edit stock for ${product.name}`}
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ========================================================
          MOVEMENT HISTORY
      ======================================================== */}

      <div className="mt-8">
        <button
          type="button"
          onClick={() =>
            setShowHistory((current) => !current)
          }
          className="mb-3 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <Clock3
              size={18}
              style={{
                color: "var(--admin-primary-light)",
              }}
            />

            <div>
              <p className="text-sm font-bold">
                Recent Inventory Activity
              </p>

              <p
                className="mt-0.5 text-xs"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                Latest stock movements and adjustments.
              </p>
            </div>
          </div>

          <ChevronDown
            size={18}
            className={
              showHistory
                ? "rotate-180 transition-transform"
                : "transition-transform"
            }
            style={{
              color: "var(--admin-text-muted)",
            }}
          />
        </button>

        {showHistory && (
          <div
            className="overflow-hidden rounded-2xl border"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            {movements.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p
                  className="text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  No inventory movements recorded yet.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Activity */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[1120px] border-collapse">
                    <thead>
                      <tr
                        className="border-b"
                        style={{
                          borderColor: "var(--admin-border)",
                        }}
                      >
                        {[
                          "Product",
                          "Movement",
                          "Quantity",
                          "Stock Change",
                          "Notes",
                          "Date",
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
                      {movements.map((movement) => {
                        const product = products.find(
                          (item) =>
                            item.id === movement.product_id
                        );

                        const imageUrl = imageMap.get(
                          movement.product_id
                        );

                        const isDeleting =
                          deletingMovementId === movement.id;

                        return (
                          <tr
                            key={movement.id}
                            className="border-b last:border-b-0"
                            style={{
                              borderColor: "var(--admin-border)",
                            }}
                          >
                            <td className="px-5 py-4">
                              <ActivityProduct
                                product={product || null}
                                imageUrl={imageUrl}
                              />
                            </td>

                            <td className="px-5 py-4">
                              <MovementBadge
                                type={movement.movement_type}
                              />
                            </td>

                            <td className="px-5 py-4">
                              <span className="whitespace-nowrap text-sm font-bold">
                                {movement.quantity}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className="whitespace-nowrap text-sm"
                                style={{
                                  color: "var(--admin-text-secondary)",
                                }}
                              >
                                {movement.previous_quantity} →{" "}
                                {movement.new_quantity}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className="block max-w-[300px] whitespace-normal break-words text-sm leading-5"
                                style={{
                                  color: "var(--admin-text-secondary)",
                                }}
                                title={movement.notes || undefined}
                              >
                                {movement.notes || "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className="whitespace-nowrap text-sm"
                                style={{
                                  color: "var(--admin-text-muted)",
                                }}
                              >
                                {formatDateTime(movement.created_at)}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setViewActivity(movement)
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                  style={{
                                    backgroundColor: "var(--admin-surface-2)",
                                    borderColor: "var(--admin-border)",
                                    color: "var(--admin-text-secondary)",
                                  }}
                                  title="View activity"
                                  aria-label={`View activity for ${
                                    product?.name || "product"
                                  }`}
                                >
                                  <Eye size={15} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void deleteActivity(movement)
                                  }
                                  disabled={
                                    !!deletingMovementId ||
                                    savingMovement
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                  style={{
                                    backgroundColor: "var(--admin-surface-2)",
                                    borderColor: "var(--admin-border)",
                                    color: "var(--admin-danger)",
                                  }}
                                  title="Delete activity"
                                  aria-label={`Delete activity for ${
                                    product?.name || "product"
                                  }`}
                                >
                                  {isDeleting ? (
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

                {/* Mobile Activity */}
                <div className="divide-y md:hidden">
                  {movements.map((movement) => {
                    const product = products.find(
                      (item) =>
                        item.id === movement.product_id
                    );

                    const imageUrl = imageMap.get(
                      movement.product_id
                    );

                    const isDeleting =
                      deletingMovementId === movement.id;

                    return (
                      <div
                        key={movement.id}
                        className="p-4"
                        style={{
                          borderColor: "var(--admin-border)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <ActivityProduct
                            product={product || null}
                            imageUrl={imageUrl}
                          />

                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setViewActivity(movement)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                              style={{
                                backgroundColor: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-text-secondary)",
                              }}
                              title="View activity"
                              aria-label="View activity"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void deleteActivity(movement)
                              }
                              disabled={
                                !!deletingMovementId ||
                                savingMovement
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                              style={{
                                backgroundColor: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-danger)",
                              }}
                              title="Delete activity"
                              aria-label="Delete activity"
                            >
                              {isDeleting ? (
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <MovementBadge
                            type={movement.movement_type}
                          />

                          <p
                            className="text-xs"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            {formatDateTime(movement.created_at)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <p
                              className="text-[11px]"
                              style={{
                                color: "var(--admin-text-muted)",
                              }}
                            >
                              Stock
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              {movement.previous_quantity} →{" "}
                              {movement.new_quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p
                              className="text-[11px]"
                              style={{
                                color: "var(--admin-text-muted)",
                              }}
                            >
                              Quantity
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              {movement.quantity}
                            </p>
                          </div>
                        </div>

                        {movement.notes && (
                          <p
                            className="mt-3 rounded-xl border px-3 py-2 text-xs leading-5"
                            style={{
                              backgroundColor: "var(--admin-surface-2)",
                              borderColor: "var(--admin-border)",
                              color: "var(--admin-text-secondary)",
                            }}
                          >
                            {movement.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          VIEW ACTIVITY MODAL
      ======================================================== */}

      {viewActivity && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewActivity(null);
            }
          }}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{
                borderColor: "var(--admin-border)",
              }}
            >
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#8c52ff",
                  }}
                >
                  Activity Details
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Inventory movement record
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewActivity(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
                aria-label="Close activity details"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-5">
              <div
                className="flex items-center gap-3 rounded-2xl border p-4"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                }}
              >
                <div
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border"
                  style={{
                    backgroundColor: "var(--admin-bg)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  {viewedActivityImage ? (
                    <Image
                      src={viewedActivityImage}
                      alt={viewedActivityProduct?.name || "Product"}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xs font-bold"
                      style={{
                        color: "var(--admin-primary-light)",
                      }}
                    >
                      {getInitials(
                        viewedActivityProduct?.name ||
                          "Deleted Product"
                      )}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {viewedActivityProduct?.name || "Deleted Product"}
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    {viewedActivityProduct?.sku
                      ? `SKU: ${viewedActivityProduct.sku}`
                      : "No SKU"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p
                  className="mb-2 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Movement
                </p>

                <MovementBadge
                  type={viewActivity.movement_type}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <p
                    className="text-[11px]"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Quantity
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {viewActivity.quantity}
                  </p>
                </div>

                <div
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <p
                    className="text-[11px]"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Date & Time
                  </p>

                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    {formatDateTime(viewActivity.created_at)}
                  </p>
                </div>
              </div>

              <div
                className="mt-3 rounded-2xl border p-4"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-[11px]"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Previous Stock
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {viewActivity.previous_quantity}
                    </p>
                  </div>

                  <ArrowUpDown
                    size={19}
                    style={{
                      color: "var(--admin-primary-light)",
                    }}
                  />

                  <div className="text-right">
                    <p
                      className="text-[11px]"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      New Stock
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {viewActivity.new_quantity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p
                  className="mb-2 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Notes
                </p>

                <div
                  className="rounded-2xl border px-4 py-3"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <p
                    className="whitespace-pre-wrap break-words text-sm leading-6"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    {viewActivity.notes ||
                      "No notes added for this activity."}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewActivity(null)}
                  className="h-10 rounded-xl border px-5 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STOCK MOVEMENT MODAL
      ======================================================== */}

      {movementProduct && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeMovement();
            }
          }}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{
                borderColor: "var(--admin-border)",
              }}
            >
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#8c52ff",
                  }}
                >
                  {movementType === "STOCK_IN"
                    ? "Add Stock"
                    : movementType === "STOCK_OUT"
                      ? "Stock Out"
                      : "Adjust Stock"}
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  {movementProduct.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeMovement}
                disabled={savingMovement}
                className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
                aria-label="Close stock editor"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-5">
              {/* Product summary */}
              <div
                className="rounded-2xl border p-4"
                style={{
                  backgroundColor: "var(--admin-surface-2)",
                  borderColor: "var(--admin-border)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Current Stock
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {movementProduct.stock_quantity}
                    </p>
                  </div>

                  <ArrowUpDown
                    size={20}
                    style={{
                      color: "var(--admin-primary-light)",
                    }}
                  />

                  <div className="text-right">
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      New Stock
                    </p>

                    <p
                      className="mt-1 text-2xl font-bold"
                      style={{
                        color:
                          movementResultStock < 0
                            ? "var(--admin-danger)"
                            : "var(--admin-primary-light)",
                      }}
                    >
                      {movementResultStock}
                    </p>
                  </div>
                </div>
              </div>

              {/* Movement type */}
              <div className="mt-5">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="movement-type"
                >
                  Movement Type
                </label>

                <div className="relative">
                  <select
                    id="movement-type"
                    value={movementType}
                    onChange={(event) => {
                      const nextType =
                        event.target.value as MovementType;

                      setMovementType(nextType);

                      if (nextType === "ADJUSTMENT") {
                        setAdjustmentQuantity(
                          String(movementProduct.stock_quantity)
                        );
                      }
                    }}
                    disabled={savingMovement}
                    className="h-11 w-full appearance-none rounded-xl border px-4 pr-10 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  >
                    <option value="STOCK_IN">Stock In</option>
                    <option value="STOCK_OUT">Stock Out</option>
                    <option value="ADJUSTMENT">Adjustment</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="movement-quantity"
                >
                  {movementType === "ADJUSTMENT"
                    ? "New Stock Quantity"
                    : "Quantity"}
                </label>

                <input
                  id="movement-quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={
                    movementType === "ADJUSTMENT"
                      ? adjustmentQuantity
                      : movementQuantity
                  }
                  onChange={(event) => {
                    if (movementType === "ADJUSTMENT") {
                      setAdjustmentQuantity(event.target.value);
                    } else {
                      setMovementQuantity(event.target.value);
                    }
                  }}
                  disabled={savingMovement}
                  placeholder={
                    movementType === "ADJUSTMENT"
                      ? "Enter new stock quantity"
                      : "Enter quantity"
                  }
                  className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                />
              </div>

              {/* Notes */}
              <div className="mt-4">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="movement-notes"
                >
                  Notes
                  <span
                    className="ml-1 text-xs font-normal"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Optional
                  </span>
                </label>

                <textarea
                  id="movement-notes"
                  value={movementNotes}
                  onChange={(event) =>
                    setMovementNotes(event.target.value)
                  }
                  disabled={savingMovement}
                  rows={3}
                  placeholder="Example: New supplier stock received"
                  className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                />
              </div>

              {/* Warning */}
              {movementResultStock < 0 && (
                <div
                  className="mt-4 flex gap-2 rounded-xl border px-3 py-3 text-xs"
                  style={{
                    backgroundColor: "rgba(248,113,113,0.06)",
                    borderColor: "rgba(248,113,113,0.18)",
                    color: "var(--admin-danger)",
                  }}
                >
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    The resulting stock cannot be negative.
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeMovement}
                  disabled={savingMovement}
                  className="h-11 rounded-xl border px-5 text-sm font-semibold disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void saveMovement()}
                  disabled={
                    savingMovement ||
                    movementResultStock < 0
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--admin-primary)",
                  }}
                >
                  {savingMovement ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={15} />

                      {movementType === "STOCK_IN"
                        ? "Add Stock"
                        : movementType === "STOCK_OUT"
                          ? "Stock Out"
                          : "Save Adjustment"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}