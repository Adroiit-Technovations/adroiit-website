
"use client";

import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  Heart,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const CART_STORAGE_KEY = "adroiit-store-cart";
const CART_EVENT_NAME = "adroiit-store-cart-updated";

const WISHLIST_STORAGE_KEY = "adroiit-store-wishlist";
const WISHLIST_EVENT_NAME = "adroiit-store-wishlist-updated";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
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

type WishlistClientProps = {
  initialProducts: Product[];
  initialProductImages: ProductImage[];
  initialError: string | null;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function isRemoteImage(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}

// ============================================================
// WISHLIST HELPERS
// ============================================================

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(
      WISHLIST_STORAGE_KEY
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed
          .filter((id) => typeof id === "string")
          .map((id) => id.trim())
          .filter(Boolean)
      )
    );
  } catch {
    return [];
  }
}

function writeWishlist(productIds: string[]) {
  try {
    const uniqueIds = Array.from(new Set(productIds));

    window.localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(uniqueIds)
    );

    window.dispatchEvent(
      new Event(WISHLIST_EVENT_NAME)
    );
  } catch {
    // Ignore local storage errors.
  }
}

// ============================================================
// CART HELPERS
// ============================================================

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item) =>
        item &&
        typeof item === "object"
    )
    .map((item: any) => ({
      productId: String(item.productId ?? ""),
      name: String(item.name ?? ""),
      slug: String(item.slug ?? ""),
      price: Number(item.price ?? 0),
      quantity: Math.max(
        1,
        Math.floor(Number(item.quantity ?? 1))
      ),
      stockQuantity: Math.max(
        0,
        Math.floor(Number(item.stockQuantity ?? 0))
      ),
      imageUrl: item.imageUrl
        ? String(item.imageUrl)
        : null,
    }))
    .filter(
      (item) =>
        item.productId &&
        item.name &&
        Number.isFinite(item.price) &&
        Number.isFinite(item.quantity)
    );
}

function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(
      CART_STORAGE_KEY
    );

    if (!raw) return [];

    return normalizeCart(JSON.parse(raw));
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

    window.dispatchEvent(
      new Event(CART_EVENT_NAME)
    );
  } catch {
    // Ignore local storage errors.
  }
}

// ============================================================
// COMPONENT
// ============================================================

export default function WishlistClient({
  initialProducts,
  initialProductImages,
  initialError,
}: WishlistClientProps) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedProductId, setAddedProductId] =
    useState<string | null>(null);

  const [cartMessage, setCartMessage] = useState("");

  // ----------------------------------------------------------
  // PRODUCT IMAGE MAP
  // ----------------------------------------------------------

  const imageMap = useMemo(() => {
    const map = new Map<string, string>();

    initialProductImages
      .slice()
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order
      )
      .forEach((image) => {
        if (!map.has(image.product_id)) {
          map.set(
            image.product_id,
            image.image_url
          );
        }
      });

    return map;
  }, [initialProductImages]);

  // ----------------------------------------------------------
  // WISHLIST PRODUCTS
  // ----------------------------------------------------------

  const wishlistProducts = useMemo(() => {
    const productMap = new Map(
      initialProducts.map((product) => [
        product.id,
        product,
      ])
    );

    return wishlist
      .map((id) => productMap.get(id))
      .filter(
        (product): product is Product =>
          Boolean(product)
      );
  }, [wishlist, initialProducts]);

  // ----------------------------------------------------------
  // WISHLIST INITIALIZATION AND SYNCHRONIZATION
  // ----------------------------------------------------------

  useEffect(() => {
    setWishlist(readWishlist());

    const syncWishlist = () => {
      setWishlist(readWishlist());
    };

    window.addEventListener("storage", syncWishlist);
    window.addEventListener(
      WISHLIST_EVENT_NAME,
      syncWishlist
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncWishlist
      );

      window.removeEventListener(
        WISHLIST_EVENT_NAME,
        syncWishlist
      );
    };
  }, []);

  // ----------------------------------------------------------
  // CART FEEDBACK RESET
  // ----------------------------------------------------------

  useEffect(() => {
    if (!addedProductId) return;

    const timer = window.setTimeout(() => {
      setAddedProductId(null);
      setCartMessage("");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [addedProductId]);

  // ==========================================================
  // WISHLIST ACTIONS
  // ==========================================================

  function removeFromWishlist(productId: string) {
    const nextWishlist = wishlist.filter(
      (id) => id !== productId
    );

    setWishlist(nextWishlist);
    writeWishlist(nextWishlist);
  }

  function clearWishlist() {
    setWishlist([]);
    writeWishlist([]);
  }

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  function addToCart(product: Product) {
    const available = Math.max(
      0,
      Math.floor(Number(product.stock_quantity))
    );

    if (available <= 0) return;

    const currentCart = readCart();

    const existing = currentCart.find(
      (item) => item.productId === product.id
    );

    let nextCart: CartItem[];

    if (existing) {
      const nextQuantity = Math.min(
        available,
        existing.quantity + 1
      );

      nextCart = currentCart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              quantity: nextQuantity,
              stockQuantity: available,
              imageUrl:
                imageMap.get(product.id) ??
                item.imageUrl ??
                null,
            }
          : item
      );
    } else {
      nextCart = [
        ...currentCart,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          quantity: 1,
          stockQuantity: available,
          imageUrl: imageMap.get(product.id) ?? null,
        },
      ];
    }

    writeCart(nextCart);

    setAddedProductId(product.id);
    setCartMessage(
      `${product.name} added to your cart.`
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      className={`${bricolage.className} min-h-screen w-full bg-white text-[#17151d]`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#716d78] sm:text-[11px]">
                YOUR COLLECTION
              </p>

              <h1 className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#30106f] bg-clip-text text-[29px] font-bold tracking-[-0.03em] text-transparent sm:text-[28px]">
                My Wishlist
              </h1>

              <p className="mt-2 text-[13px] text-[#716d78] sm:text-[14px]">
                Your saved products, all in one place.
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-[#716d78]">
                  {wishlistProducts.length}{" "}
                  {wishlistProducts.length === 1
                    ? "Item"
                    : "Items"}
                </span>

                <button
                  type="button"
                  onClick={clearWishlist}
                  className="flex h-[36px] items-center gap-2 rounded-[9px] border border-[#d52f3f]/20 px-3 text-[12px] font-bold text-[#c52d3b] transition hover:bg-[#fff5f5]"
                >
                  <Trash2 size={14} />
                  Clear Wishlist
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            CART FEEDBACK
        ================================================== */}

        {cartMessage && (
          <div className="mb-5 rounded-[10px] border border-[#07885b]/20 bg-[#f0fbf6] px-4 py-3 text-[12px] font-semibold text-[#07885b]">
            {cartMessage}
          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {initialError && (
          <div className="mb-5 rounded-[12px] border border-[#d52f3f]/20 bg-[#fff7f7] px-4 py-3 text-[12px] text-[#a52835]">
            Some product information may be unavailable:{" "}
            {initialError}
          </div>
        )}

        {/* ==================================================
            EMPTY WISHLIST
        ================================================== */}

        {wishlistProducts.length === 0 && (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[20px] border border-black/[0.08] bg-[#faf9fc] px-5 py-12 text-center">
            <div className="mb-5 flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#fff0f1]">
              <Heart
                size={36}
                strokeWidth={1.5}
                className="fill-[#e53945] text-[#e53945]"
              />
            </div>

            <h2 className="text-[21px] font-bold text-[#17151d]">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-[360px] text-[13px] leading-6 text-[#716d78]">
              Save products you love by tapping the heart
              icon on any product. They will appear here.
            </p>

            <Link
              href="/store"
              className="mt-6 inline-flex h-[43px] items-center justify-center rounded-[10px] bg-[#5921c7] px-6 text-[13px] font-bold text-white transition hover:bg-[#6d32df]"
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* ==================================================
            WISHLIST PRODUCTS
        ================================================== */}

        {wishlistProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
            {wishlistProducts.map((product) => {
              const imageUrl =
                imageMap.get(product.id) ?? null;

              const outOfStock =
                Number(product.stock_quantity) <= 0;

              const isAdded =
                addedProductId === product.id;

              const compareAtPrice = Number(
                product.compare_at_price ?? 0
              );

              const currentPrice = Number(product.price);

              const isOnSale =
                Number.isFinite(compareAtPrice) &&
                Number.isFinite(currentPrice) &&
                compareAtPrice > currentPrice &&
                compareAtPrice > 0;

              const savings = isOnSale
                ? compareAtPrice - currentPrice
                : 0;

              return (
                <article
                  key={product.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-[17px] border border-black/[0.12] bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(40,20,80,0.07)]"
                >
                  {/* PRODUCT IMAGE */}

                  <div className="relative aspect-square w-full overflow-hidden rounded-[13px] bg-[#f5f3fa]">
                    <Link
                      href={`/store/${product.slug}`}
                      className="absolute inset-0"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          unoptimized={isRemoteImage(imageUrl)}
                          className="object-contain transition duration-300 group-hover:scale-[1.025]"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={30}
                            strokeWidth={1.5}
                            className="text-[#716d78]"
                          />
                        </div>
                      )}
                    </Link>

                    {/* SAVINGS BADGE */}

                    {isOnSale && (
                      <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#07885b] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white shadow-sm sm:text-[10px]">
                        Save {formatMoney(savings)}
                      </span>
                    )}

                    {/* WISHLIST HEART */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute right-2.5 top-2.5 z-10 flex h-[32px] w-[32px] items-center justify-center rounded-full border border-black/[0.08] bg-white/95 text-[#e53945] shadow-sm transition hover:scale-105 hover:bg-[#fff0f1] sm:h-[36px] sm:w-[36px]"
                    >
                      <Heart
                        size={18}
                        strokeWidth={2}
                        className="fill-[#e53945] text-[#e53945]"
                      />
                    </button>
                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="flex flex-1 flex-col px-0.5 pt-3">
                    <Link
                      href={`/store/${product.slug}`}
                      className="line-clamp-2 min-h-[42px] text-[15px] font-bold leading-[21px] text-[#17151d] transition hover:text-[#5921c7]"
                    >
                      {product.name}
                    </Link>

                    {/* STOCK STATUS */}

                    <div className="mt-1">
                      <span
                        className={`text-[12px] font-semibold ${
                          outOfStock
                            ? "text-[#d52f3f]"
                            : "text-[#07885b]"
                        }`}
                      >
                        {outOfStock
                          ? "Out of Stock"
                          : "In Stock"}
                      </span>
                    </div>

                    {/* PRICE */}

                    <div className="mt-2">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <p className="text-[18px] font-bold leading-5 text-[#5921c7]">
                          {formatMoney(currentPrice)}
                        </p>

                        {isOnSale && (
                          <p className="text-[12px] font-medium leading-5 text-[#8b8792] line-through">
                            {formatMoney(compareAtPrice)}
                          </p>
                        )}
                      </div>

                      <p className="mt-0.5 text-[11px] font-medium text-[#716d78]">
                        Inc. Taxes
                      </p>
                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={outOfStock}
                        className={`flex h-[40px] items-center justify-center gap-2 rounded-[9px] px-3 text-[12px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${
                          isAdded
                            ? "bg-[#07885b]"
                            : "bg-[#5921c7]"
                        }`}
                      >
                        <ShoppingCart size={14} />

                        <span>
                          {isAdded
                            ? "Added"
                            : outOfStock
                              ? "Out of Stock"
                              : "Add to Cart"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(product.id)
                        }
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="flex h-[40px] w-[42px] items-center justify-center rounded-[9px] border border-black/[0.10] text-[#716d78] transition hover:border-[#d52f3f]/30 hover:bg-[#fff5f5] hover:text-[#d52f3f]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
