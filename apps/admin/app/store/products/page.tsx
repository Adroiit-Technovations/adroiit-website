"use client";

import Link from "next/link";
import {
  Archive,
  ChevronDown,
  Filter,
  GripVertical,
  IndianRupee,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShoppingBag,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import {
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  images?: ProductImage[];
};

type TopProduct = {
  id: string;
  name: string;
  sku: string | null;
  unitsSold: number;
  image: string | null;
};

type OrderItem = {
  product_id: string | null;
  product_name: string | null;
  quantity: number;
};

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

type SortOption =
  | "CUSTOM"
  | "NEWEST"
  | "OLDEST"
  | "NAME_ASC"
  | "NAME_DESC"
  | "PRICE_LOW"
  | "PRICE_HIGH"
  | "STOCK_LOW"
  | "STOCK_HIGH";

const supabase = createClient();

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function getInventoryValue(product: Product) {
  return product.stock_quantity * product.cost_price;
}

function getProductImage(product: Product) {
  return product.images?.[0]?.image_url ?? null;
}

function getStockAlert(product: Product) {
  return product.stock_quantity <= product.low_stock_threshold;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topProductsLoading, setTopProductsLoading] = useState(true);

  // Controls whether the complete sales ranking is displayed.
  const [showAllTopProducts, setShowAllTopProducts] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("CUSTOM");

  const [showFilters, setShowFilters] = useState(false);

  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [draggedProductId, setDraggedProductId] =
    useState<string | null>(null);

  const [dragOverProductId, setDragOverProductId] =
    useState<string | null>(null);

  const [savingOrder, setSavingOrder] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  // ============================================================
  // LOAD PRODUCTS, CATEGORIES, IMAGES AND SALES DATA
  // ============================================================

  const loadProducts = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setTopProductsLoading(true);

        const [
          productsResponse,
          categoriesResponse,
          imagesResponse,
          salesResponse,
        ] = await Promise.all([
          supabase
            .from("products")
            .select(`
              id,
              name,
              slug,
              sku,
              category_id,
              description,
              price,
              compare_at_price,
              cost_price,
              stock_quantity,
              low_stock_threshold,
              is_active,
              is_featured,
              sort_order,
              created_at,
              updated_at
            `)
            .order("sort_order", {
              ascending: true,
            })
            .order("created_at", {
              ascending: false,
            }),

          supabase
            .from("categories")
            .select(`
              id,
              name,
              slug,
              is_active
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
              alt_text,
              sort_order
            `)
            .order("sort_order", {
              ascending: true,
            }),

          // Only paid orders are included in product sales.
          // Cancelled and refunded orders are excluded.
          supabase
            .from("order_items")
            .select(`
              product_id,
              product_name,
              quantity,
              orders!inner (
                status,
                payment_status
              )
            `)
            .eq("orders.payment_status", "PAID")
            .not(
              "orders.status",
              "in",
              "(CANCELLED,REFUNDED)"
            ),
        ]);

        if (productsResponse.error) {
          throw new Error(productsResponse.error.message);
        }

        if (categoriesResponse.error) {
          throw new Error(categoriesResponse.error.message);
        }

        if (imagesResponse.error) {
          throw new Error(imagesResponse.error.message);
        }

        const categoryMap = new Map<string, Category>();

        (
          (categoriesResponse.data ?? []) as Category[]
        ).forEach((category) => {
          categoryMap.set(category.id, category);
        });

        const imageMap = new Map<string, ProductImage[]>();

        (
          (imagesResponse.data ?? []) as ProductImage[]
        ).forEach((image) => {
          const existing =
            imageMap.get(image.product_id) ?? [];

          existing.push(image);
          imageMap.set(image.product_id, existing);
        });

        const formattedProducts: Product[] = (
          productsResponse.data ?? []
        ).map((product, index) => {
          const typedProduct = product as Product;

          return {
            ...typedProduct,

            price: Number(typedProduct.price ?? 0),

            compare_at_price:
              typedProduct.compare_at_price === null
                ? null
                : Number(typedProduct.compare_at_price),

            cost_price: Number(
              typedProduct.cost_price ?? 0
            ),

            stock_quantity: Number(
              typedProduct.stock_quantity ?? 0
            ),

            low_stock_threshold: Number(
              typedProduct.low_stock_threshold ?? 0
            ),

            sort_order: Number(
              typedProduct.sort_order ?? index
            ),

            category: typedProduct.category_id
              ? categoryMap.get(
                  typedProduct.category_id
                ) ?? null
              : null,

            images:
              imageMap.get(typedProduct.id) ?? [],
          };
        });

        setProducts(formattedProducts);

        setCategories(
          (categoriesResponse.data ?? []) as Category[]
        );

        // ======================================================
        // CALCULATE ALL TOP PRODUCTS BY TOTAL UNITS SOLD
        // ======================================================

        if (salesResponse.error) {
          console.error(
            "Failed to load product sales:",
            salesResponse.error.message
          );

          setTopProducts([]);
        } else {
          const salesMap = new Map<
            string,
            {
              name: string;
              unitsSold: number;
            }
          >();

          const orderItems = (
            salesResponse.data ?? []
          ) as unknown as OrderItem[];

          orderItems.forEach((item) => {
            const productId =
              item.product_id ||
              `name:${(item.product_name ?? "unknown")
                .trim()
                .toLowerCase()}`;

            const quantity = Number(item.quantity ?? 0);

            if (quantity <= 0) {
              return;
            }

            const existing = salesMap.get(productId);

            if (existing) {
              existing.unitsSold += quantity;
            } else {
              salesMap.set(productId, {
                name: item.product_name ?? "Unknown Product",
                unitsSold: quantity,
              });
            }
          });

          const productMap = new Map(
            formattedProducts.map((product) => [
              product.id,
              product,
            ])
          );

          const rankedProducts: TopProduct[] = Array.from(
            salesMap.entries()
          )
            .map(([id, sales]) => {
              const product = productMap.get(id);

              return {
                id,
                name: product?.name ?? sales.name,
                sku: product?.sku ?? null,
                unitsSold: sales.unitsSold,
                image: product
                  ? getProductImage(product)
                  : null,
              };
            })
            .filter((product) => product.unitsSold > 0)
            .sort(
              (a, b) =>
                b.unitsSold - a.unitsSold ||
                a.name.localeCompare(b.name)
            );

          // Keep the complete ranking.
          // The UI controls how many rows are displayed.
          setTopProducts(rankedProducts);
        }

        setOrderChanged(false);
        setDraggedProductId(null);
        setDragOverProductId(null);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setTopProductsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // ============================================================
  // TOP PRODUCTS DISPLAY
  // ============================================================

  const displayedTopProducts = useMemo(() => {
    return showAllTopProducts
      ? topProducts
      : topProducts.slice(0, 10);
  }, [topProducts, showAllTopProducts]);

  // ============================================================
  // PRODUCT STATISTICS
  // ============================================================

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const activeProducts = products.filter(
      (product) => product.is_active
    ).length;

    const stockAlerts = products.filter(
      (product) => getStockAlert(product)
    ).length;

    const inventoryValue = products.reduce(
      (total, product) =>
        total + getInventoryValue(product),
      0
    );

    return {
      totalProducts,
      activeProducts,
      stockAlerts,
      inventoryValue,
    };
  }, [products]);

  // ============================================================
  // FILTER AND SORT PRODUCTS
  // ============================================================

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.category?.name
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          product.is_active) ||
        (statusFilter === "INACTIVE" &&
          !product.is_active);

      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category_id === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "CUSTOM":
          return a.sort_order - b.sort_order;

        case "OLDEST":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );

        case "NAME_ASC":
          return a.name.localeCompare(b.name);

        case "NAME_DESC":
          return b.name.localeCompare(a.name);

        case "PRICE_LOW":
          return a.price - b.price;

        case "PRICE_HIGH":
          return b.price - a.price;

        case "STOCK_LOW":
          return a.stock_quantity - b.stock_quantity;

        case "STOCK_HIGH":
          return b.stock_quantity - a.stock_quantity;

        case "NEWEST":
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });
  }, [
    products,
    searchQuery,
    statusFilter,
    categoryFilter,
    sortBy,
  ]);

  const canDragProducts =
    sortBy === "CUSTOM" &&
    searchQuery.trim() === "" &&
    statusFilter === "ALL" &&
    categoryFilter === "ALL";

  // ============================================================
  // DRAG AND DROP REORDERING
  // ============================================================

  const moveProduct = (
    draggedId: string,
    targetId: string
  ) => {
    if (
      !canDragProducts ||
      draggedId === targetId
    ) {
      return;
    }

    setProducts((current) => {
      const draggedIndex =
        current.findIndex(
          (product) => product.id === draggedId
        );

      const targetIndex =
        current.findIndex(
          (product) => product.id === targetId
        );

      if (
        draggedIndex === -1 ||
        targetIndex === -1
      ) {
        return current;
      }

      const reordered = [...current];

      const [draggedProduct] =
        reordered.splice(draggedIndex, 1);

      reordered.splice(
        targetIndex,
        0,
        draggedProduct
      );

      return reordered.map(
        (product, index) => ({
          ...product,
          sort_order: index,
        })
      );
    });

    setOrderChanged(true);
  };

  const handleDragStart = (
    event: DragEvent<HTMLTableRowElement>,
    productId: string
  ) => {
    if (!canDragProducts) {
      event.preventDefault();
      return;
    }

    setDraggedProductId(productId);

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
      "text/plain",
      productId
    );
  };

  const handleDragOver = (
    event: DragEvent<HTMLTableRowElement>,
    productId: string
  ) => {
    if (!canDragProducts) {
      return;
    }

    event.preventDefault();

    event.dataTransfer.dropEffect = "move";

    setDragOverProductId(productId);
  };

  const handleDrop = (
    event: DragEvent<HTMLTableRowElement>,
    targetId: string
  ) => {
    if (!canDragProducts) {
      return;
    }

    event.preventDefault();

    const draggedId =
      event.dataTransfer.getData("text/plain") ||
      draggedProductId;

    if (draggedId) {
      moveProduct(draggedId, targetId);
    }

    setDraggedProductId(null);
    setDragOverProductId(null);
  };

  const handleDragEnd = () => {
    setDraggedProductId(null);
    setDragOverProductId(null);
  };

  // ============================================================
  // SAVE PRODUCT ORDER
  // ============================================================

  const saveProductOrder = async () => {
    if (
      !canDragProducts ||
      !orderChanged ||
      savingOrder
    ) {
      return;
    }

    try {
      setSavingOrder(true);

      const updates = products.map(
        (product, index) => ({
          id: product.id,
          sort_order: index,
        })
      );

      for (const update of updates) {
        const { error } = await supabase
          .from("products")
          .update({
            sort_order: update.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", update.id);

        if (error) {
          throw new Error(error.message);
        }
      }

      setProducts((current) =>
        current.map(
          (product, index) => ({
            ...product,
            sort_order: index,
          })
        )
      );

      setOrderChanged(false);

      alert("Product order saved successfully.");
    } catch (error) {
      console.error(
        "Failed to save product order:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save product order."
      );
    } finally {
      setSavingOrder(false);
    }
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;

    try {
      setDeleting(true);

      const {
        data: images,
        error: imageFetchError,
      } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", deleteProduct.id);

      if (imageFetchError) {
        throw new Error(imageFetchError.message);
      }

      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProduct.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      if (images && images.length > 0) {
        const storagePaths: string[] = [];

        for (const image of images) {
          const imageUrl = image.image_url;

          const marker =
            "/storage/v1/object/public/product-images/";

          const markerIndex = imageUrl.indexOf(marker);

          if (markerIndex !== -1) {
            storagePaths.push(
              decodeURIComponent(
                imageUrl.slice(
                  markerIndex + marker.length
                )
              )
            );
          }
        }

        if (storagePaths.length > 0) {
          const { error: storageError } =
            await supabase.storage
              .from("product-images")
              .remove(storagePaths);

          if (storageError) {
            console.warn(
              "Product deleted, but some storage images could not be removed:",
              storageError.message
            );
          }
        }
      }

      setProducts((current) =>
        current
          .filter(
            (product) =>
              product.id !== deleteProduct.id
          )
          .map((product, index) => ({
            ...product,
            sort_order: index,
          }))
      );

      setDeleteProduct(null);
      setOrderChanged(true);

      void loadProducts(true);
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // FILTER UTILITIES
  // ============================================================

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setSortBy("CUSTOM");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    sortBy !== "CUSTOM";

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-15 w-full max-w-[1380px] min-w-0 px-2 pt-0 sm:px-4">

        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em]"
              style={{
                color: "var(--admin-primary-light)",
              }}
            >
              Products Management
            </p>

            <h1
              className="mt-2 text-3xl font-bold tracking-tight sm:text-3xl"
              style={{
                color: "var(--admin-text)",
              }}
            >
              Products Dashboard
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm leading-6"
              style={{
                color: "var(--admin-text-muted)",
              }}
            >
              Manage your product catalog, pricing,
              inventory and availability.
            </p>
          </div>

          <Link
            href="/store/products/create"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--admin-primary)",
              color: "#ffffff",
              boxShadow: "var(--admin-shadow-sm)",
            }}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        {/* ================================================== */}
        {/* STATS */}
        {/* ================================================== */}

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">

          {/* Total Products */}
          <div
            className="rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-primary) 10%, var(--admin-surface))",
                  color: "var(--admin-primary)",
                }}
              >
                <Package className="h-5 w-5" />
              </div>

              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--admin-text-secondary)",
                }}
              >
                Total Products
              </p>
            </div>

            <p
              className="mt-4 text-2xl font-bold tracking-tight"
              style={{
                color: "var(--admin-text)",
              }}
            >
              {stats.totalProducts}
            </p>
          </div>

          {/* Active Products */}
          <div
            className="rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-success) 10%, var(--admin-surface))",
                  color: "var(--admin-success)",
                }}
              >
                <Package className="h-5 w-5" />
              </div>

              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--admin-text-secondary)",
                }}
              >
                Active Products
              </p>
            </div>

            <p
              className="mt-4 text-2xl font-bold tracking-tight"
              style={{
                color: "var(--admin-text)",
              }}
            >
              {stats.activeProducts}
            </p>
          </div>

          {/* Stock Alerts */}
          <div
            className="rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-warning) 10%, var(--admin-surface))",
                  color: "var(--admin-warning)",
                }}
              >
                <Archive className="h-5 w-5" />
              </div>

              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--admin-text-secondary)",
                }}
              >
                Stock Alerts
              </p>
            </div>

            <p
              className="mt-4 text-2xl font-bold tracking-tight"
              style={{
                color:
                  stats.stockAlerts > 0
                    ? "var(--admin-warning)"
                    : "var(--admin-text)",
              }}
            >
              {stats.stockAlerts}
            </p>
          </div>

          {/* Inventory Value */}
          <div
            className="rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-primary) 10%, var(--admin-surface))",
                  color: "var(--admin-primary)",
                }}
              >
                <IndianRupee className="h-5 w-5" />
              </div>

              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--admin-text-secondary)",
                }}
              >
                Inventory Value
              </p>
            </div>

            <p
              className="mt-4 truncate text-2xl font-bold tracking-tight"
              style={{
                color: "var(--admin-text)",
              }}
            >
              {formatCurrency(stats.inventoryValue)}
            </p>
          </div>
        </div>

        {/* ================================================== */}
        {/* TOP PRODUCTS - MOST UNITS SOLD */}
        {/* ================================================== */}

        <section
          className="mt-6 overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
          }}
        >
          <div
            className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            style={{
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-warning) 12%, var(--admin-surface))",
                  color: "var(--admin-warning)",
                }}
              >
                <Trophy className="h-5 w-5" />
              </div>

              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: "var(--admin-text)",
                  }}
                >
                  Top Products
                </h2>

                <p
                  className="mt-0.5 text-xs sm:text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Best-selling products ranked by units sold
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!topProductsLoading && topProducts.length > 0 && (
                <span
                  className="text-xs font-medium"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  {showAllTopProducts
                    ? `Showing all ${topProducts.length} products`
                    : `Showing ${Math.min(10, topProducts.length)} of ${topProducts.length} products`}
                </span>
              )}
            </div>
          </div>

          {topProductsLoading ? (
            <div className="flex min-h-[150px] items-center justify-center gap-3">
              <RefreshCw
                className="h-5 w-5 animate-spin"
                style={{
                  color: "var(--admin-primary-light)",
                }}
              />

              <span
                className="text-sm"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                Loading sales data...
              </span>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex min-h-[160px] flex-col items-center justify-center px-6 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-primary) 10%, var(--admin-surface))",
                  color: "var(--admin-text-muted)",
                }}
              >
                <ShoppingBag className="h-5 w-5" />
              </div>

              <p
                className="mt-3 text-sm font-semibold"
                style={{
                  color: "var(--admin-text)",
                }}
              >
                No sales recorded yet
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                Best-selling products will appear here after
                successful paid orders.
              </p>
            </div>
          ) : (
            <>
              {/* Sales Ranking Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr
                      className="border-b"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                      }}
                    >
                      <th
                        className="w-20 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider sm:px-6"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Rank
                      </th>

                      <th
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Product
                      </th>

                      <th
                        className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider sm:px-6"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Units Sold
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedTopProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className="border-b transition-colors last:border-b-0 hover:bg-[var(--admin-surface-hover)]"
                        style={{
                          borderColor: "var(--admin-border)",
                        }}
                      >
                        {/* Ranking */}
                        <td className="px-5 py-3.5 sm:px-6">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                            style={{
                              backgroundColor:
                                index === 0
                                  ? "color-mix(in srgb, var(--admin-warning) 16%, var(--admin-surface))"
                                  : "var(--admin-surface-2)",
                              color:
                                index === 0
                                  ? "var(--admin-warning)"
                                  : "var(--admin-text-secondary)",
                            }}
                          >
                            {index + 1}
                          </div>
                        </td>

                        {/* Product Information */}
                        <td className="px-4 py-3.5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
                              style={{
                                backgroundColor: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                              }}
                            >
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package
                                  className="h-5 w-5"
                                  style={{
                                    color: "var(--admin-text-muted)",
                                  }}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="truncate text-sm font-semibold"
                                style={{
                                  color: "var(--admin-text)",
                                }}
                              >
                                {product.name}
                              </p>

                              {product.sku && (
                                <p
                                  className="mt-1 truncate text-xs"
                                  style={{
                                    color: "var(--admin-text-muted)",
                                  }}
                                >
                                  SKU: {product.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Units Sold */}
                        <td className="px-5 py-3.5 text-right sm:px-6">
                          <span
                            className="text-base font-bold tabular-nums"
                            style={{
                              color: "var(--admin-primary-light)",
                            }}
                          >
                            {product.unitsSold.toLocaleString("en-IN")}
                          </span>

                          <span
                            className="ml-1.5 text-[11px] font-medium uppercase tracking-wider"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            units
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expand / Collapse Ranking */}
              {topProducts.length > 10 && (
                <div
                  className="flex items-center justify-center border-t px-5 py-4"
                  style={{
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllTopProducts((current) => !current)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--admin-surface-hover)]"
                    style={{
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-primary-light)",
                    }}
                  >
                    {showAllTopProducts
                      ? "Show Top 10"
                      : `View All ${topProducts.length} Products`}

                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        showAllTopProducts ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ================================================== */}
        {/* TOOLBAR */}
        {/* ================================================== */}

        <div
          className="mt-6 rounded-2xl border p-4"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
          }}
        >
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search products or SKU..."
                className="h-11 w-full rounded-xl border bg-transparent pl-10 pr-4 text-sm outline-none transition"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text)",
                }}
              />
            </div>

            <div className="hidden items-center gap-3 xl:flex">

              {/* Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as StatusFilter
                    )
                  }
                  className="h-11 appearance-none rounded-xl border bg-transparent pl-4 pr-10 text-sm outline-none"
                  style={{
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                />
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="h-11 max-w-[190px] appearance-none rounded-xl border bg-transparent pl-4 pr-10 text-sm outline-none"
                  style={{
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
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
                </select>

                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value as SortOption
                    )
                  }
                  className="h-11 appearance-none rounded-xl border bg-transparent pl-4 pr-10 text-sm outline-none"
                  style={{
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                >
                  <option value="CUSTOM">Storefront Order</option>
                  <option value="NEWEST">Newest</option>
                  <option value="OLDEST">Oldest</option>
                  <option value="NAME_ASC">Name A-Z</option>
                  <option value="NAME_DESC">Name Z-A</option>
                  <option value="PRICE_LOW">Price Low-High</option>
                  <option value="PRICE_HIGH">Price High-Low</option>
                  <option value="STOCK_LOW">Stock Low-High</option>
                  <option value="STOCK_HIGH">Stock High-Low</option>
                </select>

                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters((current) => !current)
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium xl:hidden"
              style={{
                borderColor: "var(--admin-border)",
                color: "var(--admin-text-secondary)",
              }}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <button
              type="button"
              onClick={() => void loadProducts(true)}
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:bg-[var(--admin-surface-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                borderColor: "var(--admin-border)",
                color: "var(--admin-text-secondary)",
              }}
            >
              <RefreshCw
                className={
                  refreshing
                    ? "h-4 w-4 animate-spin"
                    : "h-4 w-4"
                }
              />
              Refresh
            </button>

            {orderChanged && canDragProducts && (
              <button
                type="button"
                onClick={saveProductOrder}
                disabled={savingOrder}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "var(--admin-primary)",
                  color: "#ffffff",
                  boxShadow: "var(--admin-shadow-sm)",
                }}
              >
                {savingOrder ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {savingOrder ? "Saving..." : "Save Order"}
              </button>
            )}
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t pt-4 xl:hidden">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="h-11 rounded-xl border bg-transparent px-4 text-sm outline-none"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text)",
                }}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="h-11 rounded-xl border bg-transparent px-4 text-sm outline-none"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text)",
                }}
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
              </select>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as SortOption
                  )
                }
                className="h-11 rounded-xl border bg-transparent px-4 text-sm outline-none"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text)",
                }}
              >
                <option value="CUSTOM">Storefront Order</option>
                <option value="NEWEST">Newest</option>
                <option value="OLDEST">Oldest</option>
                <option value="NAME_ASC">Name A-Z</option>
                <option value="NAME_DESC">Name Z-A</option>
                <option value="PRICE_LOW">Price Low-High</option>
                <option value="PRICE_HIGH">Price High-Low</option>
                <option value="STOCK_LOW">Stock Low-High</option>
                <option value="STOCK_HIGH">Stock High-Low</option>
              </select>
            </div>
          )}

          {sortBy === "CUSTOM" && !canDragProducts && (
            <div
              className="mt-4 rounded-xl border px-4 py-3 text-xs sm:text-sm"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--admin-primary) 7%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--admin-primary) 20%, var(--admin-border))",
                color: "var(--admin-text-secondary)",
              }}
            >
              Clear the search and filters to drag products and
              change their storefront order.
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <span
                className="text-xs"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                Filters applied
              </span>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-primary) 12%, transparent)",
                  color: "var(--admin-primary-light)",
                }}
              >
                Clear
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* PRODUCT DETAILS */}
        {/* ================================================== */}

        <div
          className="mt-6 overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
          }}
        >
          <div
            className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
            style={{
              borderColor: "var(--admin-border)",
            }}
          >
            <div>
              <h2
                className="text-lg font-semibold"
                style={{
                  color: "var(--admin-text)",
                }}
              >
                Product Details
              </h2>

              <p
                className="mt-1 text-xs sm:text-sm"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>

            {sortBy === "CUSTOM" && canDragProducts && (
              <div
                className="hidden items-center gap-2 text-xs sm:flex"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                <GripVertical className="h-4 w-4" />
                Drag to reorder
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="flex items-center gap-3">
                <RefreshCw
                  className="h-5 w-5 animate-spin"
                  style={{
                    color: "var(--admin-primary-light)",
                  }}
                />

                <span
                  className="text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Loading products...
                </span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-primary) 12%, transparent)",
                  color: "var(--admin-primary-light)",
                }}
              >
                <Package className="h-6 w-6" />
              </div>

              <h3
                className="mt-5 text-base font-semibold"
                style={{
                  color: "var(--admin-text)",
                }}
              >
                No products found
              </h3>

              <p
                className="mt-2 max-w-md text-sm"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                Try changing your search or filters, or add
                a new product to your catalog.
              </p>

              <Link
                href="/store/products/create"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
                style={{
                  backgroundColor: "var(--admin-primary)",
                  color: "#ffffff",
                }}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1160px]">
                  <thead>
                    <tr
                      className="border-b"
                      style={{
                        borderColor: "var(--admin-border)",
                      }}
                    >
                      <th className="w-12 px-3 py-4" />

                      <th
                        className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Product
                      </th>

                      <th
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Category
                      </th>

                      <th
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Stock Quantity
                      </th>

                      <th
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Price
                      </th>

                      <th
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Inventory Value
                      </th>

                      <th
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Status
                      </th>

                      <th
                        className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => {
                      const image = getProductImage(product);

                      const isDragged =
                        draggedProductId === product.id;

                      const isDragOver =
                        dragOverProductId === product.id;

                      return (
                        <tr
                          key={product.id}
                          draggable={canDragProducts}
                          onDragStart={(event) =>
                            handleDragStart(event, product.id)
                          }
                          onDragOver={(event) =>
                            handleDragOver(event, product.id)
                          }
                          onDrop={(event) =>
                            handleDrop(event, product.id)
                          }
                          onDragEnd={handleDragEnd}
                          className={`border-b transition-all last:border-b-0 ${
                            canDragProducts
                              ? "cursor-grab active:cursor-grabbing"
                              : ""
                          } ${isDragged ? "opacity-40" : ""}`}
                          style={{
                            borderColor: "var(--admin-border)",
                            backgroundColor: isDragOver
                              ? "color-mix(in srgb, var(--admin-primary) 8%, var(--admin-surface))"
                              : undefined,
                            boxShadow: isDragOver
                              ? "inset 0 2px 0 var(--admin-primary)"
                              : undefined,
                          }}
                        >
                          <td className="px-3 py-4">
                            {canDragProducts ? (
                              <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg"
                                style={{
                                  color: "var(--admin-text-muted)",
                                }}
                                title="Drag to reorder"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                            ) : (
                              <span className="block w-9" />
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex min-w-[260px] items-center gap-3">
                              <div
                                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
                                style={{
                                  backgroundColor: "var(--admin-surface-2)",
                                  borderColor: "var(--admin-border)",
                                }}
                              >
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package
                                    className="h-5 w-5"
                                    style={{
                                      color: "var(--admin-text-muted)",
                                    }}
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="truncate text-sm font-semibold"
                                  style={{
                                    color: "var(--admin-text)",
                                  }}
                                >
                                  {product.name}
                                </p>

                                {product.sku && (
                                  <p
                                    className="mt-1 text-xs"
                                    style={{
                                      color: "var(--admin-text-muted)",
                                    }}
                                  >
                                    SKU: {product.sku}
                                  </p>
                                )}
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
                              {product.category?.name ?? "Uncategorized"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="text-sm font-medium"
                              style={{
                                color: getStockAlert(product)
                                  ? "var(--admin-warning)"
                                  : "var(--admin-text)",
                              }}
                            >
                              {product.stock_quantity}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <IndianRupee
                                className="h-3.5 w-3.5"
                                style={{
                                  color: "var(--admin-text-muted)",
                                }}
                              />

                              <span
                                className="text-sm font-semibold"
                                style={{
                                  color: "var(--admin-text)",
                                }}
                              >
                                {product.price.toLocaleString(
                                  "en-IN",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <IndianRupee
                                className="h-3.5 w-3.5"
                                style={{
                                  color: "var(--admin-text-muted)",
                                }}
                              />

                              <span
                                className="text-sm font-medium"
                                style={{
                                  color: "var(--admin-text-secondary)",
                                }}
                              >
                                {getInventoryValue(product).toLocaleString(
                                  "en-IN",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="inline-flex items-center gap-2 text-sm font-medium"
                              style={{
                                color: product.is_active
                                  ? "var(--admin-success)"
                                  : "var(--admin-text-muted)",
                              }}
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: product.is_active
                                    ? "var(--admin-success)"
                                    : "var(--admin-text-subtle)",
                                }}
                              />

                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Edit and Delete only */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/store/products/${product.id}`}
                                aria-label={`Edit ${product.name}`}
                                title="Edit Product"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--admin-surface-hover)]"
                                style={{
                                  borderColor: "var(--admin-border)",
                                  color: "var(--admin-text-secondary)",
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteProduct(product)
                                }
                                aria-label={`Delete ${product.name}`}
                                title="Delete Product"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--admin-surface-hover)]"
                                style={{
                                  borderColor: "var(--admin-border)",
                                  color: "var(--admin-danger)",
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet */}
              <div className="divide-y lg:hidden">
                {filteredProducts.map((product) => {
                  const image = getProductImage(product);

                  const isDragged =
                    draggedProductId === product.id;

                  const isDragOver =
                    dragOverProductId === product.id;

                  return (
                    <div
                      key={product.id}
                      draggable={canDragProducts}
                      onDragStart={(event) => {
                        if (!canDragProducts) {
                          event.preventDefault();
                          return;
                        }

                        setDraggedProductId(product.id);

                        event.dataTransfer.effectAllowed = "move";

                        event.dataTransfer.setData(
                          "text/plain",
                          product.id
                        );
                      }}
                      onDragOver={(event) => {
                        if (!canDragProducts) {
                          return;
                        }

                        event.preventDefault();

                        event.dataTransfer.dropEffect = "move";

                        setDragOverProductId(product.id);
                      }}
                      onDrop={(event) => {
                        if (!canDragProducts) {
                          return;
                        }

                        event.preventDefault();

                        const draggedId =
                          event.dataTransfer.getData("text/plain") ||
                          draggedProductId;

                        if (draggedId) {
                          moveProduct(draggedId, product.id);
                        }

                        setDraggedProductId(null);
                        setDragOverProductId(null);
                      }}
                      onDragEnd={handleDragEnd}
                      className={`p-4 transition-all sm:p-5 ${
                        canDragProducts
                          ? "cursor-grab active:cursor-grabbing"
                          : ""
                      } ${isDragged ? "opacity-40" : ""}`}
                      style={{
                        borderColor: "var(--admin-border)",
                        backgroundColor: isDragOver
                          ? "color-mix(in srgb, var(--admin-primary) 8%, var(--admin-surface))"
                          : undefined,
                        boxShadow: isDragOver
                          ? "inset 0 2px 0 var(--admin-primary)"
                          : undefined,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {canDragProducts && (
                          <div
                            className="flex h-10 w-8 shrink-0 items-center justify-center"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                        )}

                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
                          style={{
                            backgroundColor: "var(--admin-surface-2)",
                            borderColor: "var(--admin-border)",
                          }}
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package
                              className="h-5 w-5"
                              style={{
                                color: "var(--admin-text-muted)",
                              }}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{
                              color: "var(--admin-text)",
                            }}
                          >
                            {product.name}
                          </p>

                          {product.sku && (
                            <p
                              className="mt-1 text-xs"
                              style={{
                                color: "var(--admin-text-muted)",
                              }}
                            >
                              SKU: {product.sku}
                            </p>
                          )}

                          <p
                            className="mt-1 text-sm"
                            style={{
                              color: "var(--admin-text-secondary)",
                            }}
                          >
                            {product.category?.name ?? "Uncategorized"}
                          </p>
                        </div>

                        <span
                          className="shrink-0 text-xs font-semibold"
                          style={{
                            color: product.is_active
                              ? "var(--admin-success)"
                              : "var(--admin-text-muted)",
                          }}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
                        <div>
                          <p
                            className="text-[11px] font-medium uppercase tracking-wider"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            Stock Quantity
                          </p>

                          <p
                            className="mt-1 text-sm font-semibold"
                            style={{
                              color: getStockAlert(product)
                                ? "var(--admin-warning)"
                                : "var(--admin-text)",
                            }}
                          >
                            {product.stock_quantity}
                          </p>
                        </div>

                        <div>
                          <p
                            className="text-[11px] font-medium uppercase tracking-wider"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            Price
                          </p>

                          <div className="mt-1 flex items-center gap-1">
                            <IndianRupee
                              className="h-3 w-3"
                              style={{
                                color: "var(--admin-text-muted)",
                              }}
                            />

                            <p
                              className="text-sm font-semibold"
                              style={{
                                color: "var(--admin-text)",
                              }}
                            >
                              {product.price.toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p
                            className="text-[11px] font-medium uppercase tracking-wider"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            Inventory Value
                          </p>

                          <div className="mt-1 flex items-center gap-1">
                            <IndianRupee
                              className="h-3 w-3"
                              style={{
                                color: "var(--admin-text-muted)",
                              }}
                            />

                            <p
                              className="text-sm font-semibold"
                              style={{
                                color: "var(--admin-text-secondary)",
                              }}
                            >
                              {getInventoryValue(product).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p
                            className="text-[11px] font-medium uppercase tracking-wider"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            Status
                          </p>

                          <p
                            className="mt-1 text-sm font-medium"
                            style={{
                              color: product.is_active
                                ? "var(--admin-success)"
                                : "var(--admin-text-muted)",
                            }}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>

                      {/* Edit and Delete only */}
                      <div className="mt-5 flex items-center justify-end gap-2">
                        <Link
                          href={`/store/products/${product.id}`}
                          aria-label={`Edit ${product.name}`}
                          title="Edit Product"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--admin-surface-hover)]"
                          style={{
                            borderColor: "var(--admin-border)",
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteProduct(product)
                          }
                          aria-label={`Delete ${product.name}`}
                          title="Delete Product"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--admin-surface-hover)]"
                          style={{
                            borderColor: "var(--admin-border)",
                            color: "var(--admin-danger)",
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ====================================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ====================================================== */}

      {deleteProduct && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Delete Product
                </h3>

                <p
                  className="mt-2 text-sm leading-6"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Are you sure you want to{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    delete {deleteProduct.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                disabled={deleting}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-muted)",
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                disabled={deleting}
                className="h-10 rounded-xl border px-4 text-sm font-medium"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "var(--admin-danger)",
                  color: "#ffffff",
                }}
              >
                {deleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}