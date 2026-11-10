"use client";

import Link from "next/link";
import {
  Archive,
  ArrowUpDown,
  Check,
  ChevronDown,
  Edit3,
  FolderTree,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
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
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_count: number;
  last_product_added_at: string | null;
};

type Product = {
  id: string;
  category_id: string | null;
  created_at: string;
};

type StatusFilter =
  | "ALL"
  | "ACTIVE"
  | "INACTIVE";

type SortOption =
  | "sort_order"
  | "name_asc"
  | "name_desc"
  | "products_desc"
  | "products_asc"
  | "newest"
  | "oldest";

const supabase = createClient();

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ?? ""
    )
    .join("");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatLastProductDate(
  date: string | null
) {
  if (!date) {
    return "No products yet";
  }

  return formatDate(date);
}

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [sortBy, setSortBy] =
    useState<SortOption>("sort_order");

  const [sortOpen, setSortOpen] =
    useState(false);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadCategories = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [
          {
            data: categoryData,
            error: categoryError,
          },
          {
            data: productData,
            error: productError,
          },
        ] = await Promise.all([
          supabase
            .from("categories")
            .select(
              `
                id,
                name,
                slug,
                description,
                image_url,
                is_active,
                sort_order,
                created_at,
                updated_at
              `
            )
            .order("sort_order", {
              ascending: true,
            })
            .order("name", {
              ascending: true,
            }),

          /*
           * created_at is used to determine
           * the latest product added to each
           * category.
           */
          supabase
            .from("products")
            .select(
              "id, category_id, created_at"
            ),
        ]);

        if (categoryError) {
          throw new Error(
            categoryError.message
          );
        }

        if (productError) {
          throw new Error(
            productError.message
          );
        }

        const products =
          (productData ?? []) as Product[];

        const productCounts = new Map<
          string,
          number
        >();

        const lastProductDates = new Map<
          string,
          string
        >();

        for (const product of products) {
          if (!product.category_id) {
            continue;
          }

          productCounts.set(
            product.category_id,
            (productCounts.get(
              product.category_id
            ) ?? 0) + 1
          );

          const existingDate =
            lastProductDates.get(
              product.category_id
            );

          if (
            !existingDate ||
            new Date(
              product.created_at
            ).getTime() >
              new Date(
                existingDate
              ).getTime()
          ) {
            lastProductDates.set(
              product.category_id,
              product.created_at
            );
          }
        }

        const formattedCategories: Category[] =
          (
            categoryData ?? []
          ).map((category) => ({
            ...category,

            product_count:
              productCounts.get(
                category.id
              ) ?? 0,

            last_product_added_at:
              lastProductDates.get(
                category.id
              ) ?? null,
          }));

        setCategories(
          formattedCategories
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load categories.";

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    const filtered =
      categories.filter(
        (category) => {
          const matchesSearch =
            !query ||
            category.name
              .toLowerCase()
              .includes(query) ||
            category.slug
              .toLowerCase()
              .includes(query) ||
            (
              category.description ??
              ""
            )
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter ===
              "ACTIVE" &&
              category.is_active) ||
            (statusFilter ===
              "INACTIVE" &&
              !category.is_active);

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    return [...filtered].sort(
      (a, b) => {
        switch (sortBy) {
          case "name_asc":
            return a.name.localeCompare(
              b.name
            );

          case "name_desc":
            return b.name.localeCompare(
              a.name
            );

          case "products_desc":
            return (
              b.product_count -
              a.product_count
            );

          case "products_asc":
            return (
              a.product_count -
              b.product_count
            );

          case "newest":
            return (
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
            );

          case "oldest":
            return (
              new Date(
                a.created_at
              ).getTime() -
              new Date(
                b.created_at
              ).getTime()
            );

          case "sort_order":
          default:
            return (
              a.sort_order -
                b.sort_order ||
              a.name.localeCompare(
                b.name
              )
            );
        }
      }
    );
  }, [
    categories,
    search,
    statusFilter,
    sortBy,
  ]);

  const totalCategories =
    categories.length;

  const activeCategories =
    categories.filter(
      (category) =>
        category.is_active
    ).length;

  const inactiveCategories =
    categories.filter(
      (category) =>
        !category.is_active
    ).length;

  const assignedProducts =
    categories.reduce(
      (total, category) =>
        total +
        category.product_count,
      0
    );

  async function handleDelete() {
    if (!deleteCategory) return;

    try {
      setDeleting(true);
      setError("");

      const {
        error: deleteError,
      } = await supabase
        .from("categories")
        .delete()
        .eq(
          "id",
          deleteCategory.id
        );

      if (deleteError) {
        throw new Error(
          deleteError.message
        );
      }

      setCategories((current) =>
        current.filter(
          (category) =>
            category.id !==
            deleteCategory.id
        )
      );

      setDeleteCategory(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to delete category.";

      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  function getSortLabel() {
    switch (sortBy) {
      case "name_asc":
        return "Name A–Z";

      case "name_desc":
        return "Name Z–A";

      case "products_desc":
        return "Most Products";

      case "products_asc":
        return "Least Products";

      case "newest":
        return "Newest";

      case "oldest":
        return "Oldest";

      case "sort_order":
      default:
        return "Sort Order";
    }
  }

  return (
    <div
      className="w-full"
      style={{
        color:
          "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-15 w-full max-w-[1350px]">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em]"
              style={{
                color:
                  "var(--admin-primary-light)",
              }}
            >
              Categories Management
            </p>

            <h1
              className="mt-2 text-3xl font-bold tracking-tight sm:text-3xl"
              style={{
                color:
                  "var(--admin-text)",
              }}
            >
              Categories Dashboard
            </h1>

            <p
              className="mt-1.5 max-w-2xl text-sm sm:text-base"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              Organize your store
              products into manageable
              categories.
            </p>
          </div>

          <Link
            href="/store/categories/create"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all hover:brightness-110 sm:w-auto"
            style={{
              backgroundColor:
                "var(--admin-primary)",
              color: "#ffffff",
              boxShadow:
                "0 8px 22px rgba(89,33,199,0.22)",
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--admin-danger) 8%, var(--admin-surface))",
              borderColor:
                "color-mix(in srgb, var(--admin-danger) 22%, var(--admin-border))",
            }}
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{
                  color:
                    "var(--admin-danger)",
                }}
              >
                Unable to load categories
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="rounded-lg p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Overview */}
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={
              <FolderTree className="h-5 w-5" />
            }
            title="Total Categories"
            value={totalCategories.toString()}
          />

          <StatCard
            icon={
              <Check className="h-5 w-5" />
            }
            title="Active Categories"
            value={activeCategories.toString()}
          />

          <StatCard
            icon={
              <Archive className="h-5 w-5" />
            }
            title="Inactive Categories"
            value={inactiveCategories.toString()}
          />

          <StatCard
            icon={
              <FolderTree className="h-5 w-5" />
            }
            title="Assigned Products"
            value={assignedProducts.toString()}
          />
        </div>

        {/* Controls */}
        <div
          className="mb-5 rounded-2xl border p-3 sm:p-4"
          style={{
            backgroundColor:
              "var(--admin-surface)",
            borderColor:
              "var(--admin-border)",
            boxShadow:
              "var(--admin-shadow-sm)",
          }}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search categories..."
                className="h-11 w-full rounded-xl border bg-transparent pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[var(--admin-text-subtle)] focus:ring-2"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text)",
                  ["--tw-ring-color" as string]:
                    "rgba(89,33,199,0.20)",
                }}
              />
            </div>

            {/* Status */}
            <div className="flex overflow-x-auto rounded-xl border p-1">
              {(
                [
                  ["ALL", "All"],
                  ["ACTIVE", "Active"],
                  [
                    "INACTIVE",
                    "Inactive",
                  ],
                ] as const
              ).map(
                ([value, label]) => {
                  const selected =
                    statusFilter ===
                    value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setStatusFilter(
                          value
                        )
                      }
                      className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm"
                      style={{
                        backgroundColor:
                          selected
                            ? "var(--admin-primary)"
                            : "transparent",
                        color: selected
                          ? "#ffffff"
                          : "var(--admin-text-muted)",
                      }}
                    >
                      {label}
                    </button>
                  );
                }
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setSortOpen(
                    (open) => !open
                  )
                }
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-sm font-medium lg:w-[180px]"
                style={{
                  backgroundColor:
                    "var(--admin-surface)",
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text)",
                }}
              >
                <span className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  {getSortLabel()}
                </span>

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    sortOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {sortOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] z-30 w-full min-w-[190px] overflow-hidden rounded-xl border p-1"
                  style={{
                    backgroundColor:
                      "var(--admin-surface)",
                    borderColor:
                      "var(--admin-border)",
                    boxShadow:
                      "var(--admin-shadow)",
                  }}
                >
                  {(
                    [
                      [
                        "sort_order",
                        "Sort Order",
                      ],
                      [
                        "name_asc",
                        "Name A–Z",
                      ],
                      [
                        "name_desc",
                        "Name Z–A",
                      ],
                      [
                        "products_desc",
                        "Most Products",
                      ],
                      [
                        "products_asc",
                        "Least Products",
                      ],
                      [
                        "newest",
                        "Newest",
                      ],
                      [
                        "oldest",
                        "Oldest",
                      ],
                    ] as const
                  ).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSortBy(
                            value
                          );
                          setSortOpen(
                            false
                          );
                        }}
                        className="flex w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                        style={{
                          backgroundColor:
                            sortBy ===
                            value
                              ? "color-mix(in srgb, var(--admin-primary) 10%, transparent)"
                              : "transparent",
                          color:
                            sortBy ===
                            value
                              ? "var(--admin-primary-light)"
                              : "var(--admin-text-secondary)",
                        }}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() =>
                loadCategories(true)
              }
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/5"
              style={{
                borderColor:
                  "var(--admin-border)",
                color:
                  "var(--admin-text-secondary)",
              }}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredCategories.length ===
          0 ? (
          <EmptyState
            hasFilters={
              Boolean(search.trim()) ||
              statusFilter !== "ALL"
            }
            onClear={() => {
              setSearch("");
              setStatusFilter(
                "ALL"
              );
            }}
          />
        ) : (
          <>
            {/* Desktop */}
            <div
              className="hidden overflow-hidden rounded-2xl border lg:block"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
                boxShadow:
                  "var(--admin-shadow-sm)",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] border-collapse">
                  <thead>
                    <tr
                      className="border-b"
                      style={{
                        borderColor:
                          "var(--admin-border)",
                      }}
                    >
                      <TableHeader>
                        Category
                      </TableHeader>

                      <TableHeader>
                        Products
                      </TableHeader>

                      <TableHeader>
                        Sort Order
                      </TableHeader>

                      <TableHeader>
                        Status
                      </TableHeader>

                      <TableHeader>
                        Created
                      </TableHeader>

                      <TableHeader>
                        Last Product Added
                      </TableHeader>

                      <TableHeader align="right">
                        Actions
                      </TableHeader>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCategories.map(
                      (category) => (
                        <tr
                          key={category.id}
                          className="border-b last:border-b-0 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.025]"
                          style={{
                            borderColor:
                              "var(--admin-border)",
                          }}
                        >
                          <td className="px-5 py-4">
                            <div className="flex min-w-[300px] items-center gap-3">
                              <CategoryImage
                                category={
                                  category
                                }
                              />

                              <div className="min-w-0">
                                <p
                                  className="truncate text-sm font-semibold"
                                  style={{
                                    color:
                                      "var(--admin-text)",
                                  }}
                                >
                                  {
                                    category.name
                                  }
                                </p>

                                <p
                                  className="mt-0.5 truncate text-xs"
                                  style={{
                                    color:
                                      "var(--admin-text-muted)",
                                  }}
                                >
                                  /
                                  {
                                    category.slug
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  "var(--admin-text)",
                              }}
                            >
                              {
                                category.product_count
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="text-sm"
                              style={{
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                            >
                              {
                                category.sort_order
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              active={
                                category.is_active
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="whitespace-nowrap text-sm"
                              style={{
                                color:
                                  "var(--admin-text-muted)",
                              }}
                            >
                              {formatDate(
                                category.created_at
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="whitespace-nowrap text-sm"
                              style={{
                                color:
                                  category.last_product_added_at
                                    ? "var(--admin-text-secondary)"
                                    : "var(--admin-text-muted)",
                              }}
                            >
                              {formatLastProductDate(
                                category.last_product_added_at
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <ActionButtons
                              category={
                                category
                              }
                              onDelete={() =>
                                setDeleteCategory(
                                  category
                                )
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div
                className="border-t px-5 py-3"
                style={{
                  borderColor:
                    "var(--admin-border)",
                }}
              >
                <p
                  className="text-xs"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Showing{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        "var(--admin-text-secondary)",
                    }}
                  >
                    {
                      filteredCategories.length
                    }
                  </span>{" "}
                  of{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        "var(--admin-text-secondary)",
                    }}
                  >
                    {categories.length}
                  </span>{" "}
                  categories
                </p>
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-3 lg:hidden">
              {filteredCategories.map(
                (category) => (
                  <div
                    key={category.id}
                    className="rounded-2xl border p-4"
                    style={{
                      backgroundColor:
                        "var(--admin-surface)",
                      borderColor:
                        "var(--admin-border)",
                      boxShadow:
                        "var(--admin-shadow-sm)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <CategoryImage
                          category={
                            category
                          }
                        />

                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{
                              color:
                                "var(--admin-text)",
                            }}
                          >
                            {
                              category.name
                            }
                          </p>

                          <p
                            className="mt-0.5 truncate text-xs"
                            style={{
                              color:
                                "var(--admin-text-muted)",
                            }}
                          >
                            /
                            {
                              category.slug
                            }
                          </p>
                        </div>
                      </div>

                      <StatusBadge
                        active={
                          category.is_active
                        }
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <InfoItem
                        label="Products"
                        value={category.product_count.toString()}
                      />

                      <InfoItem
                        label="Sort Order"
                        value={category.sort_order.toString()}
                      />

                      <InfoItem
                        label="Created"
                        value={formatDate(
                          category.created_at
                        )}
                      />

                      <InfoItem
                        label="Last Product"
                        value={formatLastProductDate(
                          category.last_product_added_at
                        )}
                      />
                    </div>

                    <div
                      className="mt-4 flex items-center justify-end gap-1 border-t pt-3"
                      style={{
                        borderColor:
                          "var(--admin-border)",
                      }}
                    >
                      <ActionButtons
                        category={
                          category
                        }
                        onDelete={() =>
                          setDeleteCategory(
                            category
                          )
                        }
                      />
                    </div>
                  </div>
                )
              )}

              <div
                className="px-1 py-2 text-xs"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                Showing{" "}
                <span
                  className="font-semibold"
                  style={{
                    color:
                      "var(--admin-text-secondary)",
                  }}
                >
                  {
                    filteredCategories.length
                  }
                </span>{" "}
                of{" "}
                <span
                  className="font-semibold"
                  style={{
                    color:
                      "var(--admin-text-secondary)",
                  }}
                >
                  {categories.length}
                </span>{" "}
                categories
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border p-5 sm:p-6"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
              color:
                "var(--admin-text)",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.30)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">
                  Delete Category
                </h2>

                <p
                  className="mt-1.5 text-sm leading-6"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Are you sure you want to delete{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    {
                      deleteCategory.name
                    }
                  </span>
                  ?
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteCategory(
                    null
                  )
                }
                disabled={deleting}
                className="rounded-lg p-1.5 transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {deleteCategory.product_count >
              0 && (
              <div
                className="mt-4 rounded-xl border px-3.5 py-3 text-xs leading-5"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-warning) 8%, var(--admin-surface))",
                  borderColor:
                    "color-mix(in srgb, var(--admin-warning) 22%, var(--admin-border))",
                  color:
                    "var(--admin-text-secondary)",
                }}
              >
                This category currently
                contains{" "}
                <strong>
                  {
                    deleteCategory.product_count
                  }
                </strong>{" "}
                product
                {deleteCategory.product_count ===
                1
                  ? ""
                  : "s"}
                . Products will remain in
                the store but their category
                will become unassigned.
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteCategory(
                    null
                  )
                }
                disabled={deleting}
                className="h-10 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor:
                    "var(--admin-danger)",
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
                    Delete Category
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

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div
      className="rounded-2xl border px-4 py-4 sm:px-5 sm:py-5"
      style={{
        backgroundColor:
          "var(--admin-surface)",
        borderColor:
          "var(--admin-border)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl border"
          style={{
            borderColor:
              "var(--admin-border)",
            color:
              "var(--admin-primary-light)",
          }}
        >
          {icon}
        </span>

        <span
          className="text-xs font-semibold sm:text-sm"
          style={{
            color:
              "var(--admin-text-muted)",
          }}
        >
          {title}
        </span>
      </div>

      <p
        className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
        style={{
          color:
            "var(--admin-text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function CategoryImage({
  category,
}: {
  category: Category;
}) {
  if (category.image_url) {
    return (
      <div
        className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border"
        style={{
          borderColor:
            "var(--admin-border)",
          backgroundColor:
            "var(--admin-surface-2)",
        }}
      >
        <img
          src={category.image_url}
          alt={category.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xs font-bold"
      style={{
        borderColor:
          "var(--admin-border)",
        backgroundColor:
          "var(--admin-surface-2)",
        color:
          "var(--admin-primary-light)",
      }}
    >
      {getInitials(category.name)}
    </div>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        backgroundColor: active
          ? "color-mix(in srgb, var(--admin-success) 8%, transparent)"
          : "color-mix(in srgb, var(--admin-danger) 8%, transparent)",
        borderColor: active
          ? "color-mix(in srgb, var(--admin-success) 22%, var(--admin-border))"
          : "color-mix(in srgb, var(--admin-danger) 22%, var(--admin-border))",
        color: active
          ? "var(--admin-success)"
          : "var(--admin-danger)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: active
            ? "var(--admin-success)"
            : "var(--admin-danger)",
        }}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
      style={{
        color:
          "var(--admin-text-muted)",
      }}
    >
      {children}
    </th>
  );
}

function ActionButtons({
  category,
  onDelete,
}: {
  category: Category;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      {/* Edit */}
      <Link
        href={`/store/categories/${category.id}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{
          color:
            "var(--admin-text-secondary)",
        }}
        title="Edit category"
        aria-label="Edit category"
      >
        <Edit3 className="h-4 w-4" />
      </Link>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-red-500/10"
        style={{
          color:
            "var(--admin-danger)",
        }}
        title="Delete category"
        aria-label="Delete category"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl border px-3 py-2.5"
      style={{
        borderColor:
          "var(--admin-border)",
        backgroundColor:
          "var(--admin-surface-2)",
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{
          color:
            "var(--admin-text-subtle)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-sm font-semibold"
        style={{
          color:
            "var(--admin-text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="rounded-2xl border p-8"
      style={{
        backgroundColor:
          "var(--admin-surface)",
        borderColor:
          "var(--admin-border)",
      }}
    >
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <RefreshCw
          className="h-7 w-7 animate-spin"
          style={{
            color:
              "var(--admin-primary-light)",
          }}
        />

        <p
          className="mt-4 text-sm font-semibold"
          style={{
            color:
              "var(--admin-text)",
          }}
        >
          Loading categories
        </p>

        <p
          className="mt-1 text-xs"
          style={{
            color:
              "var(--admin-text-muted)",
          }}
        >
          Fetching your store categories...
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div
      className="rounded-2xl border"
      style={{
        backgroundColor:
          "var(--admin-surface)",
        borderColor:
          "var(--admin-border)",
      }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{
            borderColor:
              "var(--admin-border)",
            color:
              "var(--admin-primary-light)",
          }}
        >
          <FolderTree className="h-6 w-6" />
        </div>

        <h2
          className="mt-5 text-lg font-bold"
          style={{
            color:
              "var(--admin-text)",
          }}
        >
          {hasFilters
            ? "No categories found"
            : "No categories yet"}
        </h2>

        <p
          className="mt-1.5 max-w-md text-sm"
          style={{
            color:
              "var(--admin-text-muted)",
          }}
        >
          {hasFilters
            ? "Try changing your search or filters."
            : "Create your first store category to start organizing products."}
        </p>

        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 h-10 rounded-xl border px-4 text-sm font-semibold"
            style={{
              borderColor:
                "var(--admin-border)",
              color:
                "var(--admin-text-secondary)",
            }}
          >
            Clear Filters
          </button>
        ) : (
          <Link
            href="/store/categories/create"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white"
            style={{
              backgroundColor:
                "var(--admin-primary)",
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        )}
      </div>
    </div>
  );
}

