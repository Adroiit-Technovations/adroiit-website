"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  type FormEvent,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  Heart,
  Home,
  LogIn,
  LogOut,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  UserRound,
  X,
  Loader2,
} from "lucide-react";

import { Bricolage_Grotesque } from "next/font/google";

import Navbar from "../../../components/Navbar";
import { createClient } from "@/lib/supabase/client";

// ============================================================
// CONFIGURATION
// ============================================================

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

const CART_STORAGE_KEY = "adroiit-store-cart";
const CART_EVENT_NAME = "adroiit-store-cart-updated";

const WISHLIST_STORAGE_KEY = "adroiit-store-wishlist";
const WISHLIST_EVENT_NAME = "adroiit-store-wishlist-updated";

const MAX_SEARCH_RESULTS = 6;
const MAX_SEARCH_CANDIDATES = 100;
const SEARCH_DEBOUNCE_DELAY = 180;

// ============================================================
// TYPES
// ============================================================

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
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

type ProductSuggestion = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
};

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  price: number;
  stock_quantity: number;
};

// ============================================================
// CART HELPERS
// ============================================================

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        item !== null &&
        typeof item === "object"
    )
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

    if (!raw) {
      return [];
    }

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
  } catch (error) {
    console.error("Unable to update cart:", error);
  }
}

// ============================================================
// WISHLIST HELPERS
// ============================================================

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(
      WISHLIST_STORAGE_KEY
    );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return [
      ...new Set(
        parsed.filter(
          (id): id is string =>
            typeof id === "string" && id.length > 0
        )
      ),
    ];
  } catch {
    return [];
  }
}

// ============================================================
// FORMATTERS
// ============================================================

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function isRemoteImage(src: string) {
  return /^https?:\/\//i.test(src);
}

// ============================================================
// SEARCH HELPERS
// ============================================================

/**
 * Converts the search input into unique, normalized keywords.
 *
 * Supports Unicode letters and numbers, so product names
 * containing non-English characters are not discarded.
 */
function getSearchWords(value: string): string[] {
  const normalized = value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim();

  const matches =
    normalized.match(/[\p{L}\p{N}_-]+/gu) ?? [];

  return [...new Set(matches.filter(Boolean))];
}

/**
 * Normalizes product fields before comparing them with
 * the user's search keywords.
 */
function normalizeSearchText(
  value: string | null | undefined
) {
  return (value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim();
}

/**
 * Removes characters that can interfere with the
 * PostgREST filter expression.
 */
function escapeSearchValue(value: string): string {
  return value
    .replace(/[%_,().*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calculates how relevant a product is to the search.
 *
 * Higher scores indicate stronger matches.
 */
function getProductRelevanceScore(
  product: SearchProduct,
  searchTerm: string,
  searchWords: string[]
): number {
  const name = normalizeSearchText(product.name);
  const slug = normalizeSearchText(product.slug);
  const sku = normalizeSearchText(product.sku);
  const description = normalizeSearchText(
    product.short_description
  );

  const fullSearch = normalizeSearchText(searchTerm);

  let score = 0;

  // ----------------------------------------------------------
  // EXACT AND PARTIAL FULL-PHRASE MATCHES
  // ----------------------------------------------------------

  if (name === fullSearch) {
    score += 1000;
  } else if (name.startsWith(fullSearch)) {
    score += 500;
  } else if (name.includes(fullSearch)) {
    score += 300;
  }

  if (sku && sku === fullSearch) {
    score += 400;
  } else if (sku && sku.includes(fullSearch)) {
    score += 200;
  }

  if (slug === fullSearch) {
    score += 150;
  } else if (slug.includes(fullSearch)) {
    score += 75;
  }

  // ----------------------------------------------------------
  // INDIVIDUAL KEYWORD MATCHES
  // ----------------------------------------------------------

  let matchedWords = 0;

  for (const word of searchWords) {
    let wordMatched = false;

    // Product name has the highest keyword weight.
    if (name === word) {
      score += 120;
      wordMatched = true;
    } else if (name.startsWith(word)) {
      score += 90;
      wordMatched = true;
    } else if (name.includes(word)) {
      score += 65;
      wordMatched = true;
    }

    // SKU matches are highly relevant.
    if (sku === word) {
      score += 100;
      wordMatched = true;
    } else if (sku.startsWith(word)) {
      score += 75;
      wordMatched = true;
    } else if (sku.includes(word)) {
      score += 55;
      wordMatched = true;
    }

    // Slug matches.
    if (slug === word) {
      score += 55;
      wordMatched = true;
    } else if (slug.startsWith(word)) {
      score += 40;
      wordMatched = true;
    } else if (slug.includes(word)) {
      score += 25;
      wordMatched = true;
    }

    // Description matches receive a lower weight.
    if (description.includes(word)) {
      score += 15;
      wordMatched = true;
    }

    if (wordMatched) {
      matchedWords++;
    }
  }

  // ----------------------------------------------------------
  // MULTI-KEYWORD MATCH BONUS
  // ----------------------------------------------------------

  if (searchWords.length > 1) {
    if (matchedWords === searchWords.length) {
      score += 150;
    } else if (matchedWords > 0) {
      score += matchedWords * 10;
    }
  }

  // ----------------------------------------------------------
  // STOCK PRIORITY
  // ----------------------------------------------------------

  if (Number(product.stock_quantity) > 0) {
    score += 5;
  }

  return score;
}

// ============================================================
// COMPONENT
// ============================================================

export default function StoreNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const searchRequestRef = useRef(0);

  // ----------------------------------------------------------
  // CATEGORY STATE
  // ----------------------------------------------------------

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ----------------------------------------------------------
  // SEARCH STATE
  // ----------------------------------------------------------

  const [searchTerm, setSearchTerm] = useState("");

  const [searchSuggestions, setSearchSuggestions] = useState<
    ProductSuggestion[]
  >([]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // ----------------------------------------------------------
  // CART STATE
  // ----------------------------------------------------------

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ----------------------------------------------------------
  // WISHLIST STATE
  // ----------------------------------------------------------

  const [wishlistCount, setWishlistCount] = useState(0);

  // ----------------------------------------------------------
  // ACCOUNT STATE
  // ----------------------------------------------------------

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);

    try {
      const { data, error } = await supabase
        .from("categories")
        .select(
          "id,name,slug,description,image_url,is_active,sort_order"
        )
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      setCategories((data ?? []) as Category[]);
    } catch (error) {
      console.error(
        "Unable to load store categories:",
        error
      );

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  // ==========================================================
  // CART INITIALIZATION AND SYNCHRONIZATION
  // ==========================================================

  useEffect(() => {
    const syncCart = () => {
      setCart(readCart());
    };

    syncCart();

    window.addEventListener("storage", syncCart);
    window.addEventListener(
      CART_EVENT_NAME,
      syncCart
    );

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(
        CART_EVENT_NAME,
        syncCart
      );
    };
  }, []);

  // ==========================================================
  // WISHLIST INITIALIZATION AND SYNCHRONIZATION
  // ==========================================================

  useEffect(() => {
    const syncWishlist = () => {
      setWishlistCount(readWishlist().length);
    };

    syncWishlist();

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

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (error) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(Boolean(user));
    };

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        const authenticated = Boolean(session?.user);

        setIsAuthenticated(authenticated);

        if (!authenticated) {
          setAccountMenuOpen(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // ==========================================================
  // CART DERIVED VALUES
  // ==========================================================

  const cartItemCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  // ==========================================================
  // KEYWORD-BASED PRODUCT SEARCH
  // ==========================================================

  useEffect(() => {
    const words = getSearchWords(searchTerm);
    const requestId = ++searchRequestRef.current;

    if (words.length === 0) {
      setSearchSuggestions([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchSuggestions([]);

    const searchProducts = async () => {
      try {
        const filters = words.flatMap((word) => {
          const safeWord = escapeSearchValue(word);

          if (!safeWord) {
            return [];
          }

          const pattern = `%${safeWord}%`;

          return [
            `name.ilike.${pattern}`,
            `slug.ilike.${pattern}`,
            `sku.ilike.${pattern}`,
            `short_description.ilike.${pattern}`,
          ];
        });

        if (filters.length === 0) {
          if (requestId === searchRequestRef.current) {
            setSearchSuggestions([]);
            setSearchLoading(false);
          }

          return;
        }

        // ----------------------------------------------------
        // FETCH SEARCH CANDIDATES
        // ----------------------------------------------------

        const { data: products, error } = await supabase
          .from("products")
          .select(
            "id,name,slug,sku,short_description,price,stock_quantity"
          )
          .eq("is_active", true)
          .or(filters.join(","))
          .limit(MAX_SEARCH_CANDIDATES);

        if (error) {
          throw error;
        }

        if (requestId !== searchRequestRef.current) {
          return;
        }

        const productRows = (products ?? []) as SearchProduct[];

        if (productRows.length === 0) {
          setSearchSuggestions([]);
          setSearchLoading(false);
          return;
        }

        // ----------------------------------------------------
        // RANK PRODUCTS BY KEYWORD RELEVANCE
        // ----------------------------------------------------

        const rankedProducts = productRows
          .map((product) => ({
            product,
            score: getProductRelevanceScore(
              product,
              searchTerm,
              words
            ),
          }))
          .sort((a, b) => {
            // Highest relevance first.
            if (b.score !== a.score) {
              return b.score - a.score;
            }

            // Prefer available stock when scores are equal.
            const aInStock =
              Number(a.product.stock_quantity) > 0;

            const bInStock =
              Number(b.product.stock_quantity) > 0;

            if (aInStock !== bInStock) {
              return aInStock ? -1 : 1;
            }

            // Alphabetical fallback.
            return a.product.name.localeCompare(
              b.product.name
            );
          })
          .slice(0, MAX_SEARCH_RESULTS)
          .map((item) => item.product);

        // ----------------------------------------------------
        // FETCH IMAGES FOR THE TOP MATCHES ONLY
        // ----------------------------------------------------

        const productIds = rankedProducts.map(
          (product) => product.id
        );

        const {
          data: productImages,
          error: imageError,
        } = await supabase
          .from("product_images")
          .select("product_id,image_url,sort_order")
          .in("product_id", productIds)
          .order("sort_order", {
            ascending: true,
          });

        if (imageError) {
          console.error(
            "Unable to load product suggestion images:",
            imageError
          );
        }

        if (requestId !== searchRequestRef.current) {
          return;
        }

        // ----------------------------------------------------
        // MAP PRODUCT IMAGES
        // ----------------------------------------------------

        const imageByProductId = new Map<string, string>();

        for (const image of productImages ?? []) {
          if (
            image.product_id &&
            image.image_url &&
            !imageByProductId.has(image.product_id)
          ) {
            imageByProductId.set(
              image.product_id,
              image.image_url
            );
          }
        }

        // ----------------------------------------------------
        // BUILD FINAL SUGGESTIONS
        // ----------------------------------------------------

        const suggestions: ProductSuggestion[] =
          rankedProducts.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku ?? null,
            short_description:
              product.short_description ?? null,
            price: Number(product.price ?? 0),
            stock_quantity: Number(
              product.stock_quantity ?? 0
            ),
            image_url:
              imageByProductId.get(product.id) ?? null,
          }));

        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error(
          "Unable to search store products:",
          error
        );

        if (requestId === searchRequestRef.current) {
          setSearchSuggestions([]);
        }
      } finally {
        if (requestId === searchRequestRef.current) {
          setSearchLoading(false);
        }
      }
    };

    // --------------------------------------------------------
    // DEBOUNCE SEARCH REQUESTS
    // --------------------------------------------------------

    const timeoutId = window.setTimeout(() => {
      void searchProducts();
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);

      if (searchRequestRef.current === requestId) {
        searchRequestRef.current++;
      }
    };
  }, [searchTerm, supabase]);

  // ==========================================================
  // CART ACTIONS
  // ==========================================================

  const updateQuantity = useCallback(
    (productId: string, change: number) => {
      const currentCart = readCart();

      const updatedCart = currentCart.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const maximum =
          item.stockQuantity > 0
            ? item.stockQuantity
            : 1;

        const nextQuantity = Math.min(
          maximum,
          Math.max(1, item.quantity + change)
        );

        return {
          ...item,
          quantity: nextQuantity,
        };
      });

      writeCart(updatedCart);
      setCart(updatedCart);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string) => {
      const updatedCart = readCart().filter(
        (item) => item.productId !== productId
      );

      writeCart(updatedCart);
      setCart(updatedCart);
    },
    []
  );

  // ==========================================================
  // SEARCH ACTIONS
  // ==========================================================

  const handleSearch = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      const term = searchTerm.trim();

      if (!term) {
        return;
      }

      setCategoriesOpen(false);
      setAccountMenuOpen(false);
      setSearchOpen(false);

      router.push(
        `/store?search=${encodeURIComponent(term)}`
      );
    },
    [router, searchTerm]
  );

  const handleSuggestionClick = useCallback(() => {
    setSearchOpen(false);
    setSearchTerm("");
    setSearchSuggestions([]);
    setSearchLoading(false);
    setCategoriesOpen(false);
    setAccountMenuOpen(false);
  }, []);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = useCallback(async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setIsAuthenticated(false);
      setAccountMenuOpen(false);

      router.push("/store/CustomerLogin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }, [loggingOut, router, supabase]);

  // ==========================================================
  // CATEGORY NAVIGATION
  // ==========================================================

  const handleCategoryClick = useCallback(
    (slug?: string) => {
      setCategoriesOpen(false);
      setAccountMenuOpen(false);

      if (!slug) {
        router.push("/store#discover-products");
        return;
      }

      router.push(
        `/store?category=${encodeURIComponent(slug)}#discover-products`
      );
    },
    [router]
  );

  // ==========================================================
  // CLOSE MENUS WHEN ROUTE CHANGES
  // ==========================================================

  useEffect(() => {
    setCategoriesOpen(false);
    setAccountMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // ==========================================================
  // HOME NAVIGATION
  // ==========================================================

  const handleHomeClick = useCallback(() => {
    setCategoriesOpen(false);
    setAccountMenuOpen(false);
    setCartOpen(false);
    setSearchOpen(false);

    if (pathname === "/store") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    router.push("/store");
  }, [pathname, router]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`${bricolage.className} relative z-[100] min-h-0 w-full bg-white text-[#17151d]`}
    >
      {/* ======================================================
          GLOBAL ADROIIT NAVIGATION
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          STORE NAVIGATION
      ====================================================== */}

      <div className="w-full bg-white px-2 pt-[112px] sm:px-4 sm:pt-[120px]">
        <div className="mx-auto w-full max-w-[1350px]">
          <nav className="relative rounded-[20px] border border-black/[0.08] bg-white px-2 py-2 sm:px-4">
            <div className="flex min-h-[48px] items-center gap-1.5 sm:gap-2">

              {/* HOME BUTTON */}

              <button
                type="button"
                onClick={handleHomeClick}
                aria-label="Go to main store page"
                title="Store Home"
                className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border transition-all sm:h-[40px] sm:w-[40px] ${
                  pathname === "/store"
                    ? "border-[#5921c7]/30 bg-[#5921c7]/[0.07] text-[#5921c7]"
                    : "border-black/[0.09] bg-white text-gray-700 hover:border-[#5921c7]/30 hover:bg-[#5921c7]/[0.04] hover:text-[#5921c7]"
                }`}
              >
                <Home size={18} strokeWidth={2} />
              </button>

              {/* EXPLORE CATEGORIES */}

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setCategoriesOpen((previous) => !previous);
                    setAccountMenuOpen(false);
                    setSearchOpen(false);
                  }}
                  aria-expanded={categoriesOpen}
                  aria-label="Explore categories"
                  title="Explore Categories"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-black/[0.09] bg-white text-gray-800 transition-all hover:border-[#5921c7]/30 hover:bg-[#5921c7]/[0.04] hover:text-[#5921c7] sm:h-[40px] sm:w-auto sm:gap-2 sm:px-4"
                >
                  <Menu size={17} />

                  <span className="hidden text-sm font-semibold sm:inline">
                    Explore Categories
                  </span>

                  <ChevronDown
                    size={14}
                    className={`hidden transition-transform duration-200 sm:block ${
                      categoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {categoriesOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close categories menu"
                      className="fixed inset-0 z-[110] cursor-default"
                      onClick={() => setCategoriesOpen(false)}
                    />

                    <div className="absolute left-0 top-[48px] z-[120] w-[270px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-2 shadow-[0_15px_50px_rgba(0,0,0,0.15)] sm:w-[310px]">
                      <button
                        type="button"
                        onClick={() => handleCategoryClick()}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#5921c7] transition-colors hover:bg-[#5921c7]/[0.06]"
                      >
                        <span>All Categories</span>
                        <ChevronRight size={15} />
                      </button>

                      <div className="my-1 h-px bg-black/[0.06]" />

                      {categoriesLoading ? (
                        <div className="px-3 py-5 text-center text-sm text-gray-500">
                          Loading categories...
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="px-3 py-5 text-center text-sm text-gray-500">
                          No categories available.
                        </div>
                      ) : (
                        <div className="max-h-[320px] overflow-y-auto">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() =>
                                handleCategoryClick(category.slug)
                              }
                              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-[#5921c7]/[0.06] hover:text-[#5921c7]"
                            >
                              <span className="min-w-0 truncate">
                                {category.name}
                              </span>

                              <ChevronRight
                                size={15}
                                className="ml-2 shrink-0 text-gray-400"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* SEARCH BAR + INSTANT RECOMMENDATIONS */}

              <div className="relative min-w-0 flex-1">
                <form
                  onSubmit={handleSearch}
                  className="flex h-[38px] min-w-0 items-center rounded-full border border-black/[0.08] bg-[#f8f7fa] px-2.5 transition-all focus-within:border-[#5921c7]/40 focus-within:bg-white sm:px-4"
                >
                  <Search
                    size={17}
                    className="mr-2 shrink-0 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => {
                      if (searchTerm.trim().length > 0) {
                        setSearchOpen(true);
                      }
                    }}
                    placeholder="Search products..."
                    aria-label="Search products"
                    aria-expanded={searchOpen}
                    autoComplete="off"
                    className="h-full w-full min-w-0 border-0 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  />
                </form>

                {/* LIVE SEARCH DROPDOWN */}

                {searchOpen &&
                  searchTerm.trim().length > 0 && (
                    <>
                      <button
                        type="button"
                        aria-label="Close search recommendations"
                        className="fixed inset-0 z-[110] cursor-default"
                        onClick={() => setSearchOpen(false)}
                      />

                      <div className="absolute left-0 right-0 top-[46px] z-[120] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.15)]">
                        <div className="border-b border-black/[0.06] px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Product Recommendations
                          </p>
                        </div>

                        {searchLoading ? (
                          <div className="flex items-center justify-center gap-2 px-4 py-7 text-sm text-gray-500">
                            <Loader2
                              size={17}
                              className="animate-spin text-[#5921c7]"
                            />
                            Finding relevant products...
                          </div>
                        ) : searchSuggestions.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#5921c7]/[0.06]">
                              <Package
                                size={20}
                                className="text-[#5921c7]"
                              />
                            </div>

                            <p className="mt-3 text-sm font-semibold text-gray-700">
                              No matching products found
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Try another product name, keyword or SKU.
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-[360px] overflow-y-auto p-2">
                            {searchSuggestions.map((product) => (
                              <Link
                                key={product.id}
                                href={`/store/${product.slug}`}
                                onClick={handleSuggestionClick}
                                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#5921c7]/[0.05]"
                              >
                                <div className="relative h-[54px] w-[54px] shrink-0 overflow-hidden rounded-lg border border-black/[0.06] bg-gray-50">
                                  {product.image_url ? (
                                    <Image
                                      src={product.image_url}
                                      alt={product.name}
                                      fill
                                      sizes="54px"
                                      unoptimized={isRemoteImage(
                                        product.image_url
                                      )}
                                      className="object-contain p-1"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <Package
                                        size={21}
                                        className="text-gray-300"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                                    {product.name}
                                  </p>

                                  {product.short_description && (
                                    <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">
                                      {product.short_description}
                                    </p>
                                  )}

                                  <p className="mt-1 text-xs font-bold text-[#5921c7]">
                                    {formatMoney(product.price)}
                                  </p>
                                </div>

                                <ChevronRight
                                  size={16}
                                  className="shrink-0 text-gray-400"
                                />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
              </div>

              {/* CART BUTTON */}

              <button
                type="button"
                onClick={() => {
                  setCart(readCart());
                  setCartOpen(true);
                  setCategoriesOpen(false);
                  setAccountMenuOpen(false);
                  setSearchOpen(false);
                }}
                aria-label={`Open shopping cart, ${cartItemCount} items, subtotal ${formatMoney(cartSubtotal)}`}
                title="Shopping Cart"
                className="group relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-black/[0.09] bg-white text-gray-700 transition-all hover:border-[#5921c7]/30 hover:bg-[#5921c7]/[0.04] hover:text-[#5921c7] sm:h-[42px] sm:w-auto sm:gap-2.5 sm:px-3"
              >
                <ShoppingCart
                  size={19}
                  className="shrink-0"
                />

                <span className="hidden text-sm font-bold text-gray-700 transition-colors duration-200 group-hover:text-[#5921c7] sm:inline">
                  {formatMoney(cartSubtotal)}
                </span>

                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#5921c7] px-1 text-[9px] font-bold text-white">
                    {cartItemCount > 99
                      ? "99+"
                      : cartItemCount}
                  </span>
                )}
              </button>

              {/* WISHLIST BUTTON */}

              <Link
                href="/store/wishlist"
                onClick={() => {
                  setCategoriesOpen(false);
                  setAccountMenuOpen(false);
                  setSearchOpen(false);
                  setCartOpen(false);
                }}
                aria-label={`Open wishlist, ${wishlistCount} saved ${wishlistCount === 1 ? "item" : "items"}`}
                title="Wishlist"
                className={`group relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border transition-all duration-200 sm:h-[42px] sm:w-[42px] ${
                  pathname === "/store/wishlist"
                    ? "border-[#e53945]/40 bg-[#fff0f1] text-[#e53945] hover:border-[#e53945]/50 hover:bg-[#ffe5e7]"
                    : "border-black/[0.09] bg-white text-gray-700 hover:border-[#e53945]/40 hover:bg-[#fff0f1] hover:text-[#e53945]"
                }`}
              >
                <Heart
                  size={19}
                  strokeWidth={2}
                  className="transition-colors duration-200"
                />

                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e53945] px-1 text-[9px] font-bold text-white">
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}
              </Link>

              {/* ORDERS BUTTON */}

              <Link
                href="/store/orders"
                onClick={() => {
                  setCategoriesOpen(false);
                  setAccountMenuOpen(false);
                  setSearchOpen(false);
                  setCartOpen(false);
                }}
                aria-label="View my orders"
                title="My Orders"
                className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border transition-all duration-200 sm:h-[42px] sm:w-[42px] ${
                  pathname === "/store/orders" ||
                  pathname.startsWith("/store/orders/")
                    ? "border-[#5921c7]/30 bg-[#5921c7]/[0.07] text-[#5921c7]"
                    : "border-black/[0.09] bg-white text-gray-700 hover:border-[#5921c7]/30 hover:bg-[#5921c7]/[0.04] hover:text-[#5921c7]"
                }`}
              >
                <ShoppingBag
                  size={19}
                  strokeWidth={2}
                />
              </Link>

              {/* ACCOUNT BUTTON */}

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen((previous) => !previous);
                    setCategoriesOpen(false);
                    setSearchOpen(false);
                  }}
                  aria-label="Account menu"
                  aria-expanded={accountMenuOpen}
                  title="Account"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-black/[0.09] bg-white text-gray-700 transition-all hover:border-[#5921c7]/30 hover:bg-[#5921c7]/[0.04] hover:text-[#5921c7] sm:h-[42px] sm:w-[42px]"
                >
                  <UserRound size={19} />
                </button>

                {accountMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close account menu"
                      className="fixed inset-0 z-[110] cursor-default"
                      onClick={() =>
                        setAccountMenuOpen(false)
                      }
                    />

                    <div className="absolute right-0 top-[48px] z-[120] w-[210px] overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-2 shadow-[0_15px_50px_rgba(0,0,0,0.15)]">
                      {isAuthenticated ? (
                        <>
                          <Link
                            href="/store/account"
                            onClick={() =>
                              setAccountMenuOpen(false)
                            }
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-[#5921c7]/[0.06] hover:text-[#5921c7]"
                          >
                            <UserRound size={16} />
                            My Account
                          </Link>

                          <div className="my-1 h-px bg-black/[0.06]" />

                          <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            <LogOut size={16} />

                            {loggingOut
                              ? "Signing out..."
                              : "Logout"}
                          </button>
                        </>
                      ) : (
                        <Link
                          href="/store/CustomerLogin"
                          onClick={() =>
                            setAccountMenuOpen(false)
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-[#5921c7]/[0.06] hover:text-[#5921c7]"
                        >
                          <LogIn size={16} />
                          Login
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* ======================================================
          CART DRAWER
      ====================================================== */}

      {cartOpen && (
        <div className="fixed inset-0 z-[200]">
          <button
            type="button"
            aria-label="Close shopping cart"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/30 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-[#5921c7]">
                  Your Cart
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {cartItemCount}{" "}
                  {cartItemCount === 1 ? "item" : "items"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-black"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#5921c7]/[0.06]">
                    <ShoppingCart
                      size={32}
                      className="text-[#5921c7]"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 max-w-[240px] text-sm leading-6 text-gray-500">
                    Explore our products and add something
                    to your cart.
                  </p>

                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-full bg-[#5921c7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4718a6]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 border-b border-black/[0.06] pb-5"
                    >
                      <Link
                        href={`/store/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border border-black/[0.06] bg-gray-50"
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="88px"
                            unoptimized={isRemoteImage(
                              item.imageUrl
                            )}
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package
                              size={27}
                              className="text-gray-300"
                            />
                          </div>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/store/${item.slug}`}
                            onClick={() =>
                              setCartOpen(false)
                            }
                            className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 transition-colors hover:text-[#5921c7]"
                          >
                            {item.name}
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.productId)
                            }
                            aria-label={`Remove ${item.name}`}
                            className="shrink-0 text-red-300 transition-colors hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p className="mt-1 text-sm font-bold text-gray-600">
                          {formatMoney(item.price)}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex h-[30px] items-center rounded-full border border-black/[0.10]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  -1
                                )
                              }
                              aria-label="Decrease quantity"
                              className="flex h-[30px] w-[30px] items-center justify-center text-gray-600 transition-colors hover:text-[#5921c7]"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="min-w-[25px] text-center text-xs font-semibold text-gray-800">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  1
                                )
                              }
                              disabled={
                                item.stockQuantity > 0 &&
                                item.quantity >=
                                  item.stockQuantity
                              }
                              aria-label="Increase quantity"
                              className="flex h-[30px] w-[30px] items-center justify-center text-gray-600 transition-colors hover:text-[#5921c7] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-gray-900">
                            {formatMoney(
                              item.price * item.quantity
                            )}
                          </span>
                        </div>

                        {item.stockQuantity > 0 &&
                          item.quantity >=
                            item.stockQuantity && (
                            <p className="mt-1 text-[10px] text-orange-600">
                              Maximum Stock Limit
                            </p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-black/[0.07] bg-white px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-bold text-[#5921c7]">
                    Subtotal
                  </span>

                  <span className="text-xl font-bold text-[#5921c7]">
                    {formatMoney(cartSubtotal)}
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-gray-500">
                  Subtotal inclusive of taxes, shipping will
                  be calculated at the checkout.
                </p>

                <Link
                  href="/store/checkout"
                  onClick={() => setCartOpen(false)}
                  className="mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#5921c7] text-sm font-semibold text-white transition-colors hover:bg-[#4718a6]"
                >
                  Proceed to Checkout
                  <ChevronRight size={17} />
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}