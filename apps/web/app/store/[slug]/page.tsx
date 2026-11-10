"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ReactNode,
  KeyboardEvent,
  TouchEvent,
} from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Footer from "@/sections/Footer";

const CART_STORAGE_KEY = "adroiit-store-cart";
const CART_UPDATED_EVENT = "adroiit-store-cart-updated";

const WISHLIST_STORAGE_KEY = "adroiit-store-wishlist";
const WISHLIST_UPDATED_EVENT = "adroiit-store-wishlist-updated";

type TechnicalSpecifications = {
  columns: string[];
  rows: string[][];
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  product_details: string | null;
  technical_specifications: TechnicalSpecifications | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

type Category = {
  id: string;
  name: string;
  slug?: string;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at?: string;
};

type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  imageUrl: string | null;
};

type CartAddResult = {
  addedQuantity: number;
  totalQuantity: number;
  wasLimited: boolean;
};

const PRODUCT_SELECT =
  "id, name, slug, sku, category_id, short_description, description, product_details, technical_specifications, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, is_featured, sort_order";

const IMAGE_SELECT =
  "id, product_id, image_url, alt_text, sort_order, created_at";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function isRemoteImage(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

/* -------------------------------------------------------
   SALE HELPERS
------------------------------------------------------- */

function getSaleSavings(product: Product): number {
  const currentPrice = Number(product.price);
  const originalPrice = Number(product.compare_at_price);

  if (
    !Number.isFinite(currentPrice) ||
    !Number.isFinite(originalPrice) ||
    originalPrice <= currentPrice ||
    currentPrice <= 0
  ) {
    return 0;
  }

  return Math.max(0, originalPrice - currentPrice);
}

function isProductOnSale(product: Product): boolean {
  return getSaleSavings(product) > 0;
}

/* -------------------------------------------------------
   CART STORAGE
------------------------------------------------------- */

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item: any) => ({
      productId: String(item.productId ?? ""),
      name: String(item.name ?? ""),
      slug: String(item.slug ?? ""),
      price: Math.max(0, Number(item.price ?? 0)),
      quantity: Math.max(
        1,
        Math.floor(Number(item.quantity ?? 1))
      ),
      stockQuantity: Math.max(
        0,
        Math.floor(Number(item.stockQuantity ?? 0))
      ),
      imageUrl: item.imageUrl ? String(item.imageUrl) : null,
    }))
    .filter((item) => item.productId && item.name);
}

function readCart(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? normalizeCart(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

function writeCart(cart: CartItem[]) {
  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );

    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch {
    // Ignore local storage errors.
  }
}

/* -------------------------------------------------------
   WISHLIST STORAGE
------------------------------------------------------- */

function normalizeWishlist(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0
        )
        .map((item) => item.trim())
    )
  );
}

function readWishlist(): string[] {
  try {
    const stored = window.localStorage.getItem(
      WISHLIST_STORAGE_KEY
    );

    return stored
      ? normalizeWishlist(JSON.parse(stored))
      : [];
  } catch {
    return [];
  }
}

function writeWishlist(wishlist: string[]) {
  try {
    const normalizedWishlist = normalizeWishlist(wishlist);

    window.localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(normalizedWishlist)
    );

    window.dispatchEvent(
      new Event(WISHLIST_UPDATED_EVENT)
    );
  } catch {
    // Ignore local storage errors.
  }
}

/* -------------------------------------------------------
   TECHNICAL SPECIFICATIONS
------------------------------------------------------- */

function normalizeTechnicalSpecifications(
  value: unknown
): TechnicalSpecifications | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Partial<TechnicalSpecifications>;

  if (!Array.isArray(raw.columns) || !Array.isArray(raw.rows)) {
    return null;
  }

  const columns = raw.columns.map((column) =>
    String(column ?? "").trim()
  );

  if (!columns.length) return null;

  const rows = raw.rows.map((row) => {
    const cells = Array.isArray(row) ? row : [];

    return columns.map((_, index) =>
      String(cells[index] ?? "").trim()
    );
  });

  return { columns, rows };
}

function normalizeProduct(product: any): Product {
  return {
    ...product,
    price: Number(product.price ?? 0),
    compare_at_price:
      product.compare_at_price == null
        ? null
        : Number(product.compare_at_price),
    stock_quantity: Math.max(
      0,
      Math.floor(Number(product.stock_quantity ?? 0))
    ),
    low_stock_threshold: Math.max(
      0,
      Math.floor(Number(product.low_stock_threshold ?? 0))
    ),
    technical_specifications:
      normalizeTechnicalSpecifications(
        product.technical_specifications
      ),
  };
}

/* -------------------------------------------------------
   SHARED PAGE SHELL
------------------------------------------------------- */

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white">
      {children}
      <Footer />
    </div>
  );
}

/* -------------------------------------------------------
   STOCK STATUS
------------------------------------------------------- */

function getStockStatus(product: Product) {
  const stock = Math.max(
    0,
    Math.floor(Number(product.stock_quantity ?? 0))
  );

  if (stock > 0) {
    return {
      type: "in-stock" as const,
      label: "In Stock",
    };
  }

  return {
    type: "out-of-stock" as const,
    label: "Out of Stock",
  };
}

/* -------------------------------------------------------
   RELATED PRODUCT CARD
   MATCHED TO STORE PAGE StoreProductCard
------------------------------------------------------- */

function RelatedProductCard({
  product,
  imageUrl,
  addedProductId,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: {
  product: Product;
  imageUrl: string | null;
  addedProductId: string | null;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    product: Product,
    quantity: number
  ) => CartAddResult;
}) {
  const [quantity, setQuantity] = useState(1);

  const availableQuantity = Math.max(
    0,
    Number(product.stock_quantity)
  );

  const outOfStock = availableQuantity <= 0;
  const isAdded = addedProductId === product.id;

  const currentPrice = Number(product.price);
  const compareAtPrice = Number(
    product.compare_at_price ?? 0
  );

  const isOnSale =
    Number.isFinite(currentPrice) &&
    Number.isFinite(compareAtPrice) &&
    currentPrice > 0 &&
    compareAtPrice > currentPrice;

  const surface = "#ffffff";
  const surfaceTwo = "#f6f4fa";
  const text = "#17151d";
  const mutedText = "#716d78";
  const primary = "#5921c7";

  const cardBorder = "1px solid rgba(70,70,70,0.18)";

  useEffect(() => {
    const syncQuantity = () => {
      const item = readCart().find(
        (cartItem) => cartItem.productId === product.id
      );

      if (!item || availableQuantity <= 0) {
        setQuantity(1);
        return;
      }

      setQuantity(
        Math.min(
          Math.max(1, item.quantity),
          availableQuantity
        )
      );
    };

    syncQuantity();

    window.addEventListener("storage", syncQuantity);
    window.addEventListener(CART_UPDATED_EVENT, syncQuantity);

    return () => {
      window.removeEventListener("storage", syncQuantity);
      window.removeEventListener(CART_UPDATED_EVENT, syncQuantity);
    };
  }, [product.id, availableQuantity]);

  useEffect(() => {
    if (availableQuantity <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity((current) =>
      Math.min(
        Math.max(1, current),
        availableQuantity
      )
    );
  }, [availableQuantity]);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(availableQuantity, current + 1)
    );
  }

  function handleAddToCart() {
    if (outOfStock || quantity <= 0) return;

    onAddToCart(
      product,
      Math.min(
        Math.max(1, quantity),
        availableQuantity
      )
    );
  }

  return (
    <article
      className="group flex h-full min-h-[420px] min-w-0 flex-col overflow-hidden rounded-[18px] p-2.5 transition duration-200 hover:-translate-y-0.5 sm:min-h-[430px]"
      style={{
        backgroundColor: surface,
        border: cardBorder,
      }}
    >
      {/* PRODUCT IMAGE */}
      <div className="relative shrink-0">
        <Link
          href={`/store/${product.slug}`}
          className="block"
          aria-label={`View ${product.name}`}
        >
          <div
            className="relative aspect-square w-full overflow-hidden rounded-[17px]"
            style={{
              backgroundColor: "#f5f3fa",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                unoptimized={isRemoteImage(imageUrl)}
                className="rounded-[17px] object-contain transition duration-300 group-hover:scale-[1.025]"
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 245px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package
                  size={28}
                  strokeWidth={1.5}
                  style={{
                    color: mutedText,
                  }}
                />
              </div>
            )}
          </div>
        </Link>

        {/* SALE BADGE */}
        {isOnSale && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#e53945] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.08em] text-white shadow-sm">
            SALE
          </span>
        )}

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          title={
            isWishlisted
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
          className="absolute right-3 top-3 z-10 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-black/[0.08] bg-white/95 shadow-sm backdrop-blur transition hover:scale-105"
        >
          <Heart
            size={18}
            strokeWidth={2}
            className={
              isWishlisted
                ? "fill-[#e53945] text-[#e53945]"
                : "text-[#716d78]"
            }
          />
        </button>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="flex flex-1 flex-col px-0.5 pt-2.5">
        <Link
          href={`/store/${product.slug}`}
          className="block shrink-0"
        >
          <h3
            className="line-clamp-2 min-h-[40px] text-[15px] font-bold leading-[20px]"
            style={{
              color: text,
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* AVAILABILITY */}
        <div className="mt-1 min-h-[17px] shrink-0">
          <span
            className="text-[12px] font-semibold"
            style={{
              color: outOfStock ? "#d52f3f" : "#07885b",
            }}
          >
            {outOfStock ? "Out of Stock" : "In Stock"}
          </span>
        </div>

        {/* PRODUCT PRICING */}
        <div className="mt-1 min-h-[48px] shrink-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p
              className="text-[17px] font-bold leading-5"
              style={{
                color: primary,
              }}
            >
              {formatPrice(currentPrice)}
            </p>

            {isOnSale && (
              <p className="text-[12px] font-medium leading-5 text-[#8b8792] line-through">
                {formatPrice(compareAtPrice)}
              </p>
            )}
          </div>

          <p
            className="mt-0.5 text-[12px] font-medium"
            style={{
              color: mutedText,
            }}
          >
            Inc. Taxes
          </p>
        </div>

        {/* QUANTITY */}
        <div className="mt-2 shrink-0">
          <p
            className="mb-1.5 text-[12px] font-semibold"
            style={{
              color: mutedText,
            }}
          >
            Quantity
          </p>

          <div className="flex w-full flex-col gap-1.5">
            <div className="flex h-[36px] w-full items-center justify-center">
              <div
                className="flex h-full w-full shrink-0 items-center overflow-hidden rounded-[9px]"
                style={{
                  backgroundColor: surfaceTwo,
                }}
              >
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={outOfStock || quantity <= 1}
                  className="flex h-full flex-1 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-30"
                  style={{
                    color: text,
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} strokeWidth={2} />
                </button>

                <span
                  className="flex h-full w-[25px] shrink-0 items-center justify-center text-[12px] font-bold"
                  style={{
                    color: text,
                  }}
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    outOfStock ||
                    quantity >= availableQuantity
                  }
                  className="flex h-full flex-1 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-30"
                  style={{
                    color: text,
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus size={12} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex h-[36px] w-full items-center justify-center gap-1.5 rounded-[9px] px-2 text-[14px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: isAdded ? "#07885b" : primary,
              }}
            >
              {isAdded ? (
                <>
                  <Check size={13} strokeWidth={2.5} />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={13} strokeWidth={3} />
                  <span className="truncate">Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------
   PRODUCT DETAIL PAGE
------------------------------------------------------- */

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const supabase = useMemo(() => createClient(), []);

  const relatedProductsRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedImages, setRelatedImages] = useState<ProductImage[]>([]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [relatedAddedProductId, setRelatedAddedProductId] =
    useState<string | null>(null);

  /* -------------------------------------------------------
     WISHLIST STATE
  ------------------------------------------------------- */

  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const syncWishlist = () => {
      setWishlist(readWishlist());
    };

    syncWishlist();

    window.addEventListener("storage", syncWishlist);
    window.addEventListener(
      WISHLIST_UPDATED_EVENT,
      syncWishlist
    );

    return () => {
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener(
        WISHLIST_UPDATED_EVENT,
        syncWishlist
      );
    };
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    const currentWishlist = readWishlist();

    const nextWishlist = currentWishlist.includes(productId)
      ? currentWishlist.filter((id) => id !== productId)
      : [...currentWishlist, productId];

    writeWishlist(nextWishlist);
    setWishlist(nextWishlist);
  }, []);

  const isWishlisted = Boolean(
    product && wishlist.includes(product.id)
  );

  /* -------------------------------------------------------
     LOAD PRODUCT
  ------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setNotFound(false);
      setCartMessage("");

      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const { data: productData, error: productError } =
          await supabase
            .from("products")
            .select(PRODUCT_SELECT)
            .eq("slug", slug)
            .eq("is_active", true)
            .maybeSingle();

        if (cancelled) return;

        if (productError) {
          throw new Error(productError.message);
        }

        if (!productData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const normalizedProduct = normalizeProduct(productData);

        let categoryData: Category | null = null;

        if (productData.category_id) {
          const { data, error: categoryError } =
            await supabase
              .from("categories")
              .select("id, name, slug")
              .eq("id", productData.category_id)
              .maybeSingle();

          if (cancelled) return;

          if (categoryError) {
            throw new Error(categoryError.message);
          }

          categoryData = data as Category | null;
        }

        const { data: imageData, error: imageError } =
          await supabase
            .from("product_images")
            .select(IMAGE_SELECT)
            .eq("product_id", productData.id)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (cancelled) return;

        if (imageError) {
          throw new Error(imageError.message);
        }

        const productImages = (imageData ?? []) as ProductImage[];

        setProduct(normalizedProduct);
        setCategory(categoryData);
        setImages(productImages);
        setSelectedImage(0);
        setQuantity(
          normalizedProduct.stock_quantity > 0 ? 1 : 0
        );

        setRelatedProducts([]);
        setRelatedImages([]);

        if (productData.category_id) {
          const {
            data: categoryProducts,
            error: categoryProductsError,
          } = await supabase
            .from("products")
            .select(PRODUCT_SELECT)
            .eq("category_id", productData.category_id)
            .eq("is_active", true)
            .neq("id", productData.id)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

          if (cancelled) return;

          if (categoryProductsError) {
            setRelatedProducts([]);
            setRelatedImages([]);
          } else {
            const normalizedRelated = (categoryProducts ?? [])
              .map(normalizeProduct)
              .sort((a, b) => {
                const aOut = a.stock_quantity <= 0;
                const bOut = b.stock_quantity <= 0;

                if (aOut && !bOut) return 1;
                if (!aOut && bOut) return -1;

                return 0;
              });

            setRelatedProducts(normalizedRelated);

            const relatedIds = normalizedRelated.map(
              (item) => item.id
            );

            if (relatedIds.length > 0) {
              const {
                data: relatedImageData,
                error: relatedImageError,
              } = await supabase
                .from("product_images")
                .select(IMAGE_SELECT)
                .in("product_id", relatedIds)
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: true });

              if (cancelled) return;

              if (!relatedImageError) {
                setRelatedImages(
                  (relatedImageData ?? []) as ProductImage[]
                );
              }
            }
          }
        }

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading this product."
        );

        setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug, supabase, retryCount]);

  useEffect(() => {
    setAddedToCart(false);
  }, [quantity]);

  useEffect(() => {
    if (!relatedAddedProductId) return;

    const timer = window.setTimeout(() => {
      setRelatedAddedProductId(null);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [relatedAddedProductId]);

  /* -------------------------------------------------------
     PRODUCT QUANTITY
  ------------------------------------------------------- */

  function updateQuantity(nextQuantity: number) {
    if (!product || product.stock_quantity <= 0) return;

    setQuantity(
      Math.max(
        1,
        Math.min(
          Math.floor(nextQuantity),
          product.stock_quantity
        )
      )
    );
  }

  /* -------------------------------------------------------
     PRODUCT IMAGES
  ------------------------------------------------------- */

  const getProductImage = useCallback(
    (productId: string) => {
      if (product && product.id === productId) {
        return images[0]?.image_url ?? null;
      }

      return (
        relatedImages.find(
          (image) => image.product_id === productId
        )?.image_url ?? null
      );
    },
    [product, images, relatedImages]
  );

  const goToPreviousImage = useCallback(() => {
    if (!images.length) return;

    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }, [images.length]);

  const goToNextImage = useCallback(() => {
    if (!images.length) return;

    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }, [images.length]);

  function handleGalleryKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (images.length <= 1) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPreviousImage();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNextImage();
    }
  }

  function handleGalleryTouchStart(
    event: TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleGalleryTouchEnd(
    event: TouchEvent<HTMLDivElement>
  ) {
    if (touchStartX.current === null || images.length <= 1) {
      touchStartX.current = null;
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX;

    if (touchEndX === undefined) {
      touchStartX.current = null;
      return;
    }

    const swipeDistance = touchEndX - touchStartX.current;
    const minimumSwipeDistance = 45;

    if (Math.abs(swipeDistance) >= minimumSwipeDistance) {
      if (swipeDistance > 0) {
        goToPreviousImage();
      } else {
        goToNextImage();
      }
    }

    touchStartX.current = null;
  }

  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  const addProductToCart = useCallback(
    (
      targetProduct: Product,
      requestedQuantity: number
    ): CartAddResult => {
      const available = Math.max(
        0,
        Math.floor(Number(targetProduct.stock_quantity))
      );

      if (available <= 0) {
        return {
          addedQuantity: 0,
          totalQuantity: 0,
          wasLimited: true,
        };
      }

      const safeRequested = Math.max(
        1,
        Math.floor(Number(requestedQuantity))
      );

      const cart = readCart();

      const existingIndex = cart.findIndex(
        (item) => item.productId === targetProduct.id
      );

      const primaryImage = getProductImage(targetProduct.id);

      if (existingIndex >= 0) {
        const existingItem = cart[existingIndex];

        const currentQuantity = Math.min(
          Math.max(0, existingItem.quantity),
          available
        );

        const remainingStock = Math.max(
          0,
          available - currentQuantity
        );

        const addedQuantity = Math.min(
          safeRequested,
          remainingStock
        );

        const totalQuantity =
          currentQuantity + addedQuantity;

        cart[existingIndex] = {
          ...existingItem,
          name: targetProduct.name,
          slug: targetProduct.slug,
          price: Number(targetProduct.price),
          stockQuantity: available,
          imageUrl:
            primaryImage ?? existingItem.imageUrl ?? null,
          quantity: totalQuantity,
        };

        writeCart(cart);

        return {
          addedQuantity,
          totalQuantity,
          wasLimited: addedQuantity < safeRequested,
        };
      }

      const addedQuantity = Math.min(
        safeRequested,
        available
      );

      cart.push({
        productId: targetProduct.id,
        name: targetProduct.name,
        slug: targetProduct.slug,
        price: Number(targetProduct.price),
        quantity: addedQuantity,
        stockQuantity: available,
        imageUrl: primaryImage ?? null,
      });

      writeCart(cart);

      return {
        addedQuantity,
        totalQuantity: addedQuantity,
        wasLimited: addedQuantity < safeRequested,
      };
    },
    [getProductImage]
  );

  function handleAddToCart() {
    if (!product || product.stock_quantity <= 0 || quantity <= 0) {
      return;
    }

    setAddingToCart(true);
    setAddedToCart(false);
    setCartMessage("");

    try {
      const result = addProductToCart(product, quantity);

      if (result.addedQuantity <= 0) {
        setCartMessage(
          "The maximum available stock is already in your cart."
        );
        return;
      }

      setAddedToCart(true);

      if (result.wasLimited) {
        setCartMessage(
          "Your cart has been updated. The maximum available stock has been reached."
        );
      } else {
        setCartMessage("Added to your cart successfully.");
      }
    } finally {
      setAddingToCart(false);
    }
  }

  function handleRelatedAddToCart(
    relatedProduct: Product,
    requestedQuantity: number
  ): CartAddResult {
    const result = addProductToCart(
      relatedProduct,
      requestedQuantity
    );

    if (result.addedQuantity > 0) {
      setRelatedAddedProductId(relatedProduct.id);
    }

    return result;
  }

  function handleBuyNow() {
    if (!product || product.stock_quantity <= 0 || quantity <= 0) {
      return;
    }

    setBuyingNow(true);

    try {
      const result = addProductToCart(product, quantity);

      if (result.addedQuantity <= 0) {
        setBuyingNow(false);
        setCartMessage(
          "The maximum available stock is already in your cart."
        );
        return;
      }

      router.push("/store/checkout");
    } catch {
      setBuyingNow(false);
    }
  }

  /* -------------------------------------------------------
     RELATED PRODUCTS CAROUSEL
  ------------------------------------------------------- */

  function scrollRelatedProducts(direction: "left" | "right") {
    const container = relatedProductsRef.current;
    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-related-card]"
      );

    const gap = 12;

    const amount = firstCard
      ? firstCard.getBoundingClientRect().width + gap
      : container.clientWidth * 0.85;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  /* -------------------------------------------------------
     LOADING STATE
  ------------------------------------------------------- */

  if (loading && !product) {
    return (
      <PageShell>
        <main className="min-h-screen w-full bg-white font-[Bricolage_Grotesque] text-[#171717]">
          <div className="mx-auto flex min-h-[55vh] max-w-[1400px] items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#5921c7] border-t-transparent" />
              <p className="text-sm text-gray-500">
                Loading product...
              </p>
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  /* -------------------------------------------------------
     ERROR STATE
  ------------------------------------------------------- */

  if (error) {
    return (
      <PageShell>
        <main className="min-h-screen w-full bg-white font-[Bricolage_Grotesque] text-[#171717]">
          <div className="mx-auto flex min-h-[55vh] max-w-[1400px] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Package size={22} />
            </div>

            <h1 className="text-xl font-bold">
              Unable to load product
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((current) => current + 1)}
              className="mt-6 h-10 rounded-lg bg-[#5921c7] px-4 text-sm font-semibold text-white transition hover:bg-[#4d1caf]"
            >
              Try Again
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  /* -------------------------------------------------------
     NOT FOUND STATE
  ------------------------------------------------------- */

  if (notFound || !product) {
    return (
      <PageShell>
        <main className="min-h-screen w-full bg-white font-[Bricolage_Grotesque] text-[#171717]">
          <div className="mx-auto flex min-h-[55vh] max-w-[1400px] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]">
              <Package size={22} />
            </div>

            <h1 className="text-xl font-bold tracking-tight">
              Product not found
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              The product you are looking for may have been removed or is no longer available.
            </p>
          </div>
        </main>
      </PageShell>
    );
  }

  /* -------------------------------------------------------
     DERIVED PRODUCT DATA
  ------------------------------------------------------- */

  const currentImage = images[selectedImage] ?? null;
  const stockStatus = getStockStatus(product);

  const isOutOfStock = stockStatus.type === "out-of-stock";

  const onSale = isProductOnSale(product);
  const saleSavings = getSaleSavings(product);

  const technicalSpecifications =
    product.technical_specifications;

  const visibleSpecificationRows =
    technicalSpecifications?.rows.filter((row) =>
      row.some((cell) => cell.trim().length > 0)
    ) ?? [];

  const hasTechnicalSpecifications = Boolean(
    technicalSpecifications &&
      technicalSpecifications.columns.length > 0 &&
      visibleSpecificationRows.length > 0
  );

  const relatedImageMap = new Map<string, string>();

  relatedImages.forEach((image) => {
    if (!relatedImageMap.has(image.product_id)) {
      relatedImageMap.set(
        image.product_id,
        image.image_url
      );
    }
  });

  return (
    <PageShell>
      <main className="min-h-screen w-full bg-white font-[Bricolage_Grotesque] text-[#171717]">
        <div className="mx-auto w-full max-w-[1400px] bg-white px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-10">

          {/* MAIN PRODUCT AREA */}
          <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            {/* LEFT: PRODUCT GALLERY */}
            <section className="flex min-w-0 flex-col">
              <div
                tabIndex={images.length > 1 ? 0 : -1}
                onKeyDown={handleGalleryKeyDown}
                onTouchStart={handleGalleryTouchStart}
                onTouchEnd={handleGalleryTouchEnd}
                aria-label="Product image gallery. Use left and right arrow keys to change images."
                className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-[#fafafa] outline-none focus-visible:ring-2 focus-visible:ring-[#5921c7] focus-visible:ring-offset-2"
              >
                <div className="relative aspect-square touch-pan-y">
                  {currentImage ? (
                    <Image
                      src={currentImage.image_url}
                      alt={currentImage.alt_text || product.name}
                      fill
                      unoptimized={isRemoteImage(
                        currentImage.image_url
                      )}
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <Package size={34} />
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goToPreviousImage}
                        aria-label="Previous product image"
                        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition hover:border-[#5921c7] hover:text-[#5921c7] active:scale-95"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        type="button"
                        onClick={goToNextImage}
                        aria-label="Next product image"
                        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition hover:border-[#5921c7] hover:text-[#5921c7] active:scale-95"
                      >
                        <ChevronRight size={20} />
                      </button>

                      <div
                        className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {selectedImage + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {product.is_featured && (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-[#5921c7] px-2.5 py-1.5 text-[10px] font-semibold text-white">
                      <Star size={11} fill="currentColor" />
                      Featured
                    </div>
                  )}

                  {onSale && (
                    <div className="absolute right-4 top-4 rounded-md bg-[#e53945] px-3 py-1.5 text-[11px] font-bold tracking-wide text-white shadow-sm">
                      SALE
                    </div>
                  )}
                </div>
              </div>

              {images.length > 1 && (
                <div
                  className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
                  aria-label="Choose product image"
                >
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={selectedImage === index}
                      className={`relative aspect-square w-[66px] shrink-0 overflow-hidden rounded-lg border bg-gray-50 transition sm:w-[76px] ${
                        selectedImage === index
                          ? "border-[#5921c7] ring-1 ring-[#5921c7]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={
                          image.alt_text ||
                          `${product.name} ${index + 1}`
                        }
                        fill
                        unoptimized={isRemoteImage(image.image_url)}
                        sizes="76px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {images.length > 1 && (
                <p className="mt-2 text-[11px] text-gray-400">
                  Swipe to browse images or use the arrow keys.
                </p>
              )}

              <div className="hidden flex-1 lg:block" />
            </section>

            {/* RIGHT: PRODUCT INFORMATION */}
            <section className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-4">
                <h1 className="min-w-0 flex-1 text-2xl font-bold leading-tight tracking-tight text-[#5921c7] sm:text-[30px]">
                  {product.name}
                </h1>
              </div>

              {category && (
                <p className="mt-2 text-sm font-medium text-gray-500">
                  {category.name}
                </p>
              )}

              <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Product Description
                </h2>

                {product.description?.trim() ? (
                  <div className="mt-3 whitespace-pre-line text-justify text-sm leading-7 text-gray-900">
                    {product.description}
                  </div>
                ) : product.short_description?.trim() ? (
                  <div className="mt-3 whitespace-pre-line text-justify text-sm leading-7 text-gray-900">
                    {product.short_description}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-gray-900">
                    No product description available.
                  </p>
                )}
              </div>

              {/* AVAILABILITY */}
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">
                    Availability:
                  </span>

                  {isOutOfStock ? (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      <Check size={14} />
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* PRICE AND SALE SAVINGS - MAIN PRODUCT */}
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-2xl font-bold text-[#5921c7] sm:text-[26px]">
                    {formatPrice(product.price)}
                  </span>

                  {onSale && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.compare_at_price!)}
                      </span>

                      <span className="rounded-md bg-[#e53945] px-2 py-1 text-[10px] font-bold tracking-wide text-white">
                        SALE
                      </span>
                    </>
                  )}
                </div>

                {onSale && (
                  <p className="mt-1.5 text-sm font-bold text-[#07885b]">
                    You save {formatPrice(saleSavings)}
                  </p>
                )}

                <p className="mt-1 text-[11px] text-gray-400">
                  Inc. of Taxes
                </p>
              </div>

              {!isOutOfStock && (
                <div className="mt-7">
                  <p className="mb-2 text-xs font-semibold text-gray-700">
                    Quantity
                  </p>

                  {/* QUANTITY → WISHLIST → ADD TO CART → BUY NOW */}
                  <div className="grid grid-cols-[auto_44px_minmax(0,1fr)_minmax(0,1fr)] gap-2">
                    {/* QUANTITY SELECTOR */}
                    <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(quantity - 1)
                        }
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-full w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-9"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="min-w-[30px] text-center text-xs font-bold sm:min-w-[38px]">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(quantity + 1)
                        }
                        disabled={
                          quantity >= product.stock_quantity
                        }
                        aria-label="Increase quantity"
                        className="flex h-full w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-9"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* WISHLIST BUTTON */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={
                        isWishlisted
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      aria-pressed={isWishlisted}
                      title={
                        isWishlisted
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                      className={`flex h-11 w-full items-center justify-center rounded-lg border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e53945] focus-visible:ring-offset-2 ${
                        isWishlisted
                          ? "border-[#e53945]/30 bg-[#fff0f1] text-[#e53945]"
                          : "border-gray-200 bg-white text-gray-500 hover:border-[#e53945]/40 hover:bg-[#fff0f1] hover:text-[#e53945]"
                      }`}
                    >
                      <Heart
                        size={19}
                        strokeWidth={2}
                        fill={
                          isWishlisted ? "currentColor" : "none"
                        }
                      />
                    </button>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#5921c7] bg-white px-2 text-[11px] font-bold text-[#5921c7] transition hover:bg-[#5921c7]/5 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4 sm:text-xs"
                    >
                      {addedToCart ? (
                        <>
                          <Check size={15} />
                          <span className="truncate">Added</span>
                        </>
                      ) : addingToCart ? (
                        <>
                          <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-[#5921c7] border-t-transparent" />
                          <span className="truncate">Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={15} />
                          <span className="truncate">Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* BUY NOW */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={buyingNow}
                      className="flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-[#5921c7] px-2 text-[11px] font-bold text-white transition hover:bg-[#4d1caf] disabled:cursor-not-allowed disabled:opacity-70 sm:gap-2 sm:px-4 sm:text-xs"
                    >
                      {buyingNow ? (
                        <>
                          <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span className="truncate">Processing...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={15} />
                          <span className="truncate">Buy Now</span>
                        </>
                      )}
                    </button>
                  </div>

                  {cartMessage && (
                    <p
                      role="status"
                      aria-live="polite"
                      className={`mt-2 text-xs font-medium ${
                        cartMessage.includes("maximum available stock")
                          ? "text-amber-700"
                          : "text-green-700"
                      }`}
                    >
                      {cartMessage}
                    </p>
                  )}
                </div>
              )}

              {isOutOfStock && (
                <div className="mt-7 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs font-semibold text-red-600">
                    This product is currently unavailable.
                  </p>

                  {/* WISHLIST REMAINS AVAILABLE WHEN OUT OF STOCK */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-pressed={isWishlisted}
                    className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      isWishlisted
                        ? "border-[#e53945]/30 bg-[#fff0f1] text-[#e53945]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#e53945]/40 hover:text-[#e53945]"
                    }`}
                  >
                    <Heart
                      size={15}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                    {isWishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* PRODUCT DETAILS + TECHNICAL SPECIFICATIONS */}
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <section className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900">
                Product Details
              </h2>

              {product.product_details?.trim() ? (
                <div className="mt-3 space-y-1.5 text-justify text-sm leading-7 text-gray-900">
                  {product.product_details
                    .split(/\r?\n/)
                    .map((line, index) => {
                      const bulletMatch = line.match(
                        /^\s*[•*]\s?(.*)$/
                      );

                      if (bulletMatch) {
                        return (
                          <div
                            key={`${index}-${line}`}
                            className="flex items-start gap-2 text-justify"
                          >
                            <span className="shrink-0 font-semibold text-[#5921c7]">
                              •
                            </span>
                            <span className="text-justify">
                              {bulletMatch[1]}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`${index}-${line}`}
                          className="whitespace-pre-wrap text-justify"
                        >
                          {line || "\u00A0"}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-7 text-gray-900">
                  No product details available.
                </p>
              )}
            </section>

            <section className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900">
                Technical Specifications
              </h2>

              {hasTechnicalSpecifications ? (
                <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[#fafafa]">
                        {technicalSpecifications!.columns.map(
                          (column, index) => (
                            <th
                              key={`${column}-${index}`}
                              className="border-b border-gray-200 px-4 py-3 text-xs font-bold text-gray-700"
                            >
                              {column ||
                                `Specification ${index + 1}`}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {visibleSpecificationRows.map(
                        (row, rowIndex) => (
                          <tr
                            key={`row-${rowIndex}`}
                            className="transition hover:bg-gray-50/70"
                          >
                            {technicalSpecifications!.columns.map(
                              (_, columnIndex) => (
                                <td
                                  key={`${rowIndex}-${columnIndex}`}
                                  className="px-4 py-3 align-top text-xs leading-5 text-gray-900"
                                >
                                  {row[columnIndex] || "—"}
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-gray-200 px-4 py-4">
                  <p className="text-sm leading-6 text-gray-400">
                    No technical specification available
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <section className="mt-7">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-[20px] font-bold tracking-[-0.02em] text-[#5921c7] sm:text-[25px]">
                    More from {category?.name ?? "this category"}
                  </h2>

                  <p className="mt-1 text-[12px] leading-5 text-[#716d78] sm:text-[13px]">
                    Explore more products from the same category.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      scrollRelatedProducts("left")
                    }
                    aria-label="Previous products"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#5921c7]/30 hover:bg-[#5921c7]/5 hover:text-[#5921c7]"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      scrollRelatedProducts("right")
                    }
                    aria-label="Next products"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#5921c7]/30 hover:bg-[#5921c7]/5 hover:text-[#5921c7]"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div
                ref={relatedProductsRef}
                className="flex w-full gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    data-related-card
                    className="w-[calc((100%-12px)/2)] shrink-0 sm:w-[calc((100%-24px)/3)] md:w-[calc((100%-36px)/4)] lg:w-[calc((100%-48px)/5)] xl:w-[calc((100%-60px)/6)]"
                  >
                    <RelatedProductCard
                      product={relatedProduct}
                      imageUrl={
                        relatedImageMap.get(
                          relatedProduct.id
                        ) ?? null
                      }
                      addedProductId={relatedAddedProductId}
                      isWishlisted={wishlist.includes(
                        relatedProduct.id
                      )}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={handleRelatedAddToCart}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </PageShell>
  );
}