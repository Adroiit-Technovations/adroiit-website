
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Heart,
  Quote,
  Tags,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const CART_STORAGE_KEY = "adroiit-store-cart";
const CART_EVENT_NAME = "adroiit-store-cart-updated";

const WISHLIST_STORAGE_KEY = "adroiit-store-wishlist";
const WISHLIST_EVENT_NAME = "adroiit-store-wishlist-updated";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

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

type Testimonial = {
  testimonial: string;
  name: string;
};

type StoreClientProps = {
  initialCategories: Category[];
  initialProducts: Product[];
  initialProductImages: ProductImage[];
  initialError: string | null;
};

const testimonials: Testimonial[] = [
  {
    testimonial:
      "The components were packed well and reached us quickly. Everything worked exactly as expected.",
    name: "Student Project Team",
  },
  {
    testimonial:
      "A convenient place to source electronics and development boards for our student projects.",
    name: "Academic Customer",
  },
  {
    testimonial:
      "The product quality and support made it much easier to complete our prototype.",
    name: "Project Customer",
  },
  {
    testimonial:
      "The ordering experience was simple, and the products were exactly what we needed for our lab work.",
    name: "STEM Lab Team",
  },
  {
    testimonial:
      "Having the right components available in one place helped us move from an idea to a working prototype faster.",
    name: "Innovation Team",
  },
  {
    testimonial:
      "The products were useful for our practical sessions and project development, with a smooth overall experience.",
    name: "Technical Customer",
  },
];

type HeroSlide = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  buttonLabel: string;
  image: string;
  caption: string;
};

const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Adroiit Technovations Store",
    title: "Bring your ideas",
    highlight: "to life.",
    description:
      "Explore electronics, development boards and essential components for your next prototype, IoT build or hands-on learning project.",
    buttonLabel: "Explore Products",
    image: "/store/hero-1.jpg",
    caption: "Electronics · IoT · Prototyping · STEM",
  },
  {
    eyebrow: "Build. Create. Innovate.",
    title: "Everything you need",
    highlight: "to build better.",
    description:
      "Find the components, sensors and modules that help turn your concepts into practical, working innovations.",
    buttonLabel: "Discover Components",
    image: "/store/hero-2.jpg",
    caption: "Components · Sensors · Development Boards",
  },
  {
    eyebrow: "Learn Through Making",
    title: "Start your next",
    highlight: "big project.",
    description:
      "Power your classroom experiments, student projects and engineering prototypes with the right tools and technology.",
    buttonLabel: "Browse the Store",
    image: "/store/hero-3.jpg",
    caption: "Learning · Engineering · Innovation",
  },
];

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

/* -------------------------------------------------------
   SCROLL HELPERS
------------------------------------------------------- */

function scrollToFirstProduct(elementId: string) {
  // Wait until React has committed the expanded layout.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document
        .getElementById(elementId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    });
  });
}

/* -------------------------------------------------------
   CART STORAGE HELPERS
------------------------------------------------------- */

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
        item.name
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

/* -------------------------------------------------------
   WISHLIST STORAGE HELPERS
------------------------------------------------------- */

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
    const uniqueIds = Array.from(
      new Set(productIds)
    );

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

/* -------------------------------------------------------
   PRODUCT CARD
------------------------------------------------------- */

function StoreProductCard({
  product,
  imageUrl,
  addedProductId,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}: {
  product: Product;
  imageUrl: string | null;
  addedProductId: string | null;
  isWishlisted: boolean;
  onAddToCart: (
    product: Product,
    quantity: number
  ) => void;
  onToggleWishlist: (productId: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);

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

  const cardBorder =
    "1px solid rgba(70,70,70,0.18)";

  useEffect(() => {
    const syncQuantity = () => {
      const stored = readCart();

      const item = stored.find(
        (cartItem) =>
          cartItem.productId === product.id
      );

      if (!item) {
        setCartQuantity(0);
        setQuantity(1);
        return;
      }

      if (availableQuantity <= 0) {
        setCartQuantity(0);
        setQuantity(1);
        return;
      }

      const safeQuantity = Math.min(
        Math.max(1, item.quantity),
        availableQuantity
      );

      setCartQuantity(safeQuantity);
      setQuantity(safeQuantity);
    };

    syncQuantity();

    window.addEventListener("storage", syncQuantity);
    window.addEventListener(CART_EVENT_NAME, syncQuantity);

    return () => {
      window.removeEventListener("storage", syncQuantity);
      window.removeEventListener(CART_EVENT_NAME, syncQuantity);
    };
  }, [product.id, availableQuantity]);

  useEffect(() => {
    if (availableQuantity <= 0) {
      setQuantity(1);
      setCartQuantity(0);
      return;
    }

    setQuantity((current) =>
      Math.min(
        Math.max(1, current),
        availableQuantity
      )
    );

    setCartQuantity((current) =>
      Math.min(
        Math.max(0, current),
        availableQuantity
      )
    );
  }, [availableQuantity]);

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(
        availableQuantity,
        current + 1
      )
    );
  }

  function handleAddToCart() {
    if (outOfStock || quantity <= 0) {
      return;
    }

    const safeQuantity = Math.min(
      Math.max(1, quantity),
      availableQuantity
    );

    onAddToCart(product, safeQuantity);

    setCartQuantity((current) =>
      Math.min(
        availableQuantity,
        Math.max(
          safeQuantity,
          current + safeQuantity
        )
      )
    );
  }

  return (
    <article
      className="group mx-auto flex h-full min-h-[320px] w-full min-w-0 flex-col overflow-hidden rounded-[13px] p-1.5 transition duration-200 hover:-translate-y-0.5 sm:mx-0 sm:min-h-[340px] sm:rounded-[15px] sm:p-2 lg:min-h-[390px] lg:rounded-[18px] lg:p-2.5"
      style={{
        backgroundColor: surface,
        border: cardBorder,
      }}
    >
      <div className="relative shrink-0">
        <Link
          href={`/store/${product.slug}`}
          className="block"
        >
          <div
            className="relative aspect-square w-full overflow-hidden rounded-[11px] sm:rounded-[13px] lg:rounded-[17px]"
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
                className="rounded-[11px] object-contain transition duration-300 group-hover:scale-[1.025] sm:rounded-[13px] lg:rounded-[17px]"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 245px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package
                  size={24}
                  strokeWidth={1.5}
                  style={{
                    color: mutedText,
                  }}
                />
              </div>
            )}
          </div>
        </Link>

        {isOnSale && (
          <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-[#07885b] px-2 py-1 text-[8px] font-extrabold tracking-[0.02em] text-white shadow-sm sm:left-2 sm:top-2 sm:px-2.5 sm:text-[9px] lg:left-3 lg:top-3 lg:px-3 lg:py-1.5 lg:text-[10px]">
            Save {formatMoney(compareAtPrice - currentPrice)}
          </span>
        )}

        <button
          type="button"
          onClick={() =>
            onToggleWishlist(product.id)
          }
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="absolute right-1.5 top-1.5 z-10 flex h-[28px] w-[28px] items-center justify-center rounded-full border border-black/[0.08] bg-white/95 shadow-sm backdrop-blur transition hover:scale-105 sm:right-2 sm:top-2 sm:h-[32px] sm:w-[32px] lg:right-3 lg:top-3 lg:h-[36px] lg:w-[36px]"
        >
          <Heart
            size={14}
            strokeWidth={2}
            className={
              isWishlisted
                ? "fill-[#e53945] text-[#e53945]"
                : "text-[#716d78]"
            }
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-1.5 sm:pt-2 lg:pt-2.5">
        <Link
          href={`/store/${product.slug}`}
          className="block shrink-0"
        >
          <h3
            className="line-clamp-2 min-h-[32px] text-[11px] font-bold leading-[16px] sm:min-h-[36px] sm:text-[12px] sm:leading-[17px] lg:min-h-[40px] lg:text-[15px] lg:leading-[20px]"
            style={{
              color: text,
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 min-h-[15px] shrink-0">
          <span
            className="text-[9px] font-semibold sm:text-[10px] lg:text-[12px]"
            style={{
              color: outOfStock
                ? "#d52f3f"
                : "#07885b",
            }}
          >
            {outOfStock ? "Out of Stock" : "In Stock"}
          </span>
        </div>

        <div className="mt-1 min-h-[42px] shrink-0 sm:min-h-[44px] lg:min-h-[48px]">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <p
              className="text-[13px] font-bold leading-5 sm:text-[14px] lg:text-[17px]"
              style={{
                color: primary,
              }}
            >
              {formatMoney(currentPrice)}
            </p>

            {isOnSale && (
              <p className="text-[10px] font-medium leading-5 text-[#8b8792] line-through sm:text-[11px] lg:text-[12px]">
                {formatMoney(compareAtPrice)}
              </p>
            )}
          </div>

          <p
            className="mt-0.5 text-[10px] font-medium sm:text-[11px] lg:text-[12px]"
            style={{
              color: mutedText,
            }}
          >
            Inc. Taxes
          </p>
        </div>

        <div className="mt-1 shrink-0 sm:mt-1.5 lg:mt-2">
          <p
            className="mb-1 text-[10px] font-semibold sm:text-[11px] lg:mb-1.5 lg:text-[12px]"
            style={{
              color: mutedText,
            }}
          >
            Quantity
          </p>

          <div className="flex w-full flex-col gap-1.5">
            <div className="flex h-[29px] w-full items-center justify-center sm:h-[32px] lg:h-[36px]">
              <div
                className="flex h-full w-full shrink-0 items-center overflow-hidden rounded-[8px]"
                style={{
                  backgroundColor: surfaceTwo,
                }}
              >
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={
                    outOfStock || quantity <= 1
                  }
                  className="flex h-full flex-1 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-30"
                  style={{
                    color: text,
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={11} strokeWidth={2} />
                </button>

                <span
                  className="flex h-full w-[22px] shrink-0 items-center justify-center text-[11px] font-bold sm:text-[12px]"
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
                  <Plus size={11} strokeWidth={2} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex h-[29px] w-full items-center justify-center gap-1 rounded-[8px] px-1.5 text-[10px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:h-[32px] sm:text-[11px] lg:h-[36px] lg:gap-1.5 lg:rounded-[9px] lg:px-2 lg:text-[14px]"
              style={{
                backgroundColor: isAdded
                  ? "#07885b"
                  : primary,
              }}
            >
              {isAdded ? (
                <>
                  <Check size={12} strokeWidth={2.5} />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={12} strokeWidth={3} />
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
   MAIN STORE PAGE
------------------------------------------------------- */

export default function StoreClient({
  initialCategories,
  initialProducts,
  initialProductImages,
  initialError,
}: StoreClientProps) {
  const searchParams = useSearchParams();

  const urlCategorySlug = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [categories] = useState<Category[]>(
    initialCategories
  );

  const [products] = useState<Product[]>(
    initialProducts
  );

  const [productImages] = useState<ProductImage[]>(
    initialProductImages
  );

  const [loading] = useState(false);
  const [error] = useState<string | null>(
    initialError
  );

  const [search, setSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [discoverCategory, setDiscoverCategory] = useState("all");
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const [testimonialPage, setTestimonialPage] = useState(0);
  const [featuredPage, setFeaturedPage] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);

  // FEATURED PRODUCTS - SEE ALL VIEW
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  // DISCOVER PRODUCTS - SEE ALL VIEW
  const [showAllDiscover, setShowAllDiscover] = useState(false);

  const [discoverSort, setDiscoverSort] = useState<
    | "admin"
    | "name-asc"
    | "name-desc"
    | "price-low"
    | "price-high"
  >("admin");

  const [discoverRows, setDiscoverRows] = useState(2);
  const [discoverColumns, setDiscoverColumns] = useState(1);

  // RESPONSIVE PRODUCT DISPLAY
  const [isMobile, setIsMobile] = useState(false);
  const [isTabletOrMedium, setIsTabletOrMedium] = useState(false);

  const [featuredMobileVisible, setFeaturedMobileVisible] = useState(5);
  const [discoverMobileVisible, setDiscoverMobileVisible] = useState(5);

  useEffect(() => {
    const updateDiscoverColumns = () => {
      const width = window.innerWidth;

      setIsMobile(width < 640);
      setIsTabletOrMedium(width >= 640 && width < 1024);

      setDiscoverColumns(
        width >= 1280 ? 6 :
        width >= 1024 ? 4 :
        width >= 768 ? 3 :
        width >= 640 ? 2 : 1
      );
    };

    updateDiscoverColumns();

    window.addEventListener("resize", updateDiscoverColumns);

    return () =>
      window.removeEventListener("resize", updateDiscoverColumns);
  }, []);

  /* -------------------------------------------------------
     URL CATEGORY AND SEARCH SYNCHRONIZATION
  ------------------------------------------------------- */

  useEffect(() => {
    if (urlSearch !== null) {
      setSearch(urlSearch);
      setSearchMessage(null);
    } else {
      setSearch("");
    }

    if (urlCategorySlug) {
      const matchingCategory = categories.find(
        (category) =>
          category.slug === urlCategorySlug
      );

      if (matchingCategory) {
        setSelectedCategory(null);
        setDiscoverCategory(matchingCategory.id);
        setDiscoverRows(2);
        setDiscoverMobileVisible(5);
        setShowAllDiscover(false);
      } else if (categories.length > 0) {
        setSelectedCategory(null);
        setDiscoverCategory("all");
        setShowAllDiscover(false);
      }
    } else {
      setSelectedCategory(null);
      setDiscoverCategory("all");
      setShowAllDiscover(false);
    }
  }, [
    urlCategorySlug,
    urlSearch,
    categories,
  ]);

  /* -------------------------------------------------------
     SCROLL TO DISCOVER PRODUCTS
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.location.hash !== "#discover-products"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      document
        .getElementById("discover-products")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [
    urlCategorySlug,
    categories,
  ]);

  /* -------------------------------------------------------
     CART SYNCHRONIZATION
  ------------------------------------------------------- */

  useEffect(() => {
    setCart(readCart());

    const syncCart = () => {
      setCart(readCart());
    };

    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_EVENT_NAME, syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_EVENT_NAME, syncCart);
    };
  }, []);

  /* -------------------------------------------------------
     WISHLIST SYNCHRONIZATION
  ------------------------------------------------------- */

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
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener(
        WISHLIST_EVENT_NAME,
        syncWishlist
      );
    };
  }, []);

  /* -------------------------------------------------------
     STORE HERO CAROUSEL
  ------------------------------------------------------- */

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  function navigateHero(direction: "left" | "right") {
    setHeroSlide((current) =>
      direction === "left"
        ? (current - 1 + heroSlides.length) % heroSlides.length
        : (current + 1) % heroSlides.length
    );
  }

  /* -------------------------------------------------------
     TESTIMONIAL CAROUSEL
  ------------------------------------------------------- */

  const testimonialPageCount = Math.max(
    1,
    Math.ceil(testimonials.length / 3)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialPage(
        (current) =>
          (current + 1) % testimonialPageCount
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [testimonialPageCount]);

  /* -------------------------------------------------------
     ADDED TO CART FEEDBACK
  ------------------------------------------------------- */

  useEffect(() => {
    if (!addedProductId) return;

    const timer = window.setTimeout(() => {
      setAddedProductId(null);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [addedProductId]);

  /* -------------------------------------------------------
     PRODUCT IMAGE MAP
  ------------------------------------------------------- */

  const imageMap = useMemo(() => {
    const map = new Map<string, string>();

    productImages
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
  }, [productImages]);

  /* -------------------------------------------------------
     CATEGORY MAP
  ------------------------------------------------------- */

  const categoryMap = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.id,
          category,
        ])
      ),
    [categories]
  );

  /* -------------------------------------------------------
     CATEGORY PRODUCT COUNTS
  ------------------------------------------------------- */

  const categoryProductCounts = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      if (!product.category_id) return;

      counts.set(
        product.category_id,
        (counts.get(product.category_id) ?? 0) + 1
      );
    });

    return counts;
  }, [products]);

  /* -------------------------------------------------------
     FILTERED PRODUCTS
  ------------------------------------------------------- */

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term);

      const matchesCategory =
        !selectedCategory ||
        product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  /* -------------------------------------------------------
     FEATURED PRODUCTS
  ------------------------------------------------------- */

  const featuredProducts = useMemo(
    () =>
      filteredProducts
        .filter((product) => product.is_featured)
        .slice()
        .sort((a, b) => {
          const aOutOfStock =
            Number(a.stock_quantity) <= 0;

          const bOutOfStock =
            Number(b.stock_quantity) <= 0;

          if (aOutOfStock !== bOutOfStock) {
            return aOutOfStock ? 1 : -1;
          }

          return (
            Number(a.sort_order ?? 0) -
            Number(b.sort_order ?? 0)
          );
        }),
    [filteredProducts]
  );

  const featuredPageCount = Math.max(
    1,
    Math.ceil(featuredProducts.length / 6)
  );

  useEffect(() => {
    setFeaturedPage((current) =>
      Math.min(current, featuredPageCount - 1)
    );

    setFeaturedMobileVisible(5);
  }, [featuredPageCount]);

  /* -------------------------------------------------------
     DISCOVER PRODUCTS
  ------------------------------------------------------- */

  const discoverProducts = useMemo(() => {
    const base =
      discoverCategory === "all"
        ? filteredProducts
        : filteredProducts.filter(
            (product) =>
              product.category_id === discoverCategory
          );

    return base.slice().sort((a, b) => {
      const aOutOfStock =
        Number(a.stock_quantity) <= 0;

      const bOutOfStock =
        Number(b.stock_quantity) <= 0;

      if (aOutOfStock !== bOutOfStock) {
        return aOutOfStock ? 1 : -1;
      }

      if (discoverSort === "name-asc") {
        return a.name.localeCompare(
          b.name,
          undefined,
          {
            sensitivity: "base",
          }
        );
      }

      if (discoverSort === "name-desc") {
        return b.name.localeCompare(
          a.name,
          undefined,
          {
            sensitivity: "base",
          }
        );
      }

      if (discoverSort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (discoverSort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      return (
        Number(a.sort_order ?? 0) -
        Number(b.sort_order ?? 0)
      );
    });
  }, [
    filteredProducts,
    discoverCategory,
    discoverSort,
  ]);

  // Mobile and tablet:
  // Display all products in a horizontal scrolling row.
  //
  // Desktop:
  // Display products according to the current grid page.
  //
  // See All:
  // Display every product in a responsive grid.

  const visibleDiscoverProducts = useMemo(
    () =>
      showAllDiscover || isMobile || isTabletOrMedium
        ? discoverProducts
        : discoverProducts.slice(
            0,
            discoverRows * discoverColumns
          ),
    [
      discoverProducts,
      discoverRows,
      discoverColumns,
      isMobile,
      isTabletOrMedium,
      showAllDiscover,
    ]
  );

  useEffect(() => {
    setDiscoverRows(2);
    setDiscoverMobileVisible(5);
    setShowAllDiscover(false);
  }, [
    search,
    selectedCategory,
    discoverCategory,
    discoverSort,
  ]);

  /* -------------------------------------------------------
     CART TOTALS
  ------------------------------------------------------- */

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [cart]
  );

  /* -------------------------------------------------------
     WISHLIST ACTIONS
  ------------------------------------------------------- */

  function toggleWishlist(productId: string) {
    const currentWishlist = readWishlist();

    const nextWishlist = currentWishlist.includes(productId)
      ? currentWishlist.filter(
          (id) => id !== productId
        )
      : [...currentWishlist, productId];

    setWishlist(nextWishlist);
    writeWishlist(nextWishlist);
  }

  /* -------------------------------------------------------
     ADD TO CART
  ------------------------------------------------------- */

  function addToCart(
    product: Product,
    requestedQuantity: number
  ) {
    const available = Math.max(
      0,
      Math.floor(Number(product.stock_quantity))
    );

    if (available <= 0) return;

    const safeQuantity = Math.min(
      Math.max(1, Math.floor(requestedQuantity)),
      available
    );

    const currentCart = readCart();

    const existing = currentCart.find(
      (item) => item.productId === product.id
    );

    let nextCart: CartItem[];

    if (existing) {
      const nextQuantity = Math.min(
        available,
        existing.quantity + safeQuantity
      );

      nextCart = currentCart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              name: product.name,
              slug: product.slug,
              quantity: nextQuantity,
              stockQuantity: available,
              price: Number(product.price),
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
          quantity: safeQuantity,
          stockQuantity: available,
          imageUrl: imageMap.get(product.id) ?? null,
        },
      ];
    }

    setCart(nextCart);
    writeCart(nextCart);
    setAddedProductId(product.id);
  }

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  function handleSearch() {
    const term = search.trim().toLowerCase();

    if (!term) {
      setSearchMessage(null);
      return;
    }

    const matches = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term)
    );

    if (matches.length === 0) {
      setSearchMessage("Product Not Found");
      return;
    }

    setSearchMessage(null);
    setSelectedCategory(null);
    setDiscoverCategory("all");
    setDiscoverRows(2);
    setDiscoverMobileVisible(5);
    setShowAllDiscover(false);

    window.setTimeout(() => {
      document
        .getElementById("discover-products")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  /* -------------------------------------------------------
     CATEGORY SELECTION
  ------------------------------------------------------- */

  function selectCategory(categoryId: string | null) {
    setSelectedCategory(categoryId);
    setDiscoverCategory(categoryId ?? "all");
    setDiscoverRows(2);
    setDiscoverMobileVisible(5);
    setShowAllDiscover(false);

    window.setTimeout(() => {
      document
        .getElementById("discover-products")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  /* -------------------------------------------------------
     FEATURED PRODUCT NAVIGATION
  ------------------------------------------------------- */

  function navigateFeatured(
    direction: "left" | "right"
  ) {
    setFeaturedPage((current) => {
      if (direction === "left") {
        return Math.max(0, current - 1);
      }

      return Math.min(
        featuredPageCount - 1,
        current + 1
      );
    });
  }

  /* -------------------------------------------------------
     VISIBLE PRODUCTS AND TESTIMONIALS
  ------------------------------------------------------- */

  const visibleFeaturedProducts = showAllFeatured
    ? featuredProducts
    : isMobile || isTabletOrMedium
      ? featuredProducts
      : featuredProducts.slice(
          featuredPage * 6,
          featuredPage * 6 + 6
        );

  const visibleTestimonials =
    testimonials.slice(
      testimonialPage * 3,
      testimonialPage * 3 + 3
    );

  /* -------------------------------------------------------
     FEATURED PRODUCTS SEE ALL / SHOW LESS
  ------------------------------------------------------- */

  function toggleFeaturedView() {
    const shouldShowLess = showAllFeatured;

    setShowAllFeatured(!showAllFeatured);
    setFeaturedPage(0);
    setFeaturedMobileVisible(5);

    if (!shouldShowLess) {
      scrollToFirstProduct("featured-products-first-card");
    }
  }

  /* -------------------------------------------------------
     DISCOVER PRODUCTS SEE ALL / SHOW LESS
  ------------------------------------------------------- */

  function toggleDiscoverView() {
    const shouldShowLess = showAllDiscover;

    setShowAllDiscover(!showAllDiscover);
    setDiscoverRows(2);
    setDiscoverMobileVisible(5);

    if (!shouldShowLess) {
      scrollToFirstProduct("discover-products-first-card");
    }
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div
      className={`${bricolage.className} min-h-screen w-full bg-white text-[#17151d]`}
    >
      {/* STORE HERO CAROUSEL */}
      <section
        aria-label="Store highlights"
        className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8"
      >
        <div className="relative isolate w-full overflow-hidden rounded-[22px] bg-[#100b1c] text-white shadow-[0_18px_55px_rgba(16,11,28,0.16)] sm:rounded-[28px]">
          {/* Reduced mobile hero height */}
          <div className="relative h-[300px] w-full sm:h-[500px]">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.image}
                aria-hidden={index !== heroSlide}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === heroSlide
                    ? "z-10 opacity-100"
                    : "z-0 opacity-0"
                }`}
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(10, 6, 20, 0.94) 0%, rgba(16, 11, 28, 0.82) 42%, rgba(16, 11, 28, 0.28) 100%), linear-gradient(0deg, rgba(16, 11, 28, 0.35), rgba(16, 11, 28, 0.08)), url("${slide.image}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="mx-auto flex h-full w-full items-center pl-16 pr-11 pb-8 pt-10 sm:pl-24 sm:pr-16 sm:py-16 lg:pl-28 lg:pr-20">
                  <div className="w-full max-w-[680px] min-w-0">
                    <p className="mb-2 max-w-full truncate text-[9px] font-bold uppercase tracking-[0.14em] text-white/80 sm:mb-5 sm:text-[11px] sm:tracking-[0.2em]">
                      {slide.eyebrow}
                    </p>

                    <h1 className="max-w-[620px] break-words text-[25px] font-bold leading-[1.04] tracking-[-0.045em] sm:text-[48px] sm:leading-[1.04] lg:text-[64px]">
                      {slide.title}
                      <span className="block bg-gradient-to-r from-[#c5a8ff] via-[#9b70ff] to-[#ffcc00] bg-clip-text text-transparent">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="mt-2 max-w-[540px] text-[11px] leading-[1.45] text-white/75 sm:mt-5 sm:text-[15px] sm:leading-7 lg:text-[16px]">
                      {slide.description}
                    </p>

                    <div className="mt-3 flex max-w-full flex-wrap items-center gap-2 sm:mt-7 sm:gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("discover-products")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            })
                        }
                        className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-[9px] bg-[#8c52ff] px-3 text-[11px] font-bold text-white shadow-[0_8px_24px_rgba(140,82,255,0.25)] transition hover:-translate-y-0.5 hover:bg-[#9b6aff] sm:h-12 sm:rounded-[11px] sm:px-6 sm:text-[13px]"
                      >
                        {slide.buttonLabel}
                        <ChevronRight size={15} className="ml-1.5 sm:ml-2 sm:h-4 sm:w-4" />
                      </button>

                      <span className="hidden max-w-full text-[9px] font-medium leading-4 tracking-wide text-white/65 sm:inline sm:text-[12px] sm:leading-5">
                        {slide.caption}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => navigateHero("left")}
              aria-label="Previous hero slide"
              className="absolute left-2.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition hover:border-white/50 hover:bg-black/50 sm:left-7 sm:h-12 sm:w-12"
            >
              <ChevronLeft size={18} className="sm:h-[22px] sm:w-[22px]" />
            </button>

            <button
              type="button"
              onClick={() => navigateHero("right")}
              aria-label="Next hero slide"
              className="absolute right-2.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition hover:border-white/50 hover:bg-black/50 sm:right-7 sm:h-12 sm:w-12"
            >
              <ChevronRight size={18} className="sm:h-[22px] sm:w-[22px]" />
            </button>

            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-7">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => setHeroSlide(index)}
                  aria-label={`Go to hero slide ${index + 1}`}
                  aria-current={index === heroSlide ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === heroSlide
                      ? "w-8 bg-[#8c52ff]"
                      : "w-2 bg-white/55 hover:bg-white/85"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="w-full min-w-0">
            <p className="mb-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#8c52ff] sm:text-[10px]">
              Curated for Builders
            </p>

            <h2 className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#30106f] bg-clip-text text-[23px] font-bold tracking-[-0.02em] text-transparent sm:text-[27px]">
              Featured Products
            </h2>

            <p className="mt-1 max-w-[620px] text-[12px] leading-5 text-[#716d78] sm:text-[13px]">
              Handpicked products for electronics, IoT and STEM projects.
            </p>
          </div>

          {/* DESKTOP NAVIGATION ARROWS */}
          {!showAllFeatured && !isMobile && !isTabletOrMedium && (
            <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
              <button
                type="button"
                onClick={() => navigateFeatured("left")}
                disabled={featuredPage === 0}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-black/[0.10] bg-white text-[#17151d] transition hover:bg-[#f5f3fa] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Previous featured products"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigateFeatured("right")}
                disabled={
                  featuredPage >= featuredPageCount - 1
                }
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-black/[0.10] bg-white text-[#17151d] transition hover:bg-[#f5f3fa] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Next featured products"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* FEATURED PRODUCT CARDS */}
        <div
          id="featured-products-row"
          className={
            showAllFeatured
              ? "grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-6"
              : isMobile
                ? "flex w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : isTabletOrMedium
                  ? "flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  : "grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6"
          }
        >
          {visibleFeaturedProducts.map((product, index) => (
            <div
              key={product.id}
              id={
                index === 0
                  ? "featured-products-first-card"
                  : undefined
              }
              className={
                showAllFeatured
                  ? "w-full min-w-0"
                  : isMobile
                    ? "w-[calc((100%-8px)/2)] min-w-[calc((100%-8px)/2)] snap-start"
                    : isTabletOrMedium
                      ? "w-[calc((100%-36px)/4)] min-w-[calc((100%-36px)/4)] snap-start"
                      : "w-full min-w-0"
              }
            >
              <StoreProductCard
                product={product}
                imageUrl={imageMap.get(product.id) ?? null}
                addedProductId={addedProductId}
                isWishlisted={wishlist.includes(product.id)}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            </div>
          ))}

          {featuredProducts.length === 0 && (
            <div className="col-span-full w-full rounded-[18px] border border-black/[0.10] bg-white px-5 py-10 text-center text-[12px] text-[#716d78]">
              {error
                ? "Unable to load featured products."
                : "No featured products found."}
            </div>
          )}
        </div>

        {/* SEE ALL / SHOW LESS */}
        {featuredProducts.length > 0 && (
          <div className="flex justify-center pt-5 sm:pt-6">
            <button
              type="button"
              onClick={toggleFeaturedView}
              aria-expanded={showAllFeatured}
              aria-controls="featured-products-row"
              className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[10px] bg-[#5921c7] px-6 text-[12px] font-bold text-white transition hover:bg-[#6d32df] sm:h-[40px] sm:px-7 sm:text-[13px]"
            >
              {showAllFeatured ? "Show Less" : "See All"}

              <ChevronRight
                size={15}
                className={`transition-transform duration-200 ${
                  showAllFeatured ? "-rotate-90" : "rotate-90"
                }`}
              />
            </button>
          </div>
        )}
      </section>

      {/* DISCOVER PRODUCTS */}
      <section
        id="discover-products"
        className="mx-auto w-full max-w-[1400px] scroll-mt-28 px-4 pt-12 sm:px-6 sm:pt-14 lg:px-8"
      >
        <div className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:text-left">
          <div className="w-full min-w-0 sm:flex-1">
            <p className="mb-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#8c52ff] sm:text-[10px]">
              Explore the Collection
            </p>

            <h2 className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#30106f] bg-clip-text text-[23px] font-bold tracking-[-0.02em] text-transparent sm:text-[27px]">
              Discover Products
            </h2>

            <p className="mt-1 max-w-[620px] text-[12px] leading-5 text-[#716d78] sm:text-[13px]">
              Browse the complete collection of available products.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto sm:justify-end">
            <label className="flex h-[38px] items-center gap-2 rounded-[10px] border border-black/[0.10] bg-white px-3 text-[12px] font-semibold text-[#17151d] shadow-sm">
              <span className="text-[#716d78]">
                Sort by
              </span>

              <select
                value={discoverSort}
                onChange={(event) =>
                  setDiscoverSort(
                    event.target.value as typeof discoverSort
                  )
                }
                className="bg-transparent outline-none"
              >
                <option value="admin">Recommended</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>

            <div className="relative z-[60]">
              <button
                type="button"
                onClick={() =>
                  setDiscoverOpen((current) => !current)
                }
                className="flex h-[38px] min-w-[180px] items-center justify-between gap-3 rounded-[10px] border border-black/[0.10] bg-white px-3 text-[12px] font-semibold text-[#17151d] shadow-sm"
              >
                <span className="truncate">
                  {discoverCategory === "all"
                    ? "All Categories"
                    : categoryMap.get(discoverCategory)?.name ??
                      "All Categories"}
                </span>

                <ChevronDown
                  size={14}
                  className={
                    discoverOpen
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />
              </button>

              {discoverOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close category dropdown"
                    className="fixed inset-0 z-[90] cursor-default"
                    onClick={() => setDiscoverOpen(false)}
                  />

                  <div className="absolute right-0 top-[44px] z-[100] w-[220px] overflow-hidden rounded-[14px] border border-black/[0.08] bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null);
                        setDiscoverCategory("all");
                        setDiscoverOpen(false);
                        setDiscoverMobileVisible(5);
                        setDiscoverRows(2);
                        setShowAllDiscover(false);
                      }}
                      className="flex w-full items-center justify-between rounded-[9px] px-3 py-2.5 text-left text-[12px] font-medium hover:bg-[#f5f3fa]"
                    >
                      <span>All Categories</span>

                      {discoverCategory === "all" && (
                        <Check
                          size={14}
                          className="text-[#5921c7]"
                        />
                      )}
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(null);
                          setDiscoverCategory(category.id);
                          setDiscoverOpen(false);
                          setDiscoverRows(2);
                          setDiscoverMobileVisible(5);
                          setShowAllDiscover(false);
                        }}
                        className="flex w-full items-center justify-between rounded-[9px] px-3 py-2.5 text-left text-[12px] font-medium hover:bg-[#f5f3fa]"
                      >
                        <span>{category.name}</span>

                        {discoverCategory === category.id && (
                          <Check
                            size={14}
                            className="text-[#5921c7]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* DISCOVER PRODUCT CARDS */}
        <div
          id="discover-products-row"
          className={
            showAllDiscover
              ? "grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-6"
              : isMobile
                ? "flex w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : isTabletOrMedium
                  ? "flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  : "grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6"
          }
        >
          {visibleDiscoverProducts.map((product, index) => (
            <div
              key={product.id}
              id={
                index === 0
                  ? "discover-products-first-card"
                  : undefined
              }
              className={
                showAllDiscover
                  ? "w-full min-w-0"
                  : isMobile
                    ? "w-[calc((100%-8px)/2)] min-w-[calc((100%-8px)/2)] snap-start"
                    : isTabletOrMedium
                      ? "w-[calc((100%-36px)/4)] min-w-[calc((100%-36px)/4)] snap-start"
                      : "w-full min-w-0"
              }
            >
              <StoreProductCard
                product={product}
                imageUrl={imageMap.get(product.id) ?? null}
                addedProductId={addedProductId}
                isWishlisted={wishlist.includes(product.id)}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            </div>
          ))}

          {discoverProducts.length === 0 && (
            <div className="col-span-full w-full rounded-[18px] border border-black/[0.10] bg-white px-5 py-10 text-center text-[12px] text-[#716d78]">
              {error
                ? "Unable to load products."
                : "No products found for this category."}
            </div>
          )}
        </div>

        {/* SEE ALL / SHOW LESS */}
        {discoverProducts.length > 0 && (
          <div className="flex justify-center pt-5 sm:pt-6">
            <button
              type="button"
              onClick={toggleDiscoverView}
              aria-expanded={showAllDiscover}
              aria-controls="discover-products-row"
              className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[10px] bg-[#5921c7] px-6 text-[12px] font-bold text-white transition hover:bg-[#6d32df] sm:h-[40px] sm:px-7 sm:text-[13px]"
            >
              {showAllDiscover ? "Show Less" : "See All"}

              <ChevronRight
                size={15}
                className={`transition-transform duration-200 ${
                  showAllDiscover ? "-rotate-90" : "rotate-90"
                }`}
              />
            </button>
          </div>
        )}
      </section>

      {/* WHY BUY FROM US */}
      <section className="relative mt-14 overflow-hidden bg-[#100b1c] py-12 text-white sm:mt-16 sm:py-16">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#5921c7]/25 blur-[90px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#8c52ff]/20 blur-[90px]" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-[680px] text-center sm:mb-10">
            <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#c5a8ff] sm:text-[10px]">
              The Adroiit Advantage
            </p>

            <h2 className="bg-gradient-to-r from-[#c5a8ff] via-[#9b70ff] to-[#ffcc00] bg-clip-text text-[25px] font-bold tracking-[-0.03em] text-transparent sm:text-[32px]">
              Why Shop from Us
            </h2>

            <p className="mx-auto mt-2 max-w-[580px] text-[12px] leading-5 text-white/65 sm:text-[14px] sm:leading-6">
              More than components — a practical ecosystem for learning, building and bringing ideas to life.
            </p>
          </div>

          {/* TWO SQUARE CARDS PER ROW ON MOBILE AND TABLET */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              {
                icon: Truck,
                title: "Same Day Dispatch",
                description:
                  "Orders are prepared and dispatched promptly so you can get started on your projects sooner.",
              },
              {
                icon: Tags,
                title: "Competitive Pricing",
                description:
                  "Find essential components at fair, competitive prices for projects, labs and learning.",
              },
              {
                icon: Headphones,
                title: "Dedicated Customer Service",
                description:
                  "Get helpful assistance with product enquiries, order updates and component selection.",
              },
              {
                icon: ShieldCheck,
                title: "Trust and Reliability",
                description:
                  "Shop with confidence through a dependable experience and a team focused on technology.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="flex aspect-square flex-col justify-center rounded-[14px] border border-white/10 bg-white/[0.045] p-3 transition duration-200 hover:-translate-y-1 hover:border-[#8c52ff]/60 hover:bg-white/[0.07] sm:rounded-[16px] sm:p-5 lg:aspect-auto lg:min-h-[250px] lg:p-6"
                >
                  <div className="mb-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#8c52ff]/35 bg-[#5921c7]/25 text-[#c5a8ff] sm:mb-4 sm:h-11 sm:w-11 sm:rounded-[12px]">
                    <Icon size={19} strokeWidth={1.8} className="sm:h-[21px] sm:w-[21px]" />
                  </div>

                  <h3 className="text-[12px] font-bold leading-4 text-white sm:text-[14px] sm:leading-5 lg:text-[16px]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 line-clamp-4 text-[10px] leading-[15px] text-white/60 sm:mt-2 sm:text-[12px] sm:leading-5 lg:text-[13px] lg:leading-6">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative overflow-hidden bg-[#f8f6fc] px-4 py-14 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto w-full max-w-[1350px]">
          <div className="mb-8 flex flex-col items-center justify-between gap-5 text-center sm:mb-10 md:flex-row md:items-end md:text-left">
            <div className="max-w-[680px]">
              <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#8c52ff] sm:text-[10px]">
                Customer Experiences
              </p>

              <h2 className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#30106f] bg-clip-text text-[25px] font-bold tracking-[-0.03em] text-transparent sm:text-[32px]">
                What Our Customers Say
              </h2>

              <p className="mt-2 max-w-[700px] text-[12px] leading-5 text-[#716d78] sm:text-[14px] sm:leading-6">
                Feedback from learners, educators and project builders who use components to bring ideas to life.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {visibleTestimonials.map((item, index) => (
              <article
                key={`${testimonialPage}-${index}-${item.name}`}
                className="relative flex min-h-[210px] flex-col overflow-hidden rounded-[18px] border border-[#5921c7]/10 bg-white p-5 shadow-[0_12px_35px_rgba(48,16,111,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(48,16,111,0.11)] sm:p-6"
              >
                <div className="mb-4 flex items-center justify-end">
                  <Quote
                    size={27}
                    className="text-[#8c52ff]/25"
                    strokeWidth={2}
                  />
                </div>

                <p className="text-[13px] leading-6 text-[#514b5d] sm:text-[14px] sm:leading-7">
                  “{item.testimonial}”
                </p>

                <div className="mt-auto mt-6 flex items-center gap-3 border-t border-[#5921c7]/10 pt-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5921c7] to-[#8c52ff] text-[13px] font-bold text-white">
                    {item.name.slice(0, 1)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-[#17151d] sm:text-[14px]">
                      {item.name}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {testimonialPageCount > 1 && (
            <div className="mt-7 flex justify-center gap-2">
              {Array.from({ length: testimonialPageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setTestimonialPage(index)}
                  aria-label={`Show testimonial group ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === testimonialPage
                      ? "w-8 bg-gradient-to-r from-[#5921c7] to-[#8c52ff]"
                      : "w-2 bg-[#d8d3e2] hover:bg-[#a99bbf]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BULK ORDERS CALL TO ACTION */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f8f6fc] via-[#f1ebff] to-[#e9e0fb] px-4 py-14 sm:px-6 sm:py-9 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-0 -z-10 h-72 w-72 rounded-full bg-[#8c52ff]/15 blur-[100px]" />

        <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-[#5921c7]/15 blur-[100px]" />

        <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center text-center">
          <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#5921c7] sm:text-[10px]">
            Bulk Orders & Institutional Enquiries
          </p>

          <h2 className="max-w-[800px] text-[27px] font-bold leading-tight tracking-[-0.035em] text-[#201533] sm:text-[38px] lg:text-[44px]">
            Sourcing Components in Bulk?

            <span className="block bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#30106f] bg-clip-text text-transparent">
              Let’s Build Something Bigger.
            </span>
          </h2>

          <p className="mt-4 max-w-[720px] text-[12px] leading-6 text-[#5e566d] sm:text-[14px] sm:leading-7">
            Get in touch for bulk component requirements, institutional purchases, school and college labs, and project-based orders. Our team will help you find the right products for your needs.
          </p>

          <a
            href="https://wa.me/918870002908?text=Hello%20Adroiit%20Technovations%2C%20I%20am%20interested%20in%20bulk%20component%20orders.%20Please%20share%20more%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-[11px] bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-6 text-[12px] font-bold text-white shadow-[0_10px_25px_rgba(89,33,199,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(89,33,199,0.28)] sm:h-12 sm:px-7 sm:text-[13px]"
          >
            Enquire for Bulk Orders

            <ChevronRight size={17} className="ml-2" />
          </a>
        </div>
      </section>

      {/* STORE LOAD ERROR */}
      {error && (
        <div className="mx-auto max-w-[1400px] px-2 pb-10 sm:px-4">
          <div className="rounded-[14px] border border-[#d52f3f]/20 bg-[#fff7f7] px-4 py-3 text-[12px] text-[#a52835]">
            Unable to load store data: {error}
          </div>
        </div>
      )}
    </div>
  );
}
