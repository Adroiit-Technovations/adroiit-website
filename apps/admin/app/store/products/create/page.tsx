
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Image as ImageIcon,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Save,
  ShoppingCart,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_BUCKET = "product-images";
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const MIN_SPEC_COLUMNS = 1;
const MAX_SPEC_COLUMNS = 8;
const MIN_SPEC_ROWS = 1;
const MAX_SPEC_ROWS = 20;

type Category = {
  id: string;
  name: string;
};

type ImageInput = {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
};

type TechnicalSpecifications = {
  columns: string[];
  rows: string[][];
};

type FormData = {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  description: string;
  productDetails: string;
  price: string;
  compareAtPrice: string;
  costPrice: string;
  stockQuantity: string;
  lowStockThreshold: string;
  isActive: boolean;
  isFeatured: boolean;
};

const initialForm: FormData = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  description: "",
  productDetails: "",
  price: "",
  compareAtPrice: "",
  costPrice: "",
  stockQuantity: "0",
  lowStockThreshold: "5",
  isActive: true,
  isFeatured: false,
};

const initialSpecifications: TechnicalSpecifications = {
  columns: ["Specification", "Details"],
  rows: [["", ""]],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "webp"
  ) {
    return extension;
  }

  return "jpg";
}

function createEmptyRow(columnCount: number) {
  return Array.from({ length: columnCount }, () => "");
}

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const keywordInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormData>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageInput[]>([]);

  const [technicalSpecifications, setTechnicalSpecifications] =
    useState<TechnicalSpecifications>(initialSpecifications);

  // Keywords
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [saving, setSaving] = useState(false);
  const [productAdded, setProductAdded] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [previewQuantity, setPreviewQuantity] = useState(1);

  const generatedSlug = useMemo(() => {
    return slugify(form.name);
  }, [form.name]);

  useEffect(() => {
    loadCategories();

    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCategories() {
    setLoadingCategories(true);

    const { data, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("name", {
        ascending: true,
      });

    if (categoryError) {
      setError(categoryError.message);
      setLoadingCategories(false);
      return;
    }

    setCategories(data ?? []);
    setLoadingCategories(false);
  }

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  /* =========================================================
     PRODUCT DETAILS
     ========================================================= */

  function handleProductDetailsKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key !== " ") {
      return;
    }

    const textarea = event.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    if (selectionStart !== selectionEnd) {
      return;
    }

    const beforeCursor = value.slice(0, selectionStart);
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const currentLine = beforeCursor.slice(lineStart);

    if (!/^\s*\*$/.test(currentLine)) {
      return;
    }

    event.preventDefault();

    const starIndex = selectionStart - 1;

    const nextValue =
      value.slice(0, starIndex) +
      "• " +
      value.slice(selectionStart);

    setForm((current) => ({
      ...current,
      productDetails: nextValue,
    }));

    setError("");
    setSuccess("");

    requestAnimationFrame(() => {
      const nextCaretPosition = selectionStart + 1;

      textarea.selectionStart = nextCaretPosition;
      textarea.selectionEnd = nextCaretPosition;
    });
  }

  /* =========================================================
     TECHNICAL SPECIFICATIONS
     ========================================================= */

  function updateSpecificationColumn(
    columnIndex: number,
    value: string
  ) {
    setTechnicalSpecifications((current) => ({
      ...current,
      columns: current.columns.map((column, index) =>
        index === columnIndex ? value : column
      ),
    }));

    setError("");
    setSuccess("");
  }

  function updateSpecificationCell(
    rowIndex: number,
    columnIndex: number,
    value: string
  ) {
    setTechnicalSpecifications((current) => ({
      ...current,
      rows: current.rows.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex
          ? row.map((cell, currentColumnIndex) =>
              currentColumnIndex === columnIndex
                ? value
                : cell
            )
          : row
      ),
    }));

    setError("");
    setSuccess("");
  }

  function addSpecificationColumn() {
    setTechnicalSpecifications((current) => {
      if (current.columns.length >= MAX_SPEC_COLUMNS) {
        return current;
      }

      return {
        columns: [
          ...current.columns,
          `Column ${current.columns.length + 1}`,
        ],
        rows: current.rows.map((row) => [
          ...row,
          "",
        ]),
      };
    });
  }

  function removeSpecificationColumn(columnIndex: number) {
    setTechnicalSpecifications((current) => {
      if (current.columns.length <= MIN_SPEC_COLUMNS) {
        return current;
      }

      return {
        columns: current.columns.filter(
          (_, index) => index !== columnIndex
        ),
        rows: current.rows.map((row) =>
          row.filter((_, index) => index !== columnIndex)
        ),
      };
    });
  }

  function addSpecificationRow() {
    setTechnicalSpecifications((current) => {
      if (current.rows.length >= MAX_SPEC_ROWS) {
        return current;
      }

      return {
        ...current,
        rows: [
          ...current.rows,
          createEmptyRow(current.columns.length),
        ],
      };
    });
  }

  function removeSpecificationRow(rowIndex: number) {
    setTechnicalSpecifications((current) => {
      if (current.rows.length <= MIN_SPEC_ROWS) {
        return current;
      }

      return {
        ...current,
        rows: current.rows.filter(
          (_, index) => index !== rowIndex
        ),
      };
    });
  }

  /* =========================================================
     KEYWORDS
     ========================================================= */

  function addKeywords(value: string) {
    const newKeywords = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (!newKeywords.length) {
      return;
    }

    setKeywords((current) => {
      const existing = new Set(
        current.map((keyword) => keyword.toLowerCase())
      );

      const uniqueKeywords = newKeywords.filter((keyword) => {
        const normalized = keyword.toLowerCase();

        if (existing.has(normalized)) {
          return false;
        }

        existing.add(normalized);
        return true;
      });

      return [...current, ...uniqueKeywords];
    });

    setKeywordInput("");
    setError("");
    setSuccess("");
  }

  function handleKeywordKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addKeywords(keywordInput);
    }

    if (
      event.key === "Backspace" &&
      !keywordInput &&
      keywords.length > 0
    ) {
      setKeywords((current) => current.slice(0, -1));
    }
  }

  function removeKeyword(index: number) {
    setKeywords((current) =>
      current.filter((_, keywordIndex) => keywordIndex !== index)
    );

    setError("");
    setSuccess("");
  }

  /* =========================================================
     IMAGE HANDLING
     ========================================================= */

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    if (!selectedFiles.length) {
      return;
    }

    setError("");

    const availableSlots = MAX_IMAGES - images.length;

    if (availableSlots <= 0) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      );

      event.target.value = "";
      return;
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots);

    const invalidFile = filesToAdd.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError(
        `"${invalidFile.name}" is not a supported image file.`
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = filesToAdd.find(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" is larger than 5 MB.`
      );

      event.target.value = "";
      return;
    }

    const newImages: ImageInput[] = filesToAdd.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      altText: form.name || "",
    }));

    setImages((current) => [
      ...current,
      ...newImages,
    ]);

    event.target.value = "";
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  }

  function updateImageAlt(id: string, value: string) {
    setImages((current) =>
      current.map((image) =>
        image.id === id
          ? {
              ...image,
              altText: value,
            }
          : image
      )
    );
  }

  async function uploadProductImages(productId: string) {
    if (!images.length) {
      return;
    }

    const uploadedRows: Array<{
      product_id: string;
      image_url: string;
      alt_text: string | null;
      sort_order: number;
    }> = [];

    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const extension = getFileExtension(image.file);

      const filePath = `${productId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, image.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.file.type,
        });

      if (uploadError) {
        throw new Error(
          `Failed to upload "${image.file.name}": ${uploadError.message}`
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      uploadedRows.push({
        product_id: productId,
        image_url: publicUrlData.publicUrl,
        alt_text:
          image.altText.trim() ||
          form.name.trim() ||
          null,
        sort_order: index,
      });
    }

    const { error: imageInsertError } = await supabase
      .from("product_images")
      .insert(uploadedRows);

    if (imageInsertError) {
      throw new Error(
        `Product was created, but image records could not be saved: ${imageInsertError.message}`
      );
    }
  }

  /* =========================================================
     SUBMIT
     ========================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving || productAdded) {
      return;
    }

    setError("");
    setSuccess("");

    // Include any keyword currently being typed.
    const finalKeywords = [...keywords];
    const pendingKeywords = keywordInput
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    pendingKeywords.forEach((keyword) => {
      if (
        !finalKeywords.some(
          (existing) =>
            existing.toLowerCase() === keyword.toLowerCase()
        )
      ) {
        finalKeywords.push(keyword);
      }
    });

    const name = form.name.trim();

    if (!name) {
      setError("Product name is required.");
      return;
    }

    const price = Number(form.price);

    if (!form.price || !Number.isFinite(price) || price < 0) {
      setError("Please enter a valid selling price.");
      return;
    }

    const compareAtPrice = form.compareAtPrice.trim()
      ? Number(form.compareAtPrice)
      : null;

    if (
      compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)
    ) {
      setError("Please enter a valid compare-at price.");
      return;
    }

    const costPrice = Number(form.costPrice || 0);

    if (!Number.isFinite(costPrice) || costPrice < 0) {
      setError("Please enter a valid cost price.");
      return;
    }

    const stockQuantity = Number(form.stockQuantity || 0);

    if (
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      setError("Initial stock must be a whole number.");
      return;
    }

    const lowStockThreshold = Number(
      form.lowStockThreshold || 0
    );

    if (
      !Number.isInteger(lowStockThreshold) ||
      lowStockThreshold < 0
    ) {
      setError("Low stock threshold must be a whole number.");
      return;
    }

    setSaving(true);

    try {
      const baseSlug = generatedSlug || slugify(name);
      let finalSlug = baseSlug;

      const { data: existingSlug } = await supabase
        .from("products")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (existingSlug) {
        finalSlug = `${baseSlug}-${crypto
          .randomUUID()
          .slice(0, 8)}`;
      }

      const sku = form.sku.trim() || null;

      if (sku) {
        const { data: existingSku } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .maybeSingle();

        if (existingSku) {
          throw new Error(
            "A product with this SKU already exists."
          );
        }
      }

      const cleanedSpecifications: TechnicalSpecifications = {
        columns: technicalSpecifications.columns.map(
          (column, index) =>
            column.trim() || `Column ${index + 1}`
        ),
        rows: technicalSpecifications.rows.map((row) =>
          row.map((cell) => cell.trim())
        ),
      };

      const {
        data: createdProduct,
        error: createError,
      } = await supabase
        .from("products")
        .insert({
          name,
          slug: finalSlug,
          sku,
          category_id: form.categoryId || null,

          description: form.description.trim() || null,

          product_details: form.productDetails.trim() || null,

          technical_specifications: cleanedSpecifications,

          // Save keywords as a PostgreSQL text[] array.
          keywords: finalKeywords,

          price,
          compare_at_price: compareAtPrice,
          cost_price: costPrice,
          stock_quantity: stockQuantity,
          low_stock_threshold: lowStockThreshold,
          is_active: form.isActive,
          is_featured: form.isFeatured,
        })
        .select("id")
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      if (!createdProduct) {
        throw new Error("Product could not be created.");
      }

      if (images.length) {
        await uploadProductImages(createdProduct.id);
      }

      setProductAdded(true);

      setSuccess("Product has been added successfully.");

      window.setTimeout(() => {
        router.push(`/store/products/${createdProduct.id}`);
      }, 1800);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to create product.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  const previewPrice = Number(form.price || 0);

  return (
    <div
      className="mx-auto -mt-15 w-full max-w-[1350px] [&_h1]:!text-[#8c52ff] [&_h2]:!text-[#8c52ff] [&_h3]:!text-[#8c52ff]"
      style={{
        color: "var(--admin-text)",
      }}
    >
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/store/products"
          className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition hover:opacity-80"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            color: "var(--admin-text)",
          }}
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-2xl">
            Add New Product
          </h1>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Add a new product to your store catalog.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--admin-danger) 8%, var(--admin-surface))",
            borderColor:
              "color-mix(in srgb, var(--admin-danger) 28%, var(--admin-border))",
            color: "var(--admin-danger)",
          }}
        >
          <X size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--admin-success) 8%, var(--admin-surface))",
            borderColor:
              "color-mix(in srgb, var(--admin-success) 28%, var(--admin-border))",
            color: "var(--admin-success)",
          }}
        >
          <Check size={18} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
          {/* LEFT SIDE */}
          <div className="min-w-0 space-y-6">
            {/* Basic Information */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
              }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Basic Information
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Add the main details and images for your product.
                </p>
              </div>

              <div className="space-y-6">
                {/* PRODUCT IMAGES */}
                <div>
                  <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                      <label className="block text-sm font-semibold">
                        Product Images
                      </label>

                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Upload up to {MAX_IMAGES} images.
                        Maximum 5 MB each.
                      </p>
                    </div>

                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      {images.length}/{MAX_IMAGES}
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelection}
                    className="hidden"
                  />

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-2xl border"
                        style={{
                          backgroundColor: "var(--admin-surface-2)",
                          borderColor: "var(--admin-border)",
                        }}
                      >
                        <div className="relative mx-auto aspect-square max-w-[220px] overflow-hidden">
                          <img
                            src={image.previewUrl}
                            alt={image.altText || "Product preview"}
                            className="h-full w-full object-cover"
                          />

                          {index === 0 && (
                            <span
                              className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold"
                              style={{
                                backgroundColor: "var(--admin-primary)",
                                color: "#ffffff",
                              }}
                            >
                              <Star size={11} fill="currentColor" />
                              Primary
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            aria-label="Remove image"
                            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg transition hover:opacity-80"
                            style={{
                              backgroundColor: "rgba(0,0,0,0.72)",
                              color: "#ffffff",
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="border-t p-3">
                          <p
                            className="mb-2 truncate text-[11px] font-medium"
                            style={{
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            {image.file.name}
                          </p>

                          <p
                            className="mb-2 text-[10px]"
                            style={{
                              color: "var(--admin-text-subtle)",
                            }}
                          >
                            {formatFileSize(image.file.size)}
                          </p>

                          <input
                            type="text"
                            value={image.altText}
                            onChange={(event) =>
                              updateImageAlt(image.id, event.target.value)
                            }
                            placeholder="Alt text"
                            className="h-9 w-full rounded-lg border px-3 text-xs outline-none focus:border-[var(--admin-primary)]"
                            style={{
                              backgroundColor: "var(--admin-surface)",
                              borderColor: "var(--admin-border)",
                              color: "var(--admin-text)",
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed px-5 text-center transition hover:opacity-80"
                        style={{
                          backgroundColor: "var(--admin-surface-2)",
                          borderColor: "var(--admin-border-strong)",
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        <div
                          className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: "var(--admin-purple-dark)",
                            color: "#ffffff",
                          }}
                        >
                          <Upload size={18} />
                        </div>

                        <span className="text-sm font-bold">
                          Upload Image
                        </span>

                        <span className="mt-1 text-[11px]">
                          JPG, PNG or WEBP
                        </span>
                      </button>
                    )}
                  </div>

                  {!images.length && (
                    <div
                      className="mt-3 flex items-center gap-2 text-xs"
                      style={{
                        color: "var(--admin-text-subtle)",
                      }}
                    >
                      <ImageIcon size={14} />
                      The first uploaded image will be used as the
                      primary product image.
                    </div>
                  )}
                </div>

                {/* PRODUCT NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Enter product name"
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[var(--admin-primary)]"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                {/* SKU + CATEGORY */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      SKU
                    </label>

                    <input
                      type="text"
                      value={form.sku}
                      onChange={(event) =>
                        updateField("sku", event.target.value)
                      }
                      placeholder="Optional SKU"
                      className="h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Category
                    </label>

                    <select
                      value={form.categoryId}
                      onChange={(event) =>
                        updateField("categoryId", event.target.value)
                      }
                      disabled={loadingCategories}
                      className="h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading categories..."
                          : "Select category"}
                      </option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Enter a detailed description of the product"
                    rows={6}
                    className="w-full resize-y rounded-xl border px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--admin-primary)]"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />

                  <p
                    className="mt-1.5 text-[11px]"
                    style={{
                      color: "var(--admin-text-subtle)",
                    }}
                  >
                    This description will be displayed on the public
                    product page.
                  </p>
                </div>

                {/* PRODUCT DETAILS */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Details
                  </label>

                  <textarea
                    value={form.productDetails}
                    onChange={(event) =>
                      updateField("productDetails", event.target.value)
                    }
                    onKeyDown={handleProductDetailsKeyDown}
                    placeholder={
                      "Enter product details...\n\n* First detail\n* Second detail"
                    }
                    rows={8}
                    className="w-full resize-y rounded-xl border px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--admin-primary)]"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />

                  <p
                    className="mt-1.5 text-[11px]"
                    style={{
                      color: "var(--admin-text-subtle)",
                    }}
                  >
                    Type * and press Space at the beginning of a line
                    to create a bullet point.
                  </p>
                </div>

                {/* TECHNICAL SPECIFICATIONS */}
                <section
                  className="min-w-0 overflow-hidden rounded-2xl border"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <div className="border-b p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold">
                          Technical Specifications
                        </h3>

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color: "var(--admin-text-muted)",
                          }}
                        >
                          Add product specifications using a
                          customizable table.
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className="rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                          style={{
                            backgroundColor: "var(--admin-surface)",
                            color: "var(--admin-text-muted)",
                          }}
                        >
                          {technicalSpecifications.rows.length} rows
                        </span>

                        <span
                          className="rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                          style={{
                            backgroundColor: "var(--admin-surface)",
                            color: "var(--admin-text-muted)",
                          }}
                        >
                          {technicalSpecifications.columns.length} columns
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 max-w-full overflow-hidden p-4">
                    <div className="max-w-full overflow-x-auto rounded-xl">
                      <table className="w-full min-w-[760px] table-fixed border-collapse">
                        <colgroup>
                          {technicalSpecifications.columns.map(
                            (_, columnIndex) => (
                              <col
                                key={`column-${columnIndex}`}
                                style={{
                                  width:
                                    columnIndex === 0 ? "240px" : "260px",
                                }}
                              />
                            )
                          )}

                          <col style={{ width: "54px" }} />
                        </colgroup>

                        <thead>
                          <tr>
                            {technicalSpecifications.columns.map(
                              (column, columnIndex) => (
                                <th
                                  key={`header-${columnIndex}`}
                                  className="border p-2 text-left align-top"
                                  style={{
                                    backgroundColor: "var(--admin-surface)",
                                    borderColor: "var(--admin-border)",
                                  }}
                                >
                                  <div className="min-w-0 space-y-2">
                                    <div
                                      className="text-[9px] font-semibold uppercase tracking-wider"
                                      style={{
                                        color: "var(--admin-text-subtle)",
                                      }}
                                    >
                                      Column {columnIndex + 1}
                                    </div>

                                    <div className="flex min-w-0 items-center gap-2">
                                      <input
                                        type="text"
                                        value={column}
                                        onChange={(event) =>
                                          updateSpecificationColumn(
                                            columnIndex,
                                            event.target.value
                                          )
                                        }
                                        placeholder={`Column ${columnIndex + 1}`}
                                        className="h-9 min-w-0 flex-1 rounded-lg border px-3 text-xs font-semibold outline-none focus:border-[var(--admin-primary)]"
                                        style={{
                                          backgroundColor:
                                            "var(--admin-surface-2)",
                                          borderColor:
                                            "var(--admin-border)",
                                          color: "var(--admin-text)",
                                        }}
                                      />

                                      {technicalSpecifications.columns
                                        .length > MIN_SPEC_COLUMNS && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeSpecificationColumn(
                                              columnIndex
                                            )
                                          }
                                          aria-label={`Remove column ${columnIndex + 1}`}
                                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:opacity-70"
                                          style={{
                                            color: "var(--admin-danger)",
                                          }}
                                        >
                                          <X size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </th>
                              )
                            )}

                            <th
                              className="border p-2"
                              style={{
                                backgroundColor: "var(--admin-surface)",
                                borderColor: "var(--admin-border)",
                              }}
                            />
                          </tr>
                        </thead>

                        <tbody>
                          {technicalSpecifications.rows.map(
                            (row, rowIndex) => (
                              <tr key={`row-${rowIndex}`}>
                                {technicalSpecifications.columns.map(
                                  (_, columnIndex) => (
                                    <td
                                      key={`cell-${rowIndex}-${columnIndex}`}
                                      className="border p-2 align-top"
                                      style={{
                                        borderColor: "var(--admin-border)",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        value={row[columnIndex] ?? ""}
                                        onChange={(event) =>
                                          updateSpecificationCell(
                                            rowIndex,
                                            columnIndex,
                                            event.target.value
                                          )
                                        }
                                        placeholder="Enter value"
                                        className="h-10 w-full min-w-0 rounded-lg border px-3 text-xs outline-none focus:border-[var(--admin-primary)]"
                                        style={{
                                          backgroundColor:
                                            "var(--admin-surface)",
                                          borderColor:
                                            "var(--admin-border)",
                                          color: "var(--admin-text)",
                                        }}
                                      />
                                    </td>
                                  )
                                )}

                                <td
                                  className="border p-1 text-center align-middle"
                                  style={{
                                    borderColor: "var(--admin-border)",
                                  }}
                                >
                                  {technicalSpecifications.rows.length >
                                    MIN_SPEC_ROWS && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSpecificationRow(rowIndex)
                                      }
                                      aria-label={`Remove row ${rowIndex + 1}`}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition hover:opacity-70"
                                      style={{
                                        color: "var(--admin-danger)",
                                      }}
                                    >
                                      <Minus size={14} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    className="flex flex-wrap items-center justify-between gap-3 border-t p-4"
                    style={{
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={addSpecificationRow}
                        disabled={
                          technicalSpecifications.rows.length >=
                          MAX_SPEC_ROWS
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                          backgroundColor: "var(--admin-surface)",
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text)",
                        }}
                      >
                        <Plus size={14} />
                        Add Row
                      </button>

                      <button
                        type="button"
                        onClick={addSpecificationColumn}
                        disabled={
                          technicalSpecifications.columns.length >=
                          MAX_SPEC_COLUMNS
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                          backgroundColor: "var(--admin-surface)",
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text)",
                        }}
                      >
                        <Plus size={14} />
                        Add Column
                      </button>
                    </div>

                    <span
                      className="text-[10px]"
                      style={{
                        color: "var(--admin-text-subtle)",
                      }}
                    >
                      Maximum {MAX_SPEC_ROWS} rows ×{" "}
                      {MAX_SPEC_COLUMNS} columns
                    </span>
                  </div>
                </section>

                {/* =================================================
                    KEYWORDS
                    ================================================= */}
                <section
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <div className="mb-3">
                    <h3 className="text-sm font-bold">
                      Keywords
                    </h3>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Add relevant keywords to help identify and
                      categorize your product.
                    </p>
                  </div>

                  {/* Keyword Input */}
                  <div className="flex items-center gap-2">
                    <input
                      ref={keywordInputRef}
                      type="text"
                      value={keywordInput}
                      onChange={(event) =>
                        setKeywordInput(event.target.value)
                      }
                      onKeyDown={handleKeywordKeyDown}
                      placeholder="Enter a keyword and press Enter"
                      className="h-11 min-w-0 flex-1 rounded-xl border px-4 text-sm outline-none transition focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-surface)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => addKeywords(keywordInput)}
                      disabled={!keywordInput.trim()}
                      className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{
                        backgroundColor: "var(--admin-primary)",
                        color: "#ffffff",
                      }}
                    >
                      <Plus size={15} />
                      Add
                    </button>
                  </div>

                  <p
                    className="mt-2 text-[10px]"
                    style={{
                      color: "var(--admin-text-subtle)",
                    }}
                  >
                    Press Enter or comma to add a keyword. Duplicate
                    keywords are automatically ignored.
                  </p>

                  {/* Keyword Tags */}
                  {keywords.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className="text-[11px] font-semibold"
                          style={{
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          Added Keywords
                        </span>

                        <span
                          className="text-[10px] font-medium"
                          style={{
                            color: "var(--admin-text-subtle)",
                          }}
                        >
                          {keywords.length} keywords
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <span
                            key={`${keyword}-${index}`}
                            className="inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"
                            style={{
                              backgroundColor: "var(--admin-surface)",
                              borderColor: "var(--admin-border)",
                              color: "var(--admin-text)",
                            }}
                          >
                            <span className="break-all">
                              {keyword}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeKeyword(index)}
                              aria-label={`Remove keyword ${keyword}`}
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded transition hover:opacity-60"
                              style={{
                                color: "var(--admin-danger)",
                              }}
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {keywords.length === 0 && (
                    <div
                      className="mt-3 rounded-xl border border-dashed p-4 text-center text-xs"
                      style={{
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text-subtle)",
                      }}
                    >
                      No keywords added yet.
                    </div>
                  )}
                </section>
              </div>
            </section>

            {/* Pricing */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
              }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Pricing
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Set the selling price, comparison price and product
                  cost.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Selling Price
                  </label>

                  <div className="relative">
                    <span
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border pl-9 pr-4 text-sm outline-none focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Compare-at Price
                  </label>

                  <div className="relative">
                    <span
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.compareAtPrice}
                      onChange={(event) =>
                        updateField(
                          "compareAtPrice",
                          event.target.value
                        )
                      }
                      placeholder="Optional"
                      className="h-11 w-full rounded-xl border pl-9 pr-4 text-sm outline-none focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Cost Price
                  </label>

                  <div className="relative">
                    <span
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.costPrice}
                      onChange={(event) =>
                        updateField("costPrice", event.target.value)
                      }
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border pl-9 pr-4 text-sm outline-none focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-surface-2)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Inventory */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
              }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Inventory
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Configure the initial stock quantity and low-stock
                  alert.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Initial Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stockQuantity}
                    onChange={(event) =>
                      updateField("stockQuantity", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none focus:border-[var(--admin-primary)]"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Low Stock Threshold
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.lowStockThreshold}
                    onChange={(event) =>
                      updateField(
                        "lowStockThreshold",
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none focus:border-[var(--admin-primary)]"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <aside className="min-w-0">
            <div className="space-y-5">
              {/* Product Preview */}
              <section>
                <div className="mb-3">
                  <h2 className="text-lg font-bold">
                    Product Preview
                  </h2>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Preview how the product card will appear.
                  </p>
                </div>

                <div
                  className="mx-auto w-full max-w-[350px] overflow-hidden rounded-3xl border"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <div className="p-3">
                    <div
                      className="aspect-square w-full overflow-hidden rounded-2xl border"
                      style={{
                        backgroundColor: "var(--admin-surface)",
                        borderColor: "var(--admin-border)",
                      }}
                    >
                      {images[0] ? (
                        <img
                          src={images[0].previewUrl}
                          alt={
                            images[0].altText ||
                            form.name ||
                            "Product preview"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full flex-col items-center justify-center gap-2"
                          style={{
                            color: "var(--admin-text-subtle)",
                          }}
                        >
                          <ImageIcon size={30} strokeWidth={1.5} />
                          <span className="text-xs">
                            Product image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1">
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h3 className="min-w-0 text-base font-bold leading-5">
                        {form.name || "Product Name"}
                      </h3>

                      {form.isFeatured && (
                        <Star
                          size={15}
                          fill="currentColor"
                          className="mt-0.5 shrink-0"
                          style={{
                            color: "var(--admin-yellow)",
                          }}
                        />
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                          {formatPrice(previewPrice)}
                        </span>

                        {Number(form.compareAtPrice) > previewPrice &&
                          Number(form.compareAtPrice) > 0 && (
                            <span
                              className="text-xs line-through"
                              style={{
                                color: "var(--admin-text-subtle)",
                              }}
                            >
                              {formatPrice(
                                Number(form.compareAtPrice)
                              )}
                            </span>
                          )}
                      </div>

                      <p
                        className="mt-0.5 text-[10px]"
                        style={{
                          color: "var(--admin-text-subtle)",
                        }}
                      >
                        Inc. Taxes
                      </p>
                    </div>

                    <div className="mt-4">
                      <p
                        className="mb-2 text-xs font-semibold"
                        style={{
                          color: "var(--admin-text-secondary)",
                        }}
                      >
                        Quantity
                      </p>

                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-10 shrink-0 items-center overflow-hidden rounded-xl border"
                          style={{
                            backgroundColor: "var(--admin-surface)",
                            borderColor: "var(--admin-border)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewQuantity((current) =>
                                Math.max(1, current - 1)
                              )
                            }
                            className="flex h-full w-9 items-center justify-center transition hover:opacity-70"
                            style={{
                              color: "var(--admin-text)",
                            }}
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-[30px] text-center text-sm font-semibold">
                            {previewQuantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setPreviewQuantity(
                                (current) => current + 1
                              )
                            }
                            className="flex h-full w-9 items-center justify-center transition hover:opacity-70"
                            style={{
                              color: "var(--admin-text)",
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold transition hover:opacity-90"
                          style={{
                            backgroundColor: "var(--admin-primary)",
                            color: "#ffffff",
                          }}
                        >
                          <ShoppingCart size={14} />
                          <span className="truncate">
                            Add to Cart
                          </span>
                        </button>
                      </div>
                    </div>

                    <div
                      className="mt-3 flex items-center gap-2 text-[10px]"
                      style={{
                        color: "var(--admin-text-subtle)",
                      }}
                    >
                      <Package size={12} />

                      {form.stockQuantity
                        ? `${form.stockQuantity} units available`
                        : "Stock quantity not set"}
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Settings */}
              <section
                className="rounded-3xl border p-4"
                style={{
                  backgroundColor: "var(--admin-surface)",
                  borderColor: "var(--admin-border)",
                }}
              >
                <div className="mb-4">
                  <h2 className="text-base font-bold">
                    Product Settings
                  </h2>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Control visibility and featured placement.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Active */}
                  <button
                    type="button"
                    onClick={() =>
                      updateField("isActive", !form.isActive)
                    }
                    className="flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="pr-3">
                      <div className="text-sm font-bold">
                        Active Product
                      </div>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Make this product visible in the store.
                      </p>
                    </div>

                    <div
                      className="relative h-6 w-11 shrink-0 rounded-full transition"
                      style={{
                        backgroundColor: form.isActive
                          ? "var(--admin-primary)"
                          : "var(--admin-border-strong)",
                      }}
                    >
                      <span
                        className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
                        style={{
                          left: form.isActive ? "22px" : "4px",
                        }}
                      />
                    </div>
                  </button>

                  {/* Featured */}
                  <button
                    type="button"
                    onClick={() =>
                      updateField("isFeatured", !form.isFeatured)
                    }
                    className="flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition"
                    style={{
                      backgroundColor: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <div className="pr-3">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        Featured Product

                        <Star
                          size={14}
                          style={{
                            color: "var(--admin-yellow)",
                          }}
                        />
                      </div>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Highlight this product in featured sections.
                      </p>
                    </div>

                    <div
                      className="relative h-6 w-11 shrink-0 rounded-full transition"
                      style={{
                        backgroundColor: form.isFeatured
                          ? "var(--admin-primary)"
                          : "var(--admin-border-strong)",
                      }}
                    >
                      <span
                        className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
                        style={{
                          left: form.isFeatured ? "22px" : "4px",
                        }}
                      />
                    </div>
                  </button>
                </div>
              </section>

              {/* Create Product */}
              <button
                type="submit"
                disabled={saving || productAdded}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition hover:opacity-90 disabled:cursor-default disabled:opacity-100"
                style={{
                  backgroundColor: productAdded
                    ? "var(--admin-success)"
                    : "var(--admin-primary)",
                  color: "#ffffff",
                }}
              >
                {productAdded ? (
                  <>
                    <Check size={19} />
                    Product Added
                  </>
                ) : saving ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
