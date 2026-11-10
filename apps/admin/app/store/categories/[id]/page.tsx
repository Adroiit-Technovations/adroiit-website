
"use client";

import {
  ArrowLeft,
  Check,
  FolderTree,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "category-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

type FormState = {
  name: string;
  slug: string;
  sortOrder: string;
  isActive: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStoragePath(url: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    const marker = `/storage/v1/object/public/${BUCKET}/`;

    const index =
      parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(
      parsed.pathname.slice(
        index + marker.length
      )
    );
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function EditCategoryPage() {
  const params =
    useParams<{ id: string }>();

  const categoryId = params.id;

  const router = useRouter();
  const supabase = createClient();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [category, setCategory] =
    useState<Category | null>(null);

  const [form, setForm] =
    useState<FormState>({
      name: "",
      slug: "",
      sortOrder: "0",
      isActive: true,
    });

  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [newImage, setNewImage] =
    useState<File | null>(null);

  const [newImagePreview, setNewImagePreview] =
    useState<string | null>(null);

  const [productCount, setProductCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [sortOrderTaken, setSortOrderTaken] =
    useState(false);

  const [checkingSortOrder, setCheckingSortOrder] =
    useState(false);

  const [sortOrderCheckError, setSortOrderCheckError] =
    useState("");

  const loadCategory = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      const {
        data,
        error: categoryError,
      } = await supabase
        .from("categories")
        .select(
          "id,name,slug,image_url,is_active,sort_order,created_at"
        )
        .eq("id", categoryId)
        .single();

      if (categoryError || !data) {
        setError(
          categoryError?.message ||
            "Unable to load category."
        );

        setLoading(false);
        return;
      }

      const loadedCategory =
        data as Category;

      setCategory(loadedCategory);

      setForm({
        name: loadedCategory.name,
        slug: loadedCategory.slug,
        sortOrder: String(
          loadedCategory.sort_order ?? 0
        ),
        isActive:
          loadedCategory.is_active,
      });

      setImageUrl(
        loadedCategory.image_url || null
      );

      const {
        count,
        error: productError,
      } = await supabase
        .from("products")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("category_id", categoryId);

      if (!productError) {
        setProductCount(count ?? 0);
      }

      setLoading(false);
    },
    [categoryId, supabase]
  );

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(
          newImagePreview
        );
      }
    };
  }, [newImagePreview]);

  /*
   * Check whether the entered sort order
   * is already used by another category.
   *
   * The current category is excluded so that
   * keeping its existing sort order is valid.
   */
  useEffect(() => {
    let cancelled = false;

    const rawValue =
      form.sortOrder.trim();

    if (rawValue === "") {
      setSortOrderTaken(false);
      setSortOrderCheckError("");
      setCheckingSortOrder(false);
      return;
    }

    if (!/^\d+$/.test(rawValue)) {
      setSortOrderTaken(false);
      setSortOrderCheckError(
        "Sort order must be a non-negative whole number."
      );
      setCheckingSortOrder(false);
      return;
    }

    const sortOrder =
      Number.parseInt(rawValue, 10);

    if (
      !Number.isFinite(sortOrder) ||
      sortOrder < 0
    ) {
      setSortOrderTaken(false);
      setSortOrderCheckError(
        "Sort order must be a non-negative whole number."
      );
      setCheckingSortOrder(false);
      return;
    }

    setCheckingSortOrder(true);
    setSortOrderTaken(false);
    setSortOrderCheckError("");

    const timeoutId =
      window.setTimeout(
        async () => {
          try {
            const {
              data,
              error: checkError,
            } = await supabase
              .from("categories")
              .select("id")
              .eq(
                "sort_order",
                sortOrder
              )
              .neq("id", categoryId)
              .limit(1);

            if (cancelled) {
              return;
            }

            if (checkError) {
              setSortOrderCheckError(
                checkError.message
              );
              setSortOrderTaken(false);
              return;
            }

            const taken =
              (data?.length ?? 0) >
              0;

            setSortOrderTaken(taken);
            setSortOrderCheckError("");
          } catch (checkError) {
            if (cancelled) {
              return;
            }

            setSortOrderTaken(false);

            setSortOrderCheckError(
              checkError instanceof Error
                ? checkError.message
                : "Unable to verify sort order."
            );
          } finally {
            if (!cancelled) {
              setCheckingSortOrder(false);
            }
          }
        },
        300
      );

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    form.sortOrder,
    categoryId,
    supabase,
  ]);

  function handleNameChange(
    value: string
  ) {
    setForm((current) => ({
      ...current,
      name: value,
      slug:
        current.slug ===
          slugify(current.name) ||
        !current.slug
          ? slugify(value)
          : current.slug,
    }));

    setError(null);
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Image size must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (
      ![
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
      ].includes(file.type)
    ) {
      setError(
        "Please upload a PNG, JPG, WEBP or GIF image."
      );

      event.target.value = "";
      return;
    }

    setError(null);

    if (newImagePreview) {
      URL.revokeObjectURL(
        newImagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setNewImage(file);
    setNewImagePreview(previewUrl);
  }

  function removeNewImage() {
    if (newImagePreview) {
      URL.revokeObjectURL(
        newImagePreview
      );
    }

    setNewImage(null);
    setNewImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeCurrentImage() {
    setImageUrl(null);
  }

  function handleSortOrderChange(
    value: string
  ) {
    const cleanedValue =
      value.replace(/[^\d]/g, "");

    setForm((current) => ({
      ...current,
      sortOrder: cleanedValue,
    }));

    setError(null);
  }

  async function uploadImage(
    file: File
  ) {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const filePath =
      `categories/${categoryId}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        uploadError.message
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      path: filePath,
    };
  }

  async function handleSave() {
    if (!category) return;

    if (!form.name.trim()) {
      setError(
        "Category name is required."
      );
      return;
    }

    if (!form.slug.trim()) {
      setError(
        "Category slug is required."
      );
      return;
    }

    const rawSortOrder =
      form.sortOrder.trim();

    if (!/^\d+$/.test(rawSortOrder)) {
      setError(
        "Sort order must be a non-negative whole number."
      );
      return;
    }

    const sortOrder =
      Number.parseInt(
        rawSortOrder,
        10
      );

    if (
      !Number.isFinite(sortOrder) ||
      sortOrder < 0
    ) {
      setError(
        "Sort order must be a non-negative whole number."
      );
      return;
    }

    if (checkingSortOrder) {
      setError(
        "Please wait while the sort order is being checked."
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);

    const oldImageUrl =
      category.image_url;

    let finalImageUrl =
      imageUrl;

    let uploadedImagePath:
      | string
      | null = null;

    try {
      /*
       * Final authoritative uniqueness check.
       * Exclude the current category.
       */
      const {
        data: existingSortOrder,
        error: sortOrderError,
      } = await supabase
        .from("categories")
        .select("id")
        .eq(
          "sort_order",
          sortOrder
        )
        .neq("id", categoryId)
        .limit(1);

      if (sortOrderError) {
        throw new Error(
          sortOrderError.message
        );
      }

      if (
        existingSortOrder &&
        existingSortOrder.length > 0
      ) {
        setSortOrderTaken(true);

        throw new Error(
          "This sort order is already taken by another category."
        );
      }

      if (newImage) {
        const uploaded =
          await uploadImage(newImage);

        finalImageUrl =
          uploaded.url;

        uploadedImagePath =
          uploaded.path;
      }

      const {
        error: updateError,
      } = await supabase
        .from("categories")
        .update({
          name: form.name.trim(),
          slug: form.slug.trim(),
          image_url: finalImageUrl,
          is_active:
            form.isActive,
          sort_order: sortOrder,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", categoryId);

      if (updateError) {
        if (
          uploadedImagePath
        ) {
          await supabase.storage
            .from(BUCKET)
            .remove([
              uploadedImagePath,
            ]);
        }

        const message =
          updateError.message.toLowerCase();

        if (
          message.includes(
            "sort_order"
          ) ||
          message.includes(
            "duplicate key"
          )
        ) {
          setSortOrderTaken(true);

          throw new Error(
            "This sort order is already taken by another category."
          );
        }

        throw new Error(
          updateError.message
        );
      }

      if (
        oldImageUrl &&
        oldImageUrl !== finalImageUrl
      ) {
        const oldPath =
          getStoragePath(oldImageUrl);

        if (oldPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);
        }
      }

      setCategory((current) =>
        current
          ? {
              ...current,
              name: form.name.trim(),
              slug: form.slug.trim(),
              image_url:
                finalImageUrl,
              is_active:
                form.isActive,
              sort_order:
                sortOrder,
            }
          : current
      );

      setImageUrl(finalImageUrl);

      if (newImagePreview) {
        URL.revokeObjectURL(
          newImagePreview
        );
      }

      setNewImage(null);
      setNewImagePreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      setSortOrderTaken(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update category."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!category) return;

    setDeleting(true);
    setError(null);

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (deleteError) {
        throw new Error(
          deleteError.message
        );
      }

      const storagePath =
        getStoragePath(
          category.image_url
        );

      if (storagePath) {
        await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);
      }

      router.push(
        "/store/categories"
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete category."
      );

      setDeleting(false);
      setDeleteModalOpen(false);
    }
  }

  if (loading) {
    return (
      <div
        className="flex min-h-[70vh] items-center justify-center"
        style={{
          color:
            "var(--admin-text-muted)",
        }}
      >
        <Loader2
          className="animate-spin"
          size={24}
        />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto w-full max-w-[1350px]">
        <div
          className="rounded-3xl border p-8"
          style={{
            backgroundColor:
              "var(--admin-surface)",
            borderColor:
              "var(--admin-border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color:
                "var(--admin-danger)",
            }}
          >
            {error ||
              "Category not found."}
          </p>

          <Link
            href="/store/categories"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            style={{
              backgroundColor:
                "var(--admin-primary)",
              color: "#ffffff",
            }}
          >
            <ArrowLeft size={16} />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const previewImage =
    newImagePreview || imageUrl;

  return (
    <>
      <div className="mx-auto -mt-15 w-full max-w-[1350px] [&_h1]:!text-[#8c52ff] [&_h2]:!text-[#8c52ff] [&_h3]:!text-[#8c52ff]">
        {/* Header */}
        <div className="mb-7">
          <Link
            href="/store/categories"
            className="mb-4 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
              color:
                "var(--admin-text-secondary)",
            }}
          >
            <ArrowLeft size={16} />
            Back to Categories
          </Link>

          <h1
            className="text-3xl font-bold tracking-tight sm:text-2xl"
            style={{
              color: "#8c52ff",
            }}
          >
            Edit Category
          </h1>

          <p
            className="mt-2 max-w-2xl text-sm"
            style={{
              color:
                "var(--admin-text-muted)",
            }}
          >
            Update category details,
            image and store settings.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 rounded-2xl border px-4 py-3 text-sm"
            style={{
              backgroundColor:
                "rgba(248,113,113,0.08)",
              borderColor:
                "rgba(248,113,113,0.25)",
              color:
                "var(--admin-danger)",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main */}
          <div className="min-w-0 space-y-6">
            {/* Basic Information */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
                boxShadow:
                  "var(--admin-shadow-sm)",
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      "rgba(89,33,199,0.12)",
                    color:
                      "var(--admin-primary-light)",
                  }}
                >
                  <FolderTree size={19} />
                </div>

                <div>
                  <h2
                    className="text-lg font-bold"
                    style={{
                      color: "#8c52ff",
                    }}
                  >
                    Basic Information
                  </h2>

                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Manage the category
                    identity and image.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Category Name */}
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    Category Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      handleNameChange(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Arduino"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    Slug
                  </label>

                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        slug: slugify(
                          event.target.value
                        ),
                      }))
                    }
                    placeholder="arduino"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  />
                </div>

                {/* Category Image */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      className="text-sm font-semibold"
                      style={{
                        color:
                          "var(--admin-text)",
                      }}
                    >
                      Category Image
                    </label>

                    <span
                      className="text-[11px]"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      Max 5 MB
                    </span>
                  </div>

                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                    }}
                  >
                    {previewImage ? (
                      <div className="relative flex min-h-[160px] items-center justify-center p-3">
                        <div className="relative h-[280px] w-[280px] max-w-full overflow-hidden rounded-xl">
                          <Image
                            src={previewImage}
                            alt={
                              form.name ||
                              "Category image"
                            }
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>

                        <div className="absolute right-2 top-2 flex gap-2">
                          {newImage && (
                            <button
                              type="button"
                              onClick={
                                removeNewImage
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition hover:opacity-80"
                              style={{
                                backgroundColor:
                                  "rgba(0,0,0,0.65)",
                                color:
                                  "#ffffff",
                              }}
                              aria-label="Remove new image"
                            >
                              <X size={15} />
                            </button>
                          )}

                          {!newImage &&
                            imageUrl && (
                              <button
                                type="button"
                                onClick={
                                  removeCurrentImage
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition hover:opacity-80"
                                style={{
                                  backgroundColor:
                                    "rgba(0,0,0,0.65)",
                                  color:
                                    "#ffffff",
                                }}
                                aria-label="Remove image"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="flex min-h-[100px] w-full flex-col items-center justify-center gap-2 px-4 py-5 text-center transition hover:opacity-80"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor:
                              "rgba(89,33,199,0.10)",
                            color:
                              "var(--admin-primary-light)",
                          }}
                        >
                          <ImageIcon size={17} />
                        </div>

                        <div>
                          <p
                            className="text-xs font-semibold"
                            style={{
                              color:
                                "var(--admin-text)",
                            }}
                          >
                            Upload Image
                          </p>

                          <p className="mt-0.5 text-[10px]">
                            PNG, JPG, WEBP or GIF
                          </p>
                        </div>
                      </button>
                    )}
                  </div>

                  {previewImage && (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium transition hover:opacity-70"
                      style={{
                        color:
                          "var(--admin-primary-light)",
                      }}
                    >
                      <Upload size={13} />
                      Replace Image
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={
                      handleImageChange
                    }
                  />
                </div>
              </div>
            </section>

            {/* Category Settings */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
                boxShadow:
                  "var(--admin-shadow-sm)",
              }}
            >
              <div className="mb-6">
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#8c52ff",
                  }}
                >
                  Category Settings
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Configure how this
                  category behaves in the
                  store.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Sort Order */}
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    Sort Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={
                      form.sortOrder
                    }
                    onChange={(event) =>
                      handleSortOrderChange(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        sortOrderTaken ||
                        sortOrderCheckError
                          ? "var(--admin-danger)"
                          : "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  />

                  {checkingSortOrder ? (
                    <p
                      className="mt-1.5 flex items-center gap-1.5 text-[11px]"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      <Loader2
                        size={12}
                        className="animate-spin"
                      />
                      Checking sort order...
                    </p>
                  ) : sortOrderTaken ? (
                    <p
                      className="mt-1.5 text-[11px] font-medium"
                      style={{
                        color:
                          "var(--admin-danger)",
                      }}
                    >
                      This sort order is
                      already taken by
                      another category.
                    </p>
                  ) : sortOrderCheckError ? (
                    <p
                      className="mt-1.5 text-[11px] font-medium"
                      style={{
                        color:
                          "var(--admin-danger)",
                      }}
                    >
                      {sortOrderCheckError}
                    </p>
                  ) : (
                    <p
                      className="mt-1.5 text-[11px]"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      Lower numbers appear
                      first. Each category
                      must have a unique
                      sort order.
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    Status
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        isActive:
                          !current.isActive,
                      }))
                    }
                    className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color:
                            "var(--admin-text)",
                        }}
                      >
                        {form.isActive
                          ? "Active"
                          : "Inactive"}
                      </p>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        {form.isActive
                          ? "Visible in the store"
                          : "Hidden from the store"}
                      </p>
                    </div>

                    <div
                      className="relative h-6 w-11 rounded-full transition"
                      style={{
                        backgroundColor:
                          form.isActive
                            ? "var(--admin-primary)"
                            : "var(--admin-text-subtle)",
                      }}
                    >
                      <span
                        className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
                        style={{
                          left:
                            form.isActive
                              ? "24px"
                              : "4px",
                        }}
                      />
                    </div>
                  </button>
                </div>

                {/* Product Count */}
                <div className="sm:col-span-2">
                  <div
                    className="flex items-center justify-between rounded-xl border px-4 py-3"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color:
                            "var(--admin-text)",
                        }}
                      >
                        Products
                      </p>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        Products currently
                        assigned to this
                        category.
                      </p>
                    </div>

                    <span
                      className="text-lg font-bold"
                      style={{
                        color:
                          "var(--admin-text)",
                      }}
                    >
                      {productCount}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Preview + Actions */}
          <aside className="min-w-0 self-start">
            {/* Preview */}
            <div
              className="rounded-3xl border p-5"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
                boxShadow:
                  "var(--admin-shadow-sm)",
              }}
            >
              <div className="mb-5">
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#8c52ff",
                  }}
                >
                  Category Preview
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Preview how the category
                  may appear in the store.
                </p>
              </div>

              <div
                className="overflow-hidden rounded-2xl border"
                style={{
                  backgroundColor:
                    "var(--admin-surface-2)",
                  borderColor:
                    "var(--admin-border)",
                }}
              >
                <div className="p-3">
                  <div
                    className="relative aspect-square overflow-hidden rounded-xl"
                    style={{
                      backgroundColor:
                        "rgba(255,255,255,0.03)",
                    }}
                  >
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt={
                          form.name ||
                          "Category preview"
                        }
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center"
                        style={{
                          color:
                            "var(--admin-text-subtle)",
                        }}
                      >
                        <ImageIcon
                          size={32}
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <h3
                    className="truncate text-base font-bold"
                    style={{
                      color: "#8c52ff",
                    }}
                  >
                    {form.name ||
                      "Category Name"}
                  </h3>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    {productCount}{" "}
                    {productCount === 1
                      ? "product"
                      : "products"}
                  </p>

                  <div className="mt-3">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold"
                      style={{
                        backgroundColor:
                          form.isActive
                            ? "rgba(52,211,153,0.10)"
                            : "rgba(248,113,113,0.10)",
                        color:
                          form.isActive
                            ? "var(--admin-success)"
                            : "var(--admin-danger)",
                      }}
                    >
                      {form.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="mt-5 rounded-2xl border px-4 py-3"
                style={{
                  backgroundColor:
                    "var(--admin-surface-2)",
                  borderColor:
                    "var(--admin-border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Created
                  </span>

                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        "var(--admin-text-secondary)",
                    }}
                  >
                    {formatDate(
                      category.created_at
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Changes - Below Preview */}
            <section
              className="mt-6 rounded-3xl border p-5"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
                boxShadow:
                  "var(--admin-shadow-sm)",
              }}
            >
              <div>
                <h2
                  className="text-base font-bold"
                  style={{
                    color: "#8c52ff",
                  }}
                >
                  Save Changes
                </h2>

                <p
                  className="mt-1.5 text-xs leading-5"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Save the updated category
                  information and store
                  settings.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  checkingSortOrder ||
                  sortOrderTaken ||
                  !!sortOrderCheckError
                }
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor:
                    saved
                      ? "var(--admin-success)"
                      : "var(--admin-primary)",
                  color: "#ffffff",
                }}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check size={17} />
                    Category Updated
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </section>

            {/* Delete Category - Below Save */}
            <section
              className="mt-6 rounded-3xl border p-5"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "rgba(248,113,113,0.22)",
                boxShadow:
                  "var(--admin-shadow-sm)",
              }}
            >
              <h2
                className="text-base font-bold"
                style={{
                  color: "#8c52ff",
                }}
              >
                Delete Category
              </h2>

              <p
                className="mt-1.5 text-xs leading-5"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                Deleting this category will
                remove the category itself.
                Products assigned to it will
                remain in the store without a
                category.
              </p>

              <button
                type="button"
                onClick={() =>
                  setDeleteModalOpen(true)
                }
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:opacity-80"
                style={{
                  borderColor:
                    "rgba(248,113,113,0.28)",
                  color:
                    "var(--admin-danger)",
                }}
              >
                <Trash2 size={15} />
                Delete Category
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl border p-6"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#8c52ff",
                  }}
                >
                  Delete Category
                </h2>

                <p
                  className="mt-2 text-sm leading-6"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Are you sure you want to
                  delete{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    {category.name}
                  </span>
                  ?
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteModalOpen(false)
                }
                disabled={deleting}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:opacity-70 disabled:opacity-50"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                <X size={17} />
              </button>
            </div>

            {productCount > 0 && (
              <div
                className="mt-5 rounded-2xl border px-4 py-3 text-xs leading-5"
                style={{
                  backgroundColor:
                    "rgba(250,204,21,0.07)",
                  borderColor:
                    "rgba(250,204,21,0.18)",
                  color:
                    "var(--admin-warning)",
                }}
              >
                This category currently
                has {productCount}{" "}
                {productCount === 1
                  ? "product"
                  : "products"}
                . The products will remain
                in the store after the
                category is deleted.
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteModalOpen(false)
                }
                disabled={deleting}
                className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:opacity-80"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text-secondary)",
                  backgroundColor:
                    "var(--admin-surface)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
                style={{
                  backgroundColor:
                    "var(--admin-danger)",
                  color: "#ffffff",
                }}
              >
                {deleting ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete Category
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
