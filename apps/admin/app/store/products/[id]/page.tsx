"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Image as ImageIcon,
  IndianRupee,
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
  useCallback,
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

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

type NewImage = {
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

const emptyForm: FormData = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  description: "",
  productDetails: "",
  price: "",
  compareAtPrice: "",
  costPrice: "0",
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(
    Number.isFinite(value) ? value : 0
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
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

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    url.slice(index + marker.length)
  );
}

function createEmptyRow(columnCount: number) {
  return Array.from({ length: columnCount }, () => "");
}

function normalizeTechnicalSpecifications(
  value: unknown
): TechnicalSpecifications {
  if (!value || typeof value !== "object") {
    return initialSpecifications;
  }

  const specification =
    value as Partial<TechnicalSpecifications>;

  const columns = Array.isArray(
    specification.columns
  )
    ? specification.columns
        .filter(
          (column): column is string =>
            typeof column === "string"
        )
        .slice(0, MAX_SPEC_COLUMNS)
    : [];

  const safeColumns =
    columns.length >= MIN_SPEC_COLUMNS
      ? columns
      : initialSpecifications.columns;

  const rows = Array.isArray(
    specification.rows
  )
    ? specification.rows
        .filter(
          (row): row is unknown[] =>
            Array.isArray(row)
        )
        .slice(0, MAX_SPEC_ROWS)
        .map((row) =>
          safeColumns.map(
            (_, columnIndex) =>
              typeof row[columnIndex] ===
              "string"
                ? row[columnIndex]
                : ""
          )
        )
    : [];

  return {
    columns: safeColumns,
    rows:
      rows.length >= MIN_SPEC_ROWS
        ? rows
        : [
            createEmptyRow(
              safeColumns.length
            ),
          ],
  };
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const router = useRouter();
  const supabase = createClient();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const productDetailsRef =
    useRef<HTMLTextAreaElement | null>(null);

  const newImagesRef =
    useRef<NewImage[]>([]);

  const [form, setForm] =
    useState<FormData>(emptyForm);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [existingImages, setExistingImages] =
    useState<ProductImage[]>([]);

  const [newImages, setNewImages] =
    useState<NewImage[]>([]);

  const [
    technicalSpecifications,
    setTechnicalSpecifications,
  ] = useState<TechnicalSpecifications>(
    initialSpecifications
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [previewQuantity, setPreviewQuantity] =
    useState(1);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      newImagesRef.current.forEach(
        (image) => {
          URL.revokeObjectURL(
            image.previewUrl
          );
        }
      );
    };
  }, []);

  const loadProduct = useCallback(async () => {
    if (!productId) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const [
      {
        data: product,
        error: productError,
      },
      {
        data: imageData,
        error: imageError,
      },
      {
        data: categoryData,
        error: categoryError,
      },
    ] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id, name, slug, sku, category_id, description, product_details, technical_specifications, price, compare_at_price, cost_price, stock_quantity, low_stock_threshold, is_active, is_featured"
        )
        .eq("id", productId)
        .maybeSingle(),

      supabase
        .from("product_images")
        .select(
          "id, product_id, image_url, alt_text, sort_order, created_at"
        )
        .eq("product_id", productId)
        .order("sort_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        })
        .order("name", {
          ascending: true,
        }),
    ]);

    if (productError) {
      setError(productError.message);
      setLoading(false);
      return;
    }

    if (imageError) {
      setError(imageError.message);
      setLoading(false);
      return;
    }

    if (categoryError) {
      setError(categoryError.message);
      setLoading(false);
      return;
    }

    if (!product) {
      setError("Product could not be found.");
      setLoading(false);
      return;
    }

    setForm({
      name: product.name ?? "",
      slug: product.slug ?? "",
      sku: product.sku ?? "",
      categoryId: product.category_id ?? "",
      description: product.description ?? "",
      productDetails:
        product.product_details ?? "",
      price:
        product.price !== null &&
        product.price !== undefined
          ? String(product.price)
          : "",
      compareAtPrice:
        product.compare_at_price !== null &&
        product.compare_at_price !== undefined
          ? String(
              product.compare_at_price
            )
          : "",
      costPrice:
        product.cost_price !== null &&
        product.cost_price !== undefined
          ? String(product.cost_price)
          : "0",
      stockQuantity:
        product.stock_quantity !== null &&
        product.stock_quantity !== undefined
          ? String(product.stock_quantity)
          : "0",
      lowStockThreshold:
        product.low_stock_threshold !== null &&
        product.low_stock_threshold !== undefined
          ? String(
              product.low_stock_threshold
            )
          : "5",
      isActive: Boolean(
        product.is_active
      ),
      isFeatured: Boolean(
        product.is_featured
      ),
    });

    setTechnicalSpecifications(
      normalizeTechnicalSpecifications(
        product.technical_specifications
      )
    );

    setExistingImages(
      imageData ?? []
    );

    setCategories(
      categoryData ?? []
    );

    setLoading(false);
  }, [productId, supabase]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

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
    setSaved(false);
  }

  function handleProductDetailsKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key !== " " ||
      event.shiftKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    const textarea = event.currentTarget;
    const cursorPosition =
      textarea.selectionStart;

    const beforeCursor =
      textarea.value.slice(
        0,
        cursorPosition
      );

    const lastLine =
      beforeCursor.split("\n").pop() ?? "";

    if (lastLine.trim() !== "*") {
      return;
    }

    const lineStart =
      beforeCursor.lastIndexOf("\n") + 1;

    const replacementEnd =
      cursorPosition;

    const updatedValue =
      textarea.value.slice(
        0,
        lineStart
      ) +
      "• " +
      textarea.value.slice(
        replacementEnd
      );

    event.preventDefault();

    updateField(
      "productDetails",
      updatedValue
    );

    requestAnimationFrame(() => {
      const newCursorPosition =
        lineStart + 2;

      textarea.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );
    });
  }

  function updateSpecificationColumn(
    columnIndex: number,
    value: string
  ) {
    setTechnicalSpecifications(
      (current) => ({
        ...current,
        columns:
          current.columns.map(
            (column, index) =>
              index === columnIndex
                ? value
                : column
          ),
      })
    );

    setError("");
    setSuccess("");
    setSaved(false);
  }

  function updateSpecificationCell(
    rowIndex: number,
    columnIndex: number,
    value: string
  ) {
    setTechnicalSpecifications(
      (current) => ({
        ...current,
        rows: current.rows.map(
          (
            row,
            currentRowIndex
          ) =>
            currentRowIndex === rowIndex
              ? row.map(
                  (
                    cell,
                    currentColumnIndex
                  ) =>
                    currentColumnIndex ===
                    columnIndex
                      ? value
                      : cell
                )
              : row
        ),
      })
    );

    setError("");
    setSuccess("");
    setSaved(false);
  }

  function addSpecificationColumn() {
    setTechnicalSpecifications(
      (current) => {
        if (
          current.columns.length >=
          MAX_SPEC_COLUMNS
        ) {
          return current;
        }

        return {
          columns: [
            ...current.columns,
            `Column ${
              current.columns.length + 1
            }`,
          ],
          rows: current.rows.map(
            (row) => [
              ...row,
              "",
            ]
          ),
        };
      }
    );

    setError("");
    setSuccess("");
    setSaved(false);
  }

  function removeSpecificationColumn(
    columnIndex: number
  ) {
    setTechnicalSpecifications(
      (current) => {
        if (
          current.columns.length <=
          MIN_SPEC_COLUMNS
        ) {
          return current;
        }

        return {
          columns:
            current.columns.filter(
              (_, index) =>
                index !== columnIndex
            ),
          rows: current.rows.map(
            (row) =>
              row.filter(
                (_, index) =>
                  index !== columnIndex
              )
          ),
        };
      }
    );

    setError("");
    setSuccess("");
    setSaved(false);
  }

  function addSpecificationRow() {
    setTechnicalSpecifications(
      (current) => {
        if (
          current.rows.length >=
          MAX_SPEC_ROWS
        ) {
          return current;
        }

        return {
          ...current,
          rows: [
            ...current.rows,
            createEmptyRow(
              current.columns.length
            ),
          ],
        };
      }
    );

    setError("");
    setSuccess("");
    setSaved(false);
  }

  function removeSpecificationRow(
    rowIndex: number
  ) {
    setTechnicalSpecifications(
      (current) => {
        if (
          current.rows.length <=
          MIN_SPEC_ROWS
        ) {
          return current;
        }

        return {
          ...current,
          rows: current.rows.filter(
            (_, index) =>
              index !== rowIndex
          ),
        };
      }
    );

    setError("");
    setSuccess("");
    setSaved(false);
  }

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
    setSuccess("");
    setSaved(false);

    const totalImages =
      existingImages.length +
      newImages.length;

    const availableSlots =
      MAX_IMAGES - totalImages;

    if (availableSlots <= 0) {
      setError(
        `You can have a maximum of ${MAX_IMAGES} product images.`
      );

      event.target.value = "";
      return;
    }

    const filesToAdd =
      selectedFiles.slice(
        0,
        availableSlots
      );

    const invalidFile =
      filesToAdd.find(
        (file) =>
          !file.type.startsWith(
            "image/"
          )
      );

    if (invalidFile) {
      setError(
        `"${invalidFile.name}" is not a supported image file.`
      );

      event.target.value = "";
      return;
    }

    const oversizedFile =
      filesToAdd.find(
        (file) =>
          file.size > MAX_IMAGE_SIZE
      );

    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" is larger than 5 MB.`
      );

      event.target.value = "";
      return;
    }

    const addedImages: NewImage[] =
      filesToAdd.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl:
          URL.createObjectURL(file),
        altText: form.name,
      }));

    setNewImages((current) => [
      ...current,
      ...addedImages,
    ]);

    event.target.value = "";
  }

  function removeExistingImage(
    imageId: string
  ) {
    setExistingImages((current) =>
      current.filter(
        (image) =>
          image.id !== imageId
      )
    );

    setError("");
    setSuccess("");
    setSaved(false);
  }

  function removeNewImage(
    imageId: string
  ) {
    setNewImages((current) => {
      const image = current.find(
        (item) =>
          item.id === imageId
      );

      if (image) {
        URL.revokeObjectURL(
          image.previewUrl
        );
      }

      return current.filter(
        (item) =>
          item.id !== imageId
      );
    });

    setError("");
    setSuccess("");
    setSaved(false);
  }

  function updateExistingImageAlt(
    imageId: string,
    value: string
  ) {
    setExistingImages((current) =>
      current.map((image) =>
        image.id === imageId
          ? {
              ...image,
              alt_text: value,
            }
          : image
      )
    );

    setSaved(false);
  }

  function updateNewImageAlt(
    imageId: string,
    value: string
  ) {
    setNewImages((current) =>
      current.map((image) =>
        image.id === imageId
          ? {
              ...image,
              altText: value,
            }
          : image
      )
    );

    setSaved(false);
  }

  async function uploadNewImages() {
    if (!newImages.length) {
      return;
    }

    const uploadedRows: Array<{
      product_id: string;
      image_url: string;
      alt_text: string | null;
      sort_order: number;
    }> = [];

    const startingSortOrder =
      existingImages.length;

    for (
      let index = 0;
      index < newImages.length;
      index++
    ) {
      const image =
        newImages[index];

      const extension =
        getFileExtension(
          image.file
        );

      const filePath =
        `${productId}/${crypto.randomUUID()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(
          filePath,
          image.file,
          {
            cacheControl:
              "3600",
            upsert: false,
            contentType:
              image.file.type,
          }
        );

      if (uploadError) {
        throw new Error(
          `Failed to upload "${image.file.name}": ${uploadError.message}`
        );
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(
          filePath
        );

      uploadedRows.push({
        product_id: productId,
        image_url:
          publicUrlData.publicUrl,
        alt_text:
          image.altText.trim() ||
          form.name.trim() ||
          null,
        sort_order:
          startingSortOrder +
          index,
      });
    }

    if (!uploadedRows.length) {
      return;
    }

    const {
      error: insertError,
    } = await supabase
      .from("product_images")
      .insert(
        uploadedRows
      );

    if (insertError) {
      throw new Error(
        `Images were uploaded, but image records could not be saved: ${insertError.message}`
      );
    }
  }

  async function updateImageRecords() {
    if (!existingImages.length) {
      return;
    }

    for (
      let index = 0;
      index < existingImages.length;
      index++
    ) {
      const image =
        existingImages[index];

      const {
        error: updateError,
      } = await supabase
        .from("product_images")
        .update({
          alt_text:
            image.alt_text?.trim() ||
            form.name.trim() ||
            null,
          sort_order: index,
        })
        .eq(
          "id",
          image.id
        );

      if (updateError) {
        throw new Error(
          `Failed to update image information: ${updateError.message}`
        );
      }
    }
  }

  async function deleteRemovedImages(
    originalImages: ProductImage[]
  ) {
    const currentIds =
      new Set(
        existingImages.map(
          (image) =>
            image.id
        )
      );

    const removedImages =
      originalImages.filter(
        (image) =>
          !currentIds.has(
            image.id
          )
      );

    if (!removedImages.length) {
      return;
    }

    const removedIds =
      removedImages.map(
        (image) =>
          image.id
      );

    const {
      error: deleteError,
    } = await supabase
      .from("product_images")
      .delete()
      .in(
        "id",
        removedIds
      );

    if (deleteError) {
      throw new Error(
        `Failed to remove deleted image records: ${deleteError.message}`
      );
    }

    const storagePaths =
      removedImages
        .map((image) =>
          getStoragePathFromPublicUrl(
            image.image_url
          )
        )
        .filter(
          (
            path
          ): path is string =>
            Boolean(path)
        );

    if (storagePaths.length) {
      const {
        error: storageError,
      } = await supabase.storage
        .from(
          STORAGE_BUCKET
        )
        .remove(
          storagePaths
        );

      if (storageError) {
        console.warn(
          "Some removed image files could not be deleted:",
          storageError.message
        );
      }
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      saving ||
      deleting
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setSaved(false);

    const name =
      form.name.trim();

    if (!name) {
      setError(
        "Product name is required."
      );
      return;
    }

    const price =
      Number(form.price);

    if (
      !form.price ||
      !Number.isFinite(
        price
      ) ||
      price < 0
    ) {
      setError(
        "Please enter a valid selling price."
      );
      return;
    }

    const compareAtPrice =
      form.compareAtPrice.trim()
        ? Number(
            form.compareAtPrice
          )
        : null;

    if (
      compareAtPrice !== null &&
      (!Number.isFinite(
        compareAtPrice
      ) ||
        compareAtPrice < 0)
    ) {
      setError(
        "Please enter a valid compare-at price."
      );
      return;
    }

    const costPrice =
      Number(
        form.costPrice || 0
      );

    if (
      !Number.isFinite(
        costPrice
      ) ||
      costPrice < 0
    ) {
      setError(
        "Please enter a valid cost price."
      );
      return;
    }

    const stockQuantity =
      Number(
        form.stockQuantity || 0
      );

    if (
      !Number.isInteger(
        stockQuantity
      ) ||
      stockQuantity < 0
    ) {
      setError(
        "Stock quantity must be a whole number."
      );
      return;
    }

    const lowStockThreshold =
      Number(
        form.lowStockThreshold ||
          0
      );

    if (
      !Number.isInteger(
        lowStockThreshold
      ) ||
      lowStockThreshold < 0
    ) {
      setError(
        "Low stock threshold must be a whole number."
      );
      return;
    }

    setSaving(true);

    try {
      const originalImages =
        [...existingImages];

      let finalSlug =
        form.slug.trim() ||
        slugify(name);

      if (!finalSlug) {
        finalSlug =
          `product-${crypto.randomUUID().slice(0, 8)}`;
      }

      const {
        data: conflictingSlug,
      } = await supabase
        .from("products")
        .select("id")
        .eq(
          "slug",
          finalSlug
        )
        .neq(
          "id",
          productId
        )
        .maybeSingle();

      if (conflictingSlug) {
        finalSlug =
          `${finalSlug}-${crypto.randomUUID().slice(0, 8)}`;
      }

      const sku =
        form.sku.trim() ||
        null;

      if (sku) {
        const {
          data: conflictingSku,
        } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .neq(
            "id",
            productId
          )
          .maybeSingle();

        if (conflictingSku) {
          throw new Error(
            "A product with this SKU already exists."
          );
        }
      }

      const cleanedSpecifications: TechnicalSpecifications =
        {
          columns:
            technicalSpecifications.columns.map(
              (column) =>
                column.trim()
            ),
          rows:
            technicalSpecifications.rows.map(
              (row) =>
                row.map(
                  (cell) =>
                    cell.trim()
                )
            ),
        };

      const {
        error: updateError,
      } = await supabase
        .from("products")
        .update({
          name,
          slug: finalSlug,
          sku,
          category_id:
            form.categoryId ||
            null,
          description:
            form.description.trim() ||
            null,
          product_details:
            form.productDetails.trim() ||
            null,
          technical_specifications:
            cleanedSpecifications,
          price,
          compare_at_price:
            compareAtPrice,
          cost_price:
            costPrice,
          stock_quantity:
            stockQuantity,
          low_stock_threshold:
            lowStockThreshold,
          is_active:
            form.isActive,
          is_featured:
            form.isFeatured,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          productId
        );

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }

      await deleteRemovedImages(
        originalImages
      );

      await updateImageRecords();

      await uploadNewImages();

      setForm(
        (current) => ({
          ...current,
          slug: finalSlug,
        })
      );

      newImagesRef.current.forEach(
        (image) => {
          URL.revokeObjectURL(
            image.previewUrl
          );
        }
      );

      setNewImages([]);

      setSaved(true);

      setSuccess(
        "Product changes have been saved successfully."
      );

      await loadProduct();
    } catch (
      submitError
    ) {
      const message =
        submitError instanceof
        Error
          ? submitError.message
          : "Unable to save product changes.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct() {
    if (
      deleting ||
      saving
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${form.name || "this product"}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const imagePaths =
        existingImages
          .map((image) =>
            getStoragePathFromPublicUrl(
              image.image_url
            )
          )
          .filter(
            (
              path
            ): path is string =>
              Boolean(path)
          );

      if (imagePaths.length) {
        const {
          error: storageError,
        } = await supabase.storage
          .from(
            STORAGE_BUCKET
          )
          .remove(
            imagePaths
          );

        if (storageError) {
          console.warn(
            "Some product image files could not be deleted:",
            storageError.message
          );
        }
      }

      const {
        error: deleteError,
      } = await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          productId
        );

      if (deleteError) {
        throw new Error(
          deleteError.message
        );
      }

      router.push(
        "/store/products"
      );

      router.refresh();
    } catch (
      deleteError
    ) {
      const message =
        deleteError instanceof
        Error
          ? deleteError.message
          : "Unable to delete product.";

      setError(message);
      setDeleting(false);
    }
  }

  const allPreviewImages =
    useMemo(
      () => [
        ...existingImages.map(
          (image) => ({
            id: image.id,
            url: image.image_url,
            alt:
              image.alt_text ||
              form.name ||
              "Product image",
          })
        ),
        ...newImages.map(
          (image) => ({
            id: image.id,
            url: image.previewUrl,
            alt:
              image.altText ||
              form.name ||
              "Product image",
          })
        ),
      ],
      [
        existingImages,
        newImages,
        form.name,
      ]
    );

  const previewImage =
    allPreviewImages[0];

  const previewPrice =
    Number(
      form.price || 0
    );

  const previewCost =
    Number(
      form.costPrice || 0
    );

  const profitPerUnit =
    Math.max(
      0,
      previewPrice -
        previewCost
    );

  const profitMargin =
    previewPrice > 0
      ? (profitPerUnit /
          previewPrice) *
        100
      : 0;

  const stockQuantity =
    Number(
      form.stockQuantity ||
        0
    );

  const inventoryValue =
    stockQuantity *
    previewCost;

  const isLowStock =
    stockQuantity <=
      Number(
        form.lowStockThreshold ||
          0
      ) &&
    stockQuantity > 0;

  const isOutOfStock =
    stockQuantity <= 0;

  if (loading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        style={{
          color:
            "var(--admin-text)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            size={24}
            className="animate-spin"
            style={{
              color:
                "var(--admin-primary)",
            }}
          />

          <p
            className="text-sm"
            style={{
              color:
                "var(--admin-text-muted)",
            }}
          >
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto -mt-15 w-full max-w-[1350px] [&_h1]:!text-[#8c52ff] [&_h2]:!text-[#8c52ff] [&_h3]:!text-[#8c52ff]"
      style={{
        color:
          "var(--admin-text)",
        position:
          "static",
        overflow:
          "visible",
      }}
    >
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/store/products"
          className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition hover:opacity-80"
          style={{
            backgroundColor:
              "var(--admin-surface)",
            borderColor:
              "var(--admin-border)",
            color:
              "var(--admin-text)",
          }}
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-2xl">
            Edit Product
          </h1>

          <p
            className="mt-1 text-sm"
            style={{
              color:
                "var(--admin-text-muted)",
            }}
          >
            Update your product
            information, images,
            pricing and inventory.
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
            color:
              "var(--admin-danger)",
          }}
        >
          <X
            size={18}
            className="mt-0.5 shrink-0"
          />

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
            color:
              "var(--admin-success)",
          }}
        >
          <Check
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div
          className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]"
          style={{
            position:
              "static",
            overflow:
              "visible",
          }}
        >
          {/* LEFT */}
          <div
            className="min-w-0 space-y-6"
            style={{
              position:
                "static",
              overflow:
                "visible",
            }}
          >
            {/* Basic Information */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
              }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Basic Information
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Update the main details
                  and images for your
                  product.
                </p>
              </div>

              <div className="space-y-5">
                {/* Images */}
                <div>
                  <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                      <label className="block text-sm font-semibold">
                        Product Images
                      </label>

                      <p
                        className="mt-1 text-xs"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        Up to{" "}
                        {MAX_IMAGES}{" "}
                        images. Maximum
                        5 MB each.
                      </p>
                    </div>

                    <span
                      className="text-xs font-semibold"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      {
                        allPreviewImages.length
                      }
                      /{MAX_IMAGES}
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleImageSelection
                    }
                    className="hidden"
                  />

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {existingImages.map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          key={
                            image.id
                          }
                          className="overflow-hidden rounded-2xl border"
                          style={{
                            backgroundColor:
                              "var(--admin-surface-2)",
                            borderColor:
                              "var(--admin-border)",
                          }}
                        >
                          <div className="relative mx-auto aspect-square max-w-[220px] overflow-hidden">
                            <img
                              src={
                                image.image_url
                              }
                              alt={
                                image.alt_text ||
                                form.name ||
                                "Product image"
                              }
                              className="h-full w-full object-cover"
                            />

                            {index ===
                              0 && (
                              <span
                                className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold"
                                style={{
                                  backgroundColor:
                                    "var(--admin-primary)",
                                  color:
                                    "#ffffff",
                                }}
                              >
                                <Star
                                  size={
                                    11
                                  }
                                  fill="currentColor"
                                />
                                Primary
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                removeExistingImage(
                                  image.id
                                )
                              }
                              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg transition hover:opacity-80"
                              style={{
                                backgroundColor:
                                  "rgba(0,0,0,0.72)",
                                color:
                                  "#ffffff",
                              }}
                              aria-label="Remove image"
                            >
                              <Trash2
                                size={
                                  13
                                }
                              />
                            </button>
                          </div>

                          <div className="border-t p-3">
                            <p
                              className="mb-2 text-[10px] font-semibold"
                              style={{
                                color:
                                  "var(--admin-text-muted)",
                              }}
                            >
                              Existing image
                            </p>

                            <input
                              type="text"
                              value={
                                image.alt_text ??
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                updateExistingImageAlt(
                                  image.id,
                                  event.target.value
                                )
                              }
                              placeholder="Alt text"
                              className="h-9 w-full rounded-lg border px-3 text-xs outline-none focus:border-[var(--admin-primary)]"
                              style={{
                                backgroundColor:
                                  "var(--admin-surface)",
                                borderColor:
                                  "var(--admin-border)",
                                color:
                                  "var(--admin-text)",
                              }}
                            />
                          </div>
                        </div>
                      )
                    )}

                    {newImages.map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          key={
                            image.id
                          }
                          className="overflow-hidden rounded-2xl border"
                          style={{
                            backgroundColor:
                              "var(--admin-surface-2)",
                            borderColor:
                              "var(--admin-border)",
                          }}
                        >
                          <div className="relative mx-auto aspect-square max-w-[220px] overflow-hidden">
                            <img
                              src={
                                image.previewUrl
                              }
                              alt={
                                image.altText ||
                                form.name ||
                                "Product image"
                              }
                              className="h-full w-full object-cover"
                            />

                            {existingImages.length ===
                              0 &&
                              index ===
                                0 && (
                                <span
                                  className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold"
                                  style={{
                                    backgroundColor:
                                      "var(--admin-primary)",
                                    color:
                                      "#ffffff",
                                  }}
                                >
                                  <Star
                                    size={
                                      11
                                    }
                                    fill="currentColor"
                                  />
                                  Primary
                                </span>
                              )}

                            <button
                              type="button"
                              onClick={() =>
                                removeNewImage(
                                  image.id
                                )
                              }
                              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg transition hover:opacity-80"
                              style={{
                                backgroundColor:
                                  "rgba(0,0,0,0.72)",
                                color:
                                  "#ffffff",
                              }}
                              aria-label="Remove image"
                            >
                              <Trash2
                                size={
                                  13
                                }
                              />
                            </button>
                          </div>

                          <div className="border-t p-3">
                            <p
                              className="mb-1 truncate text-[11px] font-medium"
                              style={{
                                color:
                                  "var(--admin-text-muted)",
                              }}
                            >
                              {
                                image.file
                                  .name
                              }
                            </p>

                            <p
                              className="mb-2 text-[10px]"
                              style={{
                                color:
                                  "var(--admin-text-subtle)",
                              }}
                            >
                              {formatFileSize(
                                image.file
                                  .size
                              )}
                            </p>

                            <input
                              type="text"
                              value={
                                image.altText
                              }
                              onChange={(
                                event
                              ) =>
                                updateNewImageAlt(
                                  image.id,
                                  event.target.value
                                )
                              }
                              placeholder="Alt text"
                              className="h-9 w-full rounded-lg border px-3 text-xs outline-none focus:border-[var(--admin-primary)]"
                              style={{
                                backgroundColor:
                                  "var(--admin-surface)",
                                borderColor:
                                  "var(--admin-border)",
                                color:
                                  "var(--admin-text)",
                              }}
                            />
                          </div>
                        </div>
                      )
                    )}

                    {allPreviewImages.length <
                      MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed px-5 text-center transition hover:opacity-80"
                        style={{
                          backgroundColor:
                            "var(--admin-surface-2)",
                          borderColor:
                            "var(--admin-border-strong)",
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        <div
                          className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor:
                              "var(--admin-purple-dark)",
                            color:
                              "#ffffff",
                          }}
                        >
                          <Upload
                            size={18}
                          />
                        </div>

                        <span className="text-sm font-bold">
                          Upload Image
                        </span>

                        <span className="mt-1 text-[11px]">
                          JPG, PNG or
                          WEBP
                        </span>
                      </button>
                    )}
                  </div>

                  {!allPreviewImages.length && (
                    <div
                      className="mt-3 flex items-center gap-2 text-xs"
                      style={{
                        color:
                          "var(--admin-text-subtle)",
                      }}
                    >
                      <ImageIcon
                        size={14}
                      />

                      No product images
                      added yet.
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Enter product name"
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[var(--admin-primary)]"
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

                {/* SKU + Category */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      SKU
                    </label>

                    <input
                      type="text"
                      value={form.sku}
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "sku",
                          event.target.value
                        )
                      }
                      placeholder="Optional SKU"
                      className="h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-[var(--admin-primary)]"
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

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Category
                    </label>

                    <select
                      value={
                        form.categoryId
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "categoryId",
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border px-4 text-sm outline-none focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor:
                          "var(--admin-surface-2)",
                        borderColor:
                          "var(--admin-border)",
                        color:
                          "var(--admin-text)",
                      }}
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Description
                  </label>

                  <textarea
                    value={
                      form.description
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Enter product description"
                    rows={5}
                    className="w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--admin-primary)]"
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

                {/* Product Details */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Details
                  </label>

                  <p
                    className="mb-2 text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Add key product details
                    as bullet points. Type{" "}
                    <span className="font-semibold">
                      *
                    </span>{" "}
                    and press Space to
                    create a bullet.
                  </p>

                  <textarea
                    ref={
                      productDetailsRef
                    }
                    value={
                      form.productDetails
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "productDetails",
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleProductDetailsKeyDown
                    }
                    placeholder={
                      "• Arduino-compatible development board\n• USB connectivity\n• Suitable for IoT projects"
                    }
                    rows={7}
                    className="w-full resize-y rounded-xl border px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--admin-primary)]"
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

                {/* Technical Specifications */}
                <section
                  className="rounded-2xl border"
                  style={{
                    backgroundColor:
                      "var(--admin-surface-2)",
                    borderColor:
                      "var(--admin-border)",
                  }}
                >
                  <div className="border-b p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold">
                          Technical Specifications
                        </h3>

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color:
                              "var(--admin-text-muted)",
                          }}
                        >
                          Add product
                          specifications
                          using a
                          customizable
                          table.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                          style={{
                            backgroundColor:
                              "var(--admin-surface)",
                            color:
                              "var(--admin-text-muted)",
                          }}
                        >
                          {
                            technicalSpecifications
                              .rows
                              .length
                          }{" "}
                          rows
                        </span>

                        <span
                          className="rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                          style={{
                            backgroundColor:
                              "var(--admin-surface)",
                            color:
                              "var(--admin-text-muted)",
                          }}
                        >
                          {
                            technicalSpecifications
                              .columns
                              .length
                          }{" "}
                          columns
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 max-w-full overflow-hidden p-4">
                    <div className="max-w-full overflow-x-auto overflow-y-hidden">
                      <table
                        className="w-max min-w-[760px] border-collapse"
                        style={{
                          tableLayout:
                            "fixed",
                        }}
                      >
                        <colgroup>
                          {technicalSpecifications.columns.map(
                            (
                              _,
                              columnIndex
                            ) => (
                              <col
                                key={`column-width-${columnIndex}`}
                                style={{
                                  width:
                                    columnIndex ===
                                    0
                                      ? "240px"
                                      : "220px",
                                }}
                              />
                            )
                          )}

                          <col
                            style={{
                              width:
                                "52px",
                            }}
                          />
                        </colgroup>

                        <thead>
                          <tr>
                            {technicalSpecifications.columns.map(
                              (
                                column,
                                columnIndex
                              ) => (
                                <th
                                  key={`header-${columnIndex}`}
                                  className="border p-2 text-left align-top"
                                  style={{
                                    backgroundColor:
                                      "var(--admin-surface)",
                                    borderColor:
                                      "var(--admin-border)",
                                  }}
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    <input
                                      type="text"
                                      value={
                                        column
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        updateSpecificationColumn(
                                          columnIndex,
                                          event
                                            .target
                                            .value
                                        )
                                      }
                                      placeholder={`Column ${
                                        columnIndex +
                                        1
                                      }`}
                                      className="h-9 w-full min-w-0 rounded-lg border px-3 text-xs font-semibold outline-none focus:border-[var(--admin-primary)]"
                                      style={{
                                        backgroundColor:
                                          "var(--admin-surface-2)",
                                        borderColor:
                                          "var(--admin-border)",
                                        color:
                                          "var(--admin-text)",
                                      }}
                                    />

                                    {technicalSpecifications
                                      .columns
                                      .length >
                                      MIN_SPEC_COLUMNS && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeSpecificationColumn(
                                            columnIndex
                                          )
                                        }
                                        aria-label={`Remove column ${
                                          columnIndex +
                                          1
                                        }`}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:opacity-70"
                                        style={{
                                          color:
                                            "var(--admin-danger)",
                                        }}
                                      >
                                        <X
                                          size={
                                            14
                                          }
                                        />
                                      </button>
                                    )}
                                  </div>
                                </th>
                              )
                            )}

                            <th
                              className="border p-2"
                              aria-label="Row actions"
                              style={{
                                backgroundColor:
                                  "var(--admin-surface)",
                                borderColor:
                                  "var(--admin-border)",
                              }}
                            />
                          </tr>
                        </thead>

                        <tbody>
                          {technicalSpecifications.rows.map(
                            (
                              row,
                              rowIndex
                            ) => (
                              <tr
                                key={`row-${rowIndex}`}
                              >
                                {row.map(
                                  (
                                    cell,
                                    columnIndex
                                  ) => (
                                    <td
                                      key={`cell-${rowIndex}-${columnIndex}`}
                                      className="border p-2 align-top"
                                      style={{
                                        borderColor:
                                          "var(--admin-border)",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        value={
                                          cell
                                        }
                                        onChange={(
                                          event
                                        ) =>
                                          updateSpecificationCell(
                                            rowIndex,
                                            columnIndex,
                                            event
                                              .target
                                              .value
                                          )
                                        }
                                        placeholder="Enter value"
                                        className="h-9 w-full min-w-0 rounded-lg border px-3 text-xs outline-none focus:border-[var(--admin-primary)]"
                                        style={{
                                          backgroundColor:
                                            "var(--admin-surface)",
                                          borderColor:
                                            "var(--admin-border)",
                                          color:
                                            "var(--admin-text)",
                                        }}
                                      />
                                    </td>
                                  )
                                )}

                                <td
                                  className="border p-1 text-center align-top"
                                  style={{
                                    borderColor:
                                      "var(--admin-border)",
                                  }}
                                >
                                  {technicalSpecifications
                                    .rows
                                    .length >
                                    MIN_SPEC_ROWS && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSpecificationRow(
                                          rowIndex
                                        )
                                      }
                                      aria-label={`Remove row ${
                                        rowIndex +
                                        1
                                      }`}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition hover:opacity-70"
                                      style={{
                                        color:
                                          "var(--admin-danger)",
                                      }}
                                    >
                                      <Minus
                                        size={
                                          14
                                        }
                                      />
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
                      borderColor:
                        "var(--admin-border)",
                    }}
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={
                          addSpecificationRow
                        }
                        disabled={
                          technicalSpecifications
                            .rows
                            .length >=
                          MAX_SPEC_ROWS
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          backgroundColor:
                            "var(--admin-surface)",
                          borderColor:
                            "var(--admin-border)",
                          color:
                            "var(--admin-text)",
                        }}
                      >
                        <Plus
                          size={14}
                        />
                        Add Row
                      </button>

                      <button
                        type="button"
                        onClick={
                          addSpecificationColumn
                        }
                        disabled={
                          technicalSpecifications
                            .columns
                            .length >=
                          MAX_SPEC_COLUMNS
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          backgroundColor:
                            "var(--admin-surface)",
                          borderColor:
                            "var(--admin-border)",
                          color:
                            "var(--admin-text)",
                        }}
                      >
                        <Plus
                          size={14}
                        />
                        Add Column
                      </button>
                    </div>

                    <span
                      className="text-[10px]"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      Maximum{" "}
                      {MAX_SPEC_ROWS}{" "}
                      rows ×{" "}
                      {MAX_SPEC_COLUMNS}{" "}
                      columns
                    </span>
                  </div>
                </section>
              </div>
            </section>

            {/* Pricing */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
              }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Pricing
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Manage selling price,
                  comparison price and
                  product cost.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    label:
                      "Selling Price",
                    value:
                      form.price,
                    field:
                      "price" as const,
                    placeholder:
                      "0.00",
                  },
                  {
                    label:
                      "Compare-at Price",
                    value:
                      form.compareAtPrice,
                    field:
                      "compareAtPrice" as const,
                    placeholder:
                      "Optional",
                  },
                  {
                    label:
                      "Cost Price",
                    value:
                      form.costPrice,
                    field:
                      "costPrice" as const,
                    placeholder:
                      "0.00",
                  },
                ].map(
                  (item) => (
                    <div
                      key={
                        item.field
                      }
                    >
                      <label className="mb-2 block text-sm font-semibold">
                        {
                          item.label
                        }
                      </label>

                      <div className="relative">
                        <IndianRupee
                          size={
                            15
                          }
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                          style={{
                            color:
                              "var(--admin-text-muted)",
                          }}
                        />

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            item.value
                          }
                          onChange={(
                            event
                          ) =>
                            updateField(
                              item.field,
                              event.target.value
                            )
                          }
                          placeholder={
                            item.placeholder
                          }
                          className="h-11 w-full rounded-xl border pl-9 pr-4 text-sm outline-none focus:border-[var(--admin-primary)]"
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
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor:
                      "var(--admin-surface-2)",
                    borderColor:
                      "var(--admin-border)",
                  }}
                >
                  <p
                    className="text-[11px]"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Profit / Unit
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {formatPrice(
                      profitPerUnit
                    )}
                  </p>
                </div>

                <div
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor:
                      "var(--admin-surface-2)",
                    borderColor:
                      "var(--admin-border)",
                  }}
                >
                  <p
                    className="text-[11px]"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Profit Margin
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {profitMargin.toFixed(
                      1
                    )}
                    %
                  </p>
                </div>

                <div
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor:
                      "var(--admin-surface-2)",
                    borderColor:
                      "var(--admin-border)",
                  }}
                >
                  <p
                    className="text-[11px]"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Inventory Value
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {formatPrice(
                      inventoryValue
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Inventory */}
            <section
              className="rounded-3xl border p-5 sm:p-6"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
              }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Inventory
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Manage stock quantity
                  and low-stock alerts.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      form.stockQuantity
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "stockQuantity",
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none focus:border-[var(--admin-primary)]"
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

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Low Stock Threshold
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      form.lowStockThreshold
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "lowStockThreshold",
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none focus:border-[var(--admin-primary)]"
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
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold"
                  style={{
                    backgroundColor:
                      "var(--admin-surface-2)",
                    borderColor:
                      "var(--admin-border)",
                    color:
                      isOutOfStock
                        ? "var(--admin-danger)"
                        : isLowStock
                        ? "var(--admin-warning)"
                        : "var(--admin-success)",
                  }}
                >
                  <Package
                    size={14}
                  />

                  {isOutOfStock
                    ? "Out of Stock"
                    : isLowStock
                    ? "Low Stock"
                    : "In Stock"}
                </div>

                <span
                  className="text-xs"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  {formatNumber(
                    stockQuantity
                  )}{" "}
                  units currently
                  available
                </span>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside
            className="min-w-0"
            style={{
              position:
                "static",
              top: "auto",
              bottom: "auto",
              overflow:
                "visible",
              alignSelf:
                "start",
            }}
          >
            <div
              className="space-y-5"
              style={{
                position:
                  "static",
                top: "auto",
                bottom: "auto",
                overflow:
                  "visible",
              }}
            >
              {/* Preview */}
              <section>
                <div className="mb-3">
                  <h2 className="text-lg font-bold">
                    Product Preview
                  </h2>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Preview how the product
                    card will appear.
                  </p>
                </div>

                <div
                  className="mx-auto w-full max-w-[350px] overflow-hidden rounded-3xl border"
                  style={{
                    backgroundColor:
                      "var(--admin-surface-2)",
                    borderColor:
                      "var(--admin-border)",
                  }}
                >
                  <div className="p-3">
                    <div
                      className="aspect-square w-full overflow-hidden rounded-2xl border"
                      style={{
                        backgroundColor:
                          "var(--admin-surface)",
                        borderColor:
                          "var(--admin-border)",
                      }}
                    >
                      {previewImage ? (
                        <img
                          src={
                            previewImage.url
                          }
                          alt={
                            previewImage.alt
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full flex-col items-center justify-center gap-2"
                          style={{
                            color:
                              "var(--admin-text-subtle)",
                          }}
                        >
                          <ImageIcon
                            size={30}
                            strokeWidth={
                              1.5
                            }
                          />

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
                        {form.name ||
                          "Product Name"}
                      </h3>

                      {form.isFeatured && (
                        <Star
                          size={15}
                          fill="currentColor"
                          className="mt-0.5 shrink-0"
                          style={{
                            color:
                              "var(--admin-yellow)",
                          }}
                        />
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                          {formatPrice(
                            previewPrice
                          )}
                        </span>

                        {Number(
                          form.compareAtPrice
                        ) >
                          previewPrice &&
                          Number(
                            form.compareAtPrice
                          ) > 0 && (
                            <span
                              className="text-xs line-through"
                              style={{
                                color:
                                  "var(--admin-text-subtle)",
                              }}
                            >
                              {formatPrice(
                                Number(
                                  form.compareAtPrice
                                )
                              )}
                            </span>
                          )}
                      </div>

                      <p
                        className="mt-0.5 text-[10px]"
                        style={{
                          color:
                            "var(--admin-text-subtle)",
                        }}
                      >
                        Inc. Taxes
                      </p>
                    </div>

                    <div className="mt-4">
                      <p
                        className="mb-2 text-xs font-semibold"
                        style={{
                          color:
                            "var(--admin-text-secondary)",
                        }}
                      >
                        Quantity
                      </p>

                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-10 shrink-0 items-center overflow-hidden rounded-xl border"
                          style={{
                            backgroundColor:
                              "var(--admin-surface)",
                            borderColor:
                              "var(--admin-border)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewQuantity(
                                (current) =>
                                  Math.max(
                                    1,
                                    current -
                                      1
                                  )
                              )
                            }
                            className="flex h-full w-9 items-center justify-center transition hover:opacity-70"
                            style={{
                              color:
                                "var(--admin-text)",
                            }}
                          >
                            <Minus
                              size={14}
                            />
                          </button>

                          <span className="min-w-[30px] text-center text-sm font-semibold">
                            {
                              previewQuantity
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setPreviewQuantity(
                                (current) =>
                                  current +
                                  1
                              )
                            }
                            className="flex h-full w-9 items-center justify-center transition hover:opacity-70"
                            style={{
                              color:
                                "var(--admin-text)",
                            }}
                          >
                            <Plus
                              size={14}
                            />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold transition hover:opacity-90"
                          style={{
                            backgroundColor:
                              "var(--admin-primary)",
                            color:
                              "#ffffff",
                          }}
                        >
                          <ShoppingCart
                            size={14}
                          />

                          <span className="truncate">
                            Add to Cart
                          </span>
                        </button>
                      </div>
                    </div>

                    <div
                      className="mt-3 flex items-center gap-2 text-[10px]"
                      style={{
                        color:
                          "var(--admin-text-subtle)",
                      }}
                    >
                      <Package
                        size={12}
                      />

                      {stockQuantity >
                      0
                        ? `${formatNumber(
                            stockQuantity
                          )} units available`
                        : "Out of stock"}
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Settings */}
              <section
                className="rounded-3xl border p-4"
                style={{
                  backgroundColor:
                    "var(--admin-surface)",
                  borderColor:
                    "var(--admin-border)",
                }}
              >
                <div className="mb-4">
                  <h2 className="text-base font-bold">
                    Product Settings
                  </h2>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Control product
                    visibility and
                    featured placement.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Active */}
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "isActive",
                        !form.isActive
                      )
                    }
                    className="flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                    }}
                  >
                    <div className="pr-3">
                      <div className="text-sm font-bold">
                        Active Product
                      </div>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        Make this product
                        visible in the
                        store.
                      </p>
                    </div>

                    <div
                      className="relative h-6 w-11 shrink-0 rounded-full transition"
                      style={{
                        backgroundColor:
                          form.isActive
                            ? "var(--admin-primary)"
                            : "var(--admin-border-strong)",
                      }}
                    >
                      <span
                        className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
                        style={{
                          left:
                            form.isActive
                              ? "22px"
                              : "4px",
                        }}
                      />
                    </div>
                  </button>

                  {/* Featured */}
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "isFeatured",
                        !form.isFeatured
                      )
                    }
                    className="flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                    }}
                  >
                    <div className="pr-3">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        Featured Product

                        <Star
                          size={14}
                          style={{
                            color:
                              "var(--admin-yellow)",
                          }}
                        />
                      </div>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        Highlight this
                        product in
                        featured sections.
                      </p>
                    </div>

                    <div
                      className="relative h-6 w-11 shrink-0 rounded-full transition"
                      style={{
                        backgroundColor:
                          form.isFeatured
                            ? "var(--admin-primary)"
                            : "var(--admin-border-strong)",
                      }}
                    >
                      <span
                        className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
                        style={{
                          left:
                            form.isFeatured
                              ? "22px"
                              : "4px",
                        }}
                      />
                    </div>
                  </button>
                </div>
              </section>

              {/* Save */}
              <button
                type="submit"
                disabled={
                  saving ||
                  deleting
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition hover:opacity-90 disabled:cursor-default disabled:opacity-100"
                style={{
                  backgroundColor:
                    saved
                      ? "var(--admin-success)"
                      : "var(--admin-primary)",
                  color:
                    "#ffffff",
                }}
              >
                {saved ? (
                  <>
                    <Check size={19} />
                    Changes Saved
                  </>
                ) : saving ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={
                  handleDeleteProduct
                }
                disabled={
                  deleting ||
                  saving
                }
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor:
                    "var(--admin-surface)",
                  borderColor:
                    "color-mix(in srgb, var(--admin-danger) 30%, var(--admin-border))",
                  color:
                    "var(--admin-danger)",
                }}
              >
                {deleting ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                    Deleting Product...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={17}
                    />
                    Delete Product
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
