"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  FolderTree,
  Image as ImageIcon,
  RefreshCw,
  Save,
  Upload,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const CATEGORY_IMAGE_BUCKET = "category-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const HEADING_COLOR = "#8c52ff";

type FormData = {
  name: string;
  slug: string;
  sortOrder: string;
  isActive: boolean;
};

const initialForm: FormData = {
  name: "",
  slug: "",
  sortOrder: "0",
  isActive: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension || "jpg";
}

export default function CreateCategoryPage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormData>(initialForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [saving, setSaving] = useState(false);
  const [categoryAdded, setCategoryAdded] = useState(false);
  const [error, setError] = useState("");
  const [sortOrderTaken, setSortOrderTaken] = useState(false);
  const [checkingSortOrder, setCheckingSortOrder] = useState(false);
  const [sortOrderCheckError, setSortOrderCheckError] = useState("");

  useEffect(() => {
    if (!slugEdited) {
      setForm((current) => ({
        ...current,
        slug: slugify(current.name),
      }));
    }
  }, [form.name, slugEdited]);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedImage]);

  /*
   * Check sort-order uniqueness whenever
   * the value changes.
   */
  useEffect(() => {
    let cancelled = false;

    const rawValue = form.sortOrder.trim();

    if (rawValue === "") {
      setSortOrderTaken(false);
      setSortOrderCheckError("");
      setCheckingSortOrder(false);
      return;
    }

    const isWholeNumber = /^\d+$/.test(rawValue);

    if (!isWholeNumber) {
      setSortOrderTaken(false);
      setSortOrderCheckError(
        "Sort order must be a non-negative whole number."
      );
      setCheckingSortOrder(false);
      return;
    }

    const sortOrder = Number.parseInt(rawValue, 10);

    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
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

    const timeoutId = window.setTimeout(async () => {
      try {
        const {
          data,
          error: checkError,
        } = await supabase
          .from("categories")
          .select("id")
          .eq("sort_order", sortOrder)
          .limit(1);

        if (cancelled) return;

        if (checkError) {
          setSortOrderCheckError(checkError.message);
          setSortOrderTaken(false);
          return;
        }

        const taken = (data?.length ?? 0) > 0;

        setSortOrderTaken(taken);
        setSortOrderCheckError("");
      } catch (err) {
        if (cancelled) return;

        setSortOrderTaken(false);

        setSortOrderCheckError(
          err instanceof Error
            ? err.message
            : "Unable to verify sort order."
        );
      } finally {
        if (!cancelled) {
          setCheckingSortOrder(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [form.sortOrder]);

  const previewName = form.name.trim() || "Category Name";
  const previewSlug = form.slug.trim() || "category-name";

  const sortOrderIsValid = useMemo(() => {
    const value = form.sortOrder.trim();

    if (!/^\d+$/.test(value)) {
      return false;
    }

    const parsed = Number.parseInt(value, 10);

    return Number.isFinite(parsed) && parsed >= 0;
  }, [form.sortOrder]);

  const isValid = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.slug.trim().length >= 2 &&
      sortOrderIsValid &&
      !sortOrderTaken &&
      !checkingSortOrder &&
      !sortOrderCheckError
    );
  }, [
    form.name,
    form.slug,
    sortOrderIsValid,
    sortOrderTaken,
    checkingSortOrder,
    sortOrderCheckError,
  ]);

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    updateField("slug", slugify(value));
  }

  function handleSortOrderChange(value: string) {
    const cleanedValue = value.replace(/[^\d]/g, "");
    updateField("sortOrder", cleanedValue);
  }

  function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
  }

  function removeImage() {
    setSelectedImage(null);
    setImagePreview("");
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadCategoryImage(
    categoryId: string,
    file: File
  ) {
    const extension = getFileExtension(file);

    const filePath = `categories/${categoryId}-${crypto.randomUUID()}.${extension}`;

    const {
      data,
      error: uploadError,
    } = await supabase.storage
      .from(CATEGORY_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    if (!data?.path) {
      throw new Error(
        "Image was uploaded but its storage path could not be retrieved."
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(CATEGORY_IMAGE_BUCKET)
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Unable to generate the public image URL.");
    }

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    };
  }

  async function handleCreate() {
    if (!isValid || saving || categoryAdded) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const name = form.name.trim();
      const slug = slugify(form.slug);

      if (!name) {
        throw new Error("Category name is required.");
      }

      if (!slug) {
        throw new Error("A valid category slug is required.");
      }

      if (imageError) {
        throw new Error(imageError);
      }

      const sortOrderValue = Number.parseInt(form.sortOrder, 10);

      if (
        !Number.isFinite(sortOrderValue) ||
        sortOrderValue < 0 ||
        !/^\d+$/.test(form.sortOrder.trim())
      ) {
        throw new Error(
          "Sort order must be a non-negative whole number."
        );
      }

      const sortOrder = sortOrderValue;

      /*
       * Final authoritative sort-order
       * uniqueness check before insert.
       */
      const {
        data: existingSortOrder,
        error: sortOrderCheckError,
      } = await supabase
        .from("categories")
        .select("id")
        .eq("sort_order", sortOrder)
        .limit(1);

      if (sortOrderCheckError) {
        throw new Error(sortOrderCheckError.message);
      }

      if (existingSortOrder && existingSortOrder.length > 0) {
        setSortOrderTaken(true);

        throw new Error(
          "This sort order is already taken by another category."
        );
      }

      /* Check duplicate slug */
      const {
        data: existingCategory,
        error: slugCheckError,
      } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (slugCheckError) {
        throw new Error(slugCheckError.message);
      }

      if (existingCategory) {
        throw new Error(
          "A category with this slug already exists."
        );
      }

      /* Create category first */
      const {
        data: createdCategory,
        error: insertError,
      } = await supabase
        .from("categories")
        .insert({
          name,
          slug,
          image_url: null,
          sort_order: sortOrder,
          is_active: form.isActive,
        })
        .select("id")
        .single();

      if (insertError) {
        const message = insertError.message.toLowerCase();

        if (
          message.includes("sort_order") ||
          message.includes("duplicate key")
        ) {
          setSortOrderTaken(true);

          throw new Error(
            "This sort order is already taken by another category."
          );
        }

        throw new Error(insertError.message);
      }

      if (!createdCategory?.id) {
        throw new Error(
          "Category was created but its ID could not be retrieved."
        );
      }

      /*
       * Upload image after category creation.
       * This gives the file a stable category-specific path.
       */
      if (selectedImage) {
        try {
          const uploadedImage = await uploadCategoryImage(
            createdCategory.id,
            selectedImage
          );

          const {
            error: updateImageError,
          } = await supabase
            .from("categories")
            .update({
              image_url: uploadedImage.publicUrl,
              updated_at: new Date().toISOString(),
            })
            .eq("id", createdCategory.id);

          if (updateImageError) {
            await supabase.storage
              .from(CATEGORY_IMAGE_BUCKET)
              .remove([uploadedImage.path]);

            throw new Error(updateImageError.message);
          }
        } catch (imageUploadError) {
          await supabase
            .from("categories")
            .delete()
            .eq("id", createdCategory.id);

          throw imageUploadError;
        }
      }

      setCategoryAdded(true);

      window.setTimeout(() => {
        router.push("/store/categories");
      }, 1400);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create category.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="w-full"
      style={{
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-15 w-full max-w-[1350px]">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/store/categories"
            className="mb-5 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-secondary)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>

          <h1
            className="text-3xl font-bold tracking-tight sm:text-2xl"
            style={{
              color: HEADING_COLOR,
            }}
          >
            Add New Category
          </h1>

          <p
            className="mt-1.5 text-sm sm:text-base"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Create a category to organize products in your store.
          </p>
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
                  color: "var(--admin-danger)",
                }}
              >
                Unable to create category
              </p>

              <p
                className="mt-1 text-xs leading-5"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main Form */}
          <div className="min-w-0 space-y-6">
            {/* Basic Information */}
            <section
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                backgroundColor: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
                boxShadow: "var(--admin-shadow-sm)",
              }}
            >
              <div className="mb-6">
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: HEADING_COLOR,
                  }}
                >
                  Basic Information
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Add the category name and image used by your store.
                </p>
              </div>

              <div className="space-y-5">
                {/* Category Name */}
                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Category Name
                  </label>

                  <input
                    id="category-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="e.g. Arduino"
                    className="h-11 w-full rounded-xl border bg-transparent px-3.5 text-sm outline-none transition-all focus:ring-2"
                    style={{
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                      ["--tw-ring-color" as string]:
                        "rgba(89,33,199,0.20)",
                    }}
                  />
                </div>

                {/* Slug */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="category-slug"
                      className="block text-sm font-semibold"
                      style={{
                        color: "var(--admin-text-secondary)",
                      }}
                    >
                      Slug
                    </label>

                    {slugEdited && (
                      <button
                        type="button"
                        onClick={() => {
                          setSlugEdited(false);

                          setForm((current) => ({
                            ...current,
                            slug: slugify(current.name),
                          }));
                        }}
                        className="text-xs font-semibold"
                        style={{
                          color: "var(--admin-primary-light)",
                        }}
                      >
                        Generate automatically
                      </button>
                    )}
                  </div>

                  <input
                    id="category-slug"
                    type="text"
                    value={form.slug}
                    onChange={(event) =>
                      handleSlugChange(event.target.value)
                    }
                    placeholder="arduino"
                    className="h-11 w-full rounded-xl border bg-transparent px-3.5 text-sm outline-none transition-all focus:ring-2"
                    style={{
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                      ["--tw-ring-color" as string]:
                        "rgba(89,33,199,0.20)",
                    }}
                  />

                  <p
                    className="mt-1.5 text-xs"
                    style={{
                      color: "var(--admin-text-subtle)",
                    }}
                  >
                    Used in your store URL.
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Category Image
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {!selectedImage ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-all hover:border-[var(--admin-primary)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      style={{
                        borderColor: "var(--admin-border-strong)",
                      }}
                    >
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-xl border"
                        style={{
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-primary-light)",
                        }}
                      >
                        <Upload className="h-5 w-5" />
                      </span>

                      <span
                        className="mt-4 text-sm font-semibold"
                        style={{
                          color: "var(--admin-text)",
                        }}
                      >
                        Upload Category Image
                      </span>

                      <span
                        className="mt-1 text-xs"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        PNG, JPG, WEBP or GIF · Max 5 MB
                      </span>
                    </button>
                  ) : (
                    <div
                      className="rounded-2xl border p-3"
                      style={{
                        borderColor: "var(--admin-border)",
                        backgroundColor: "var(--admin-surface-2)",
                      }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div
                          className="aspect-square w-full overflow-hidden rounded-xl border sm:h-28 sm:w-28 sm:shrink-0"
                          style={{
                            borderColor: "var(--admin-border)",
                            backgroundColor: "var(--admin-bg)",
                          }}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Category preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{
                              color: "var(--admin-text)",
                            }}
                          >
                            {selectedImage.name}
                          </p>

                          <p
                            className="mt-1 text-xs"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                fileInputRef.current?.click()
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold"
                              style={{
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-text-secondary)",
                              }}
                            >
                              <Upload className="h-3.5 w-3.5" />
                              Replace
                            </button>

                            <button
                              type="button"
                              onClick={removeImage}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold"
                              style={{
                                borderColor:
                                  "color-mix(in srgb, var(--admin-danger) 25%, var(--admin-border))",
                                color: "var(--admin-danger)",
                              }}
                            >
                              <X className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <p
                      className="mt-2 text-xs font-medium"
                      style={{
                        color: "var(--admin-danger)",
                      }}
                    >
                      {imageError}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Category Settings */}
            <section
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                backgroundColor: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
                boxShadow: "var(--admin-shadow-sm)",
              }}
            >
              <div className="mb-6">
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: HEADING_COLOR,
                  }}
                >
                  Category Settings
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Control visibility and category ordering.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Sort Order */}
                <div>
                  <label
                    htmlFor="sort-order"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Sort Order
                  </label>

                  <input
                    id="sort-order"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={form.sortOrder}
                    onChange={(event) =>
                      handleSortOrderChange(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border bg-transparent px-3.5 text-sm outline-none transition-all focus:ring-2"
                    style={{
                      borderColor:
                        sortOrderTaken || sortOrderCheckError
                          ? "var(--admin-danger)"
                          : "var(--admin-border)",
                      color: "var(--admin-text)",
                      ["--tw-ring-color" as string]:
                        "rgba(89,33,199,0.20)",
                    }}
                  />

                  {checkingSortOrder ? (
                    <p
                      className="mt-1.5 flex items-center gap-1.5 text-xs"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Checking sort order...
                    </p>
                  ) : sortOrderTaken ? (
                    <p
                      className="mt-1.5 text-xs font-medium"
                      style={{
                        color: "var(--admin-danger)",
                      }}
                    >
                      This sort order is already taken by another category.
                    </p>
                  ) : sortOrderCheckError ? (
                    <p
                      className="mt-1.5 text-xs font-medium"
                      style={{
                        color: "var(--admin-danger)",
                      }}
                    >
                      {sortOrderCheckError}
                    </p>
                  ) : (
                    <p
                      className="mt-1.5 text-xs"
                      style={{
                        color: "var(--admin-text-subtle)",
                      }}
                    >
                      Lower numbers appear first.
                    </p>
                  )}
                </div>

                {/* Visibility */}
                <div>
                  <p
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Visibility
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      updateField("isActive", !form.isActive)
                    }
                    className="flex min-h-11 w-full items-center justify-between rounded-xl border px-3.5 transition-colors"
                    style={{
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg border"
                        style={{
                          borderColor: form.isActive
                            ? "color-mix(in srgb, var(--admin-success) 28%, var(--admin-border))"
                            : "var(--admin-border)",
                          color: form.isActive
                            ? "var(--admin-success)"
                            : "var(--admin-text-muted)",
                        }}
                      >
                        {form.isActive ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </span>

                      <div className="text-left">
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: "var(--admin-text)",
                          }}
                        >
                          {form.isActive ? "Active" : "Inactive"}
                        </p>

                        <p
                          className="text-xs"
                          style={{
                            color: "var(--admin-text-muted)",
                          }}
                        >
                          {form.isActive
                            ? "Visible in the store"
                            : "Hidden from the store"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        form.isActive
                          ? "bg-[#5921c7]"
                          : "bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          form.isActive ? "left-6" : "left-1"
                        }`}
                      />
                    </span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Preview + Create Action */}
          <aside className="min-w-0">
            <div
              className="rounded-2xl border p-4 sm:p-5"
              style={{
                backgroundColor: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
                boxShadow: "var(--admin-shadow-sm)",
              }}
            >
              <div className="mb-4">
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: HEADING_COLOR,
                  }}
                >
                  Category Preview
                </p>
              </div>

              <div
                className="overflow-hidden rounded-2xl border"
                style={{
                  borderColor: "var(--admin-border)",
                  backgroundColor: "var(--admin-surface-2)",
                }}
              >
                <div className="p-3">
                  <div
                    className="aspect-square w-full overflow-hidden rounded-xl border"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-bg)",
                    }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={previewName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <FolderTree
                          className="h-8 w-8"
                          style={{
                            color: "var(--admin-text-subtle)",
                          }}
                        />

                        <p
                          className="mt-2 text-xs"
                          style={{
                            color: "var(--admin-text-muted)",
                          }}
                        >
                          Category image
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        className="truncate text-lg font-bold"
                        style={{
                          color: HEADING_COLOR,
                        }}
                      >
                        {previewName}
                      </h3>

                      <p
                        className="mt-0.5 truncate text-xs"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        /{previewSlug}
                      </p>
                    </div>

                    <span
                      className="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                      style={{
                        borderColor: form.isActive
                          ? "color-mix(in srgb, var(--admin-success) 22%, var(--admin-border))"
                          : "var(--admin-border)",
                        color: form.isActive
                          ? "var(--admin-success)"
                          : "var(--admin-text-muted)",
                      }}
                    >
                      {form.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div
                    className="mt-4 border-t pt-3"
                    style={{
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Sort Order
                      </span>

                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--admin-text)",
                        }}
                      >
                        {form.sortOrder || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Category button below preview */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCreate}
                disabled={saving || categoryAdded || !isValid}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                style={{
                  backgroundColor: categoryAdded
                    ? "var(--admin-success)"
                    : "var(--admin-primary)",
                  boxShadow: categoryAdded
                    ? "0 8px 22px rgba(7,136,91,0.16)"
                    : "0 8px 22px rgba(89,33,199,0.20)",
                }}
              >
                {categoryAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    Category Added
                  </>
                ) : saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Creating Category...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Category
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}