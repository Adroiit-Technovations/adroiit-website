"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { Bricolage_Grotesque } from "next/font/google";

import {
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  Tag,
  User,
  X,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public-client";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const CART_STORAGE_KEY = "adroiit-store-cart";
const CART_EVENT_NAME = "adroiit-store-cart-updated";
const TAX_RATE = 0.18;

type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  imageUrl: string | null;
};

type Address = {
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
};

type ShippingRate = {
  id: string;
  state_code: string;
  state_name: string;
  charge: number;
  is_active: boolean;
};

type StoreCoupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_count: number | null;
  per_customer_limit: number | null;
  is_active: boolean;
  show_on_checkout: boolean;
};

type SavedAddress = {
  id: string;
  user_id?: string;
  address_type?: string;
  full_name?: string | null;
  phone?: string | null;
  address_line_1: string;
  address_line_2: string | null;
  landmark: string | null;
  city: string;
  district?: string | null;
  state: string;
  postal_code: string;
  country?: string | null;
  is_default: boolean;
  created_at: string;
};

type CustomerProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (
    response: RazorpayResponse
  ) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: {
      error?: {
        code?: string;
        description?: string;
        source?: string;
        step?: string;
        reason?: string;
        metadata?: Record<string, unknown>;
      };
    }) => void
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayOptions
    ) => RazorpayInstance;
  }
}

const INDIAN_STATES_AND_UTS = [
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "CH", name: "Chandigarh" },
  {
    code: "DN",
    name: "Dadra and Nagar Haveli and Daman and Diu",
  },
  { code: "DL", name: "Delhi" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "PY", name: "Puducherry" },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        "productId" in item
    )
    .map((item: any) => ({
      productId: String(item.productId ?? ""),
      name: String(item.name ?? ""),
      slug: String(item.slug ?? ""),
      price: Number(item.price ?? 0),
      quantity: Math.max(1, Number(item.quantity ?? 1)),
      stockQuantity: Math.max(
        0,
        Number(item.stockQuantity ?? 0)
      ),
      imageUrl:
        typeof item.imageUrl === "string"
          ? item.imageUrl
          : null,
    }))
    .filter(
      (item) =>
        item.productId &&
        item.name &&
        item.quantity > 0
    );
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

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

function createEmptyAddress(): Address {
  return {
    address: "",
    city: "",
    state: "",
    pincode: "",
  };
}

function createEmptyCustomer(): CustomerDetails {
  return {
    name: "",
    phone: "",
    email: "",
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    email.trim()
  );
}

function getPhoneDigits(phone: string) {
  return phone
    .replace(/\D/g, "")
    .replace(/^91/, "");
}

function isValidPhone(phone: string) {
  return getPhoneDigits(phone).length === 10;
}

function isValidPincode(pincode: string) {
  return /^\d{6}$/.test(pincode.trim());
}

function getStateCode(stateName: string) {
  const state = INDIAN_STATES_AND_UTS.find(
    (item) =>
      item.name.toLowerCase() ===
      stateName.trim().toLowerCase()
  );

  return state?.code ?? null;
}

function formatSavedAddress(address: SavedAddress) {
  return [
    address.address_line_1,
    address.address_line_2,
    address.landmark,
  ]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

function getAuthCustomerName(user: {
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};

  const possibleNames = [
    metadata.full_name,
    metadata.name,
    metadata.display_name,
  ];

  const name = possibleNames.find(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  );

  return typeof name === "string" ? name.trim() : "";
}

function normalizeCustomerPhone(
  phone: string | null | undefined
) {
  if (!phone) {
    return "";
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  return phone.trim();
}

function getCouponDiscountPreview(
  coupon: StoreCoupon,
  subtotal: number
) {
  let discount = 0;

  if (coupon.discount_type === "PERCENTAGE") {
    discount =
      subtotal * (Number(coupon.discount_value) / 100);
  } else {
    discount = Number(coupon.discount_value);
  }

  if (
    coupon.max_discount_amount !== null &&
    coupon.max_discount_amount !== undefined &&
    Number(coupon.max_discount_amount) > 0
  ) {
    discount = Math.min(
      discount,
      Number(coupon.max_discount_amount)
    );
  }

  return Math.min(
    subtotal,
    Math.max(0, discount)
  );
}

function isCouponAvailable(coupon: StoreCoupon) {
  const now = Date.now();

  if (!coupon.is_active || !coupon.show_on_checkout) {
    return false;
  }

  if (
    coupon.starts_at &&
    new Date(coupon.starts_at).getTime() > now
  ) {
    return false;
  }

  if (
    coupon.expires_at &&
    new Date(coupon.expires_at).getTime() < now
  ) {
    return false;
  }

  const usageLimit = Number(coupon.usage_limit ?? 0);
  const usageCount = Number(coupon.usage_count ?? 0);

  if (
    usageLimit > 0 &&
    usageCount >= usageLimit
  ) {
    return false;
  }

  return true;
}

function getCouponOfferText(coupon: StoreCoupon) {
  if (coupon.discount_type === "PERCENTAGE") {
    return `${Number(coupon.discount_value)}% OFF`;
  }

  return `${formatMoney(
    Number(coupon.discount_value)
  )} OFF`;
}

function getCouponConditions(coupon: StoreCoupon) {
  const conditions: string[] = [];

  if (Number(coupon.min_order_amount ?? 0) > 0) {
    conditions.push(
      `Minimum order value: ${formatMoney(
        Number(coupon.min_order_amount)
      )}`
    );
  }

  if (
    coupon.max_discount_amount !== null &&
    coupon.max_discount_amount !== undefined &&
    Number(coupon.max_discount_amount) > 0 &&
    coupon.discount_type === "PERCENTAGE"
  ) {
    conditions.push(
      `Maximum discount: ${formatMoney(
        Number(coupon.max_discount_amount)
      )}`
    );
  }

  if (coupon.expires_at) {
    conditions.push(
      `Valid until ${new Date(
        coupon.expires_at
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`
    );
  }

  if (
    coupon.per_customer_limit !== null &&
    coupon.per_customer_limit !== undefined &&
    Number(coupon.per_customer_limit) > 0
  ) {
    conditions.push(
      `Limited to ${Number(
        coupon.per_customer_limit
      )} use(s) per customer`
    );
  }

  return conditions;
}

export default function CheckoutPage() {
  const router = useRouter();

  const supabase = useMemo(
    () => createPublicClient(),
    []
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [shippingRates, setShippingRates] =
    useState<ShippingRate[]>([]);

  const [shippingLoading, setShippingLoading] =
    useState(true);

  const [shippingSameAsBilling, setShippingSameAsBilling] =
    useState(true);

  const [customer, setCustomer] =
    useState<CustomerDetails>(createEmptyCustomer());

  const [customerLoading, setCustomerLoading] =
    useState(true);

  const [billing, setBilling] =
    useState<Address>(createEmptyAddress());

  const [shipping, setShipping] =
    useState<Address>(createEmptyAddress());

  const [useSavedAddress, setUseSavedAddress] =
    useState(false);

  const [savedAddressLoading, setSavedAddressLoading] =
    useState(false);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  const [couponCode, setCouponCode] = useState("");

  const [appliedCoupon, setAppliedCoupon] =
    useState<{
      code: string;
      discountAmount: number;
    } | null>(null);

  const [couponLoading, setCouponLoading] =
    useState(false);

  const [couponMessage, setCouponMessage] =
    useState<string | null>(null);

  // Checkout coupon listing and modal.
  const [availableCoupons, setAvailableCoupons] =
    useState<StoreCoupon[]>([]);

  const [couponsLoading, setCouponsLoading] =
    useState(false);

  const [couponsError, setCouponsError] =
    useState<string | null>(null);

  const [showCouponsModal, setShowCouponsModal] =
    useState(false);

  /*
   * -------------------------------------------------------
   * RAZORPAY PAYMENT STATE
   * -------------------------------------------------------
   */

  const [razorpayLoaded, setRazorpayLoaded] =
    useState(false);

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "opening" | "verifying" | "paid" | "failed" | "pending"
  >("idle");

  const [paymentMessage, setPaymentMessage] =
    useState<string | null>(null);

  const [orderNumber, setOrderNumber] = useState("");

  const [paidAmount, setPaidAmount] = useState(0);

  const paymentAttemptRef = useRef(false);
  const verificationStartedRef = useRef(false);

  /*
   * -------------------------------------------------------
   * FETCH CUSTOMER DETAILS AND SAVED ADDRESS
   * -------------------------------------------------------
   */

useEffect(() => {
  let mounted = true;

  async function loadAccountDetails() {
    try {
      setCustomerLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(authError.message);
      }

      if (!user) {
        if (!mounted) {
          return;
        }

        const redirectedFrom =
          `${window.location.pathname}${window.location.search}`;

        router.replace(
          `/store/CustomerLogin?redirectedFrom=${encodeURIComponent(
            redirectedFrom
          )}`
        );

        return;
      }

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("customer_profiles")
        .select("id,full_name,email,phone")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(
          `Unable to fetch customer profile: ${profileError.message}`
        );
      }

      const profile =
        profileData as CustomerProfile | null;

      const {
        data: addressData,
        error: addressError,
      } = await supabase
        .from("customer_addresses")
        .select(
          "id,user_id,address_type,full_name,phone,address_line_1,address_line_2,landmark,city,district,state,postal_code,country,is_default,created_at"
        )
        .eq("user_id", user.id)
        .order("is_default", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (addressError) {
        throw new Error(
          `Unable to fetch saved address: ${addressError.message}`
        );
      }

      if (!mounted) {
        return;
      }

      const savedAddress =
        addressData as SavedAddress | null;

      const customerName =
        profile?.full_name?.trim() ||
        getAuthCustomerName(user) ||
        savedAddress?.full_name?.trim() ||
        "";

      const customerEmail =
        profile?.email?.trim() ||
        user.email?.trim() ||
        "";

      const customerPhone =
        normalizeCustomerPhone(
          profile?.phone ||
            savedAddress?.phone ||
            user.phone ||
            ""
        );

      setCustomer({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      });

      // Saved address is NOT automatically applied.
      // The user can enable the saved-address toggle manually.
      // useSavedAddress remains false by default.

    } catch (err) {
      if (!mounted) {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch your account details."
      );
    } finally {
      if (mounted) {
        setCustomerLoading(false);
      }
    }
  }

  void loadAccountDetails();

  return () => {
    mounted = false;
  };
}, [router, supabase]);

  /*
   * -------------------------------------------------------
   * CART
   * -------------------------------------------------------
   */

  useEffect(() => {
    function loadCart() {
      setCart(readCart());
      setCartLoaded(true);
    }

    loadCart();

    window.addEventListener(
      CART_EVENT_NAME,
      loadCart
    );

    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener(
        CART_EVENT_NAME,
        loadCart
      );

      window.removeEventListener("storage", loadCart);
    };
  }, []);

  /*
   * -------------------------------------------------------
   * SHIPPING RATES
   * -------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function loadShippingRates() {
      try {
        setShippingLoading(true);

        const { data, error: queryError } =
          await supabase
            .from("shipping_rates")
            .select(
              "id,state_code,state_name,charge,is_active"
            )
            .order("state_name", {
              ascending: true,
            });

        if (queryError) {
          throw new Error(queryError.message);
        }

        if (!mounted) {
          return;
        }

        setShippingRates(
          (data ?? []).map((item) => ({
            id: item.id,
            state_code: String(
              item.state_code ?? ""
            ).toUpperCase(),
            state_name: String(item.state_name ?? ""),
            charge: Math.max(
              0,
              Number(item.charge ?? 0)
            ),
            is_active: Boolean(item.is_active),
          }))
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        setShippingRates([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load shipping charges."
        );
      } finally {
        if (mounted) {
          setShippingLoading(false);
        }
      }
    }

    void loadShippingRates();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /*
   * -------------------------------------------------------
   * CHECKOUT COUPONS
   * -------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function loadCheckoutCoupons() {
      try {
        setCouponsLoading(true);
        setCouponsError(null);

        const { data, error: queryError } =
          await supabase
            .from("coupons")
            .select(
              "id,code,description,discount_type,discount_value,min_order_amount,max_discount_amount,starts_at,expires_at,usage_limit,usage_count,per_customer_limit,is_active,show_on_checkout"
            )
            .eq("show_on_checkout", true)
            .eq("is_active", true)
            .order("created_at", {
              ascending: false,
            });

        if (queryError) {
          throw new Error(queryError.message);
        }

        if (!mounted) {
          return;
        }

        const coupons = ((data ?? []) as StoreCoupon[])
          .filter(isCouponAvailable)
          .map((coupon) => ({
            ...coupon,
            code: String(coupon.code ?? "").toUpperCase(),
            discount_value: Number(
              coupon.discount_value ?? 0
            ),
            min_order_amount:
              coupon.min_order_amount === null
                ? null
                : Number(coupon.min_order_amount),
            max_discount_amount:
              coupon.max_discount_amount === null
                ? null
                : Number(coupon.max_discount_amount),
            usage_limit:
              coupon.usage_limit === null
                ? null
                : Number(coupon.usage_limit),
            usage_count: Number(
              coupon.usage_count ?? 0
            ),
            per_customer_limit:
              coupon.per_customer_limit === null
                ? null
                : Number(coupon.per_customer_limit),
          }));

        setAvailableCoupons(coupons);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setAvailableCoupons([]);

        setCouponsError(
          err instanceof Error
            ? err.message
            : "Unable to load available coupons."
        );
      } finally {
        if (mounted) {
          setCouponsLoading(false);
        }
      }
    }

    void loadCheckoutCoupons();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /*
   * -------------------------------------------------------
   * FETCH SAVED ADDRESS MANUALLY
   * -------------------------------------------------------
   */

  async function handleUseSavedAddress(checked: boolean) {
    if (!checked) {
      setUseSavedAddress(false);
      setBilling(createEmptyAddress());
      return;
    }

    try {
      setSavedAddressLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(authError.message);
      }

      if (!user) {
        throw new Error(
          "Please sign in to access your saved address."
        );
      }

      const { data, error: addressError } =
        await supabase
          .from("customer_addresses")
          .select(
            "id,user_id,address_type,full_name,phone,address_line_1,address_line_2,landmark,city,district,state,postal_code,country,is_default,created_at"
          )
          .eq("user_id", user.id)
          .order("is_default", {
            ascending: false,
          })
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (addressError) {
        throw new Error(addressError.message);
      }

      if (!data) {
        throw new Error(
          "No saved address was found in your account. Please add an address from your account page."
        );
      }

      const savedAddress = data as SavedAddress;

      const formattedAddress =
        formatSavedAddress(savedAddress);

      if (!formattedAddress) {
        throw new Error(
          "Your saved address is incomplete. Please update it from your account page."
        );
      }

      const savedBillingAddress: Address = {
        address: formattedAddress,
        city: String(savedAddress.city ?? ""),
        state: String(savedAddress.state ?? ""),
        pincode: String(
          savedAddress.postal_code ?? ""
        ),
      };

      setBilling(savedBillingAddress);
      setUseSavedAddress(true);

      setFieldErrors((current) => ({
        ...current,
        "billing.address": "",
        "billing.city": "",
        "billing.state": "",
        "billing.pincode": "",
        shipping: "",
      }));

      if (shippingSameAsBilling) {
        setShipping(savedBillingAddress);
      }
    } catch (err) {
      setUseSavedAddress(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch your saved address."
      );
    } finally {
      setSavedAddressLoading(false);
    }
  }

  /*
   * -------------------------------------------------------
   * KEEP SHIPPING ADDRESS IN SYNC
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (shippingSameAsBilling) {
      setShipping({ ...billing });
    }
  }, [billing, shippingSameAsBilling]);

  /*
   * -------------------------------------------------------
   * TOTALS
   * -------------------------------------------------------
   */

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price) * Number(item.quantity),
      0
    );
  }, [cart]);

  const taxAmount = useMemo(() => {
    return subtotal * (TAX_RATE / (1 + TAX_RATE));
  }, [subtotal]);

  const selectedShippingState =
    shippingSameAsBilling
      ? billing.state
      : shipping.state;

  const selectedStateCode = useMemo(
    () => getStateCode(selectedShippingState),
    [selectedShippingState]
  );

  const selectedShippingRate = useMemo(() => {
    if (!selectedStateCode) {
      return null;
    }

    return (
      shippingRates.find(
        (rate) =>
          rate.state_code === selectedStateCode
      ) ?? null
    );
  }, [selectedStateCode, shippingRates]);

  const shippingAmount = useMemo(() => {
    if (
      !selectedShippingRate ||
      !selectedShippingRate.is_active
    ) {
      return 0;
    }

    return Math.max(
      0,
      Number(selectedShippingRate.charge ?? 0)
    );
  }, [selectedShippingRate]);

  const couponDiscount = Math.min(
    subtotal,
    Math.max(
      0,
      Number(appliedCoupon?.discountAmount ?? 0)
    )
  );

  const total = Math.max(
    0,
    subtotal + shippingAmount - couponDiscount
  );

  /*
   * -------------------------------------------------------
   * CUSTOMER
   * -------------------------------------------------------
   */

  function updateCustomer(
    field: keyof CustomerDetails,
    value: string
  ) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [`customer.${field}`]: "",
    }));

    setError(null);
  }

  /*
   * -------------------------------------------------------
   * BILLING
   * -------------------------------------------------------
   */

  function updateBilling(
    field: keyof Address,
    value: string
  ) {
    setBilling((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [`billing.${field}`]: "",
    }));

    setError(null);

    if (useSavedAddress) {
      setUseSavedAddress(false);
    }

    if (shippingSameAsBilling) {
      setShipping((current) => ({
        ...current,
        [field]: value,
      }));
    }
  }

  /*
   * -------------------------------------------------------
   * SHIPPING
   * -------------------------------------------------------
   */

  function updateShipping(
    field: keyof Address,
    value: string
  ) {
    setShipping((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [`shipping.${field}`]: "",
    }));

    setError(null);
  }

  function handleSameAsBilling(checked: boolean) {
    setShippingSameAsBilling(checked);
    setError(null);

    if (checked) {
      setShipping({ ...billing });
    } else {
      setShipping(createEmptyAddress());
    }
  }

  /*
   * -------------------------------------------------------
   * COUPONS
   * -------------------------------------------------------
   */

  async function applyCoupon(codeOverride?: string) {
    const code = (
      codeOverride ?? couponCode
    ).trim().toUpperCase();

    if (!code) {
      setCouponMessage("Enter a promo code.");
      return;
    }

    if (subtotal <= 0) {
      setCouponMessage(
        "Your cart subtotal is not eligible for a coupon."
      );
      return;
    }

    try {
      setCouponLoading(true);
      setCouponMessage(null);
      setError(null);
      setCouponCode(code);

      const {
        data,
        error: couponError,
      } = await supabase.rpc(
        "validate_store_coupon",
        {
          p_coupon_code: code,
          p_subtotal: subtotal,
        }
      );

      if (couponError) {
        throw new Error(couponError.message);
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "This coupon code is not valid."
        );
      }

      const discountAmount = Math.min(
        subtotal,
        Math.max(
          0,
          Number(data?.discount_amount ?? 0)
        )
      );

      if (discountAmount <= 0) {
        throw new Error(
          "This coupon does not provide a discount."
        );
      }

      const normalizedCode = String(
        data?.code ?? code
      ).toUpperCase();

      setAppliedCoupon({
        code: normalizedCode,
        discountAmount,
      });

      setCouponCode(normalizedCode);

      setCouponMessage(
        `${normalizedCode} applied. You save ${formatMoney(
          discountAmount
        )}.`
      );

      setShowCouponsModal(false);
    } catch (err) {
      setAppliedCoupon(null);

      setCouponMessage(
        err instanceof Error
          ? err.message
          : "Unable to apply the coupon."
      );
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage(null);
    setError(null);
  }

  function openCouponsModal() {
    setShowCouponsModal(true);
    setCouponsError(null);
  }

  /*
   * -------------------------------------------------------
   * VALIDATE APPLIED COUPON BEFORE PAYMENT
   * -------------------------------------------------------
   *
   * This function revalidates the coupon immediately
   * before creating a payment session.
   *
   * It checks the coupon again on the server, including
   * eligibility, usage restrictions, dates and discount.
   *
   * If the coupon has become invalid, it is removed and
   * payment is stopped.
   * -------------------------------------------------------
   */

  async function validateAppliedCouponBeforePayment() {
    if (!appliedCoupon?.code) {
      return null;
    }

    const code = appliedCoupon.code
      .trim()
      .toUpperCase();

    const {
      data,
      error: validationError,
    } = await supabase.rpc(
      "validate_store_coupon",
      {
        p_coupon_code: code,
        p_subtotal: subtotal,
      }
    );

    /*
     * A validation RPC error must stop payment.
     * Do not silently continue with an unverified coupon.
     */
    if (validationError) {
      throw new Error(
        `Unable to verify your applied coupon: ${validationError.message}. Please try again.`
      );
    }

    /*
     * Coupon is no longer eligible.
     */
    if (!data?.success) {
      const message =
        typeof data?.message === "string" &&
        data.message.trim()
          ? data.message
          : "Your applied coupon is no longer valid.";

      setAppliedCoupon(null);
      setCouponCode("");
      setCouponMessage(
        `${message} Please select another coupon or continue without a coupon.`
      );

      throw new Error(
        "Your applied coupon is no longer valid. It has been removed. Please review your order and proceed again."
      );
    }

    const validatedDiscount = Math.min(
      subtotal,
      Math.max(
        0,
        Number(data?.discount_amount ?? 0)
      )
    );

    /*
     * A successful response must also contain a
     * meaningful discount.
     */
    if (
      !Number.isFinite(validatedDiscount) ||
      validatedDiscount <= 0
    ) {
      setAppliedCoupon(null);
      setCouponCode("");

      setCouponMessage(
        "The applied coupon is no longer providing a valid discount. Please select another coupon."
      );

      throw new Error(
        "Your applied coupon is no longer eligible for this order. Please select another coupon or continue without one."
      );
    }

    const validatedCode = String(
      data?.code ?? code
    )
      .trim()
      .toUpperCase();

    /*
     * Update the displayed coupon using the latest
     * server-validated discount.
     */
    const validatedCoupon = {
      code: validatedCode,
      discountAmount: validatedDiscount,
    };

    setAppliedCoupon(validatedCoupon);
    setCouponCode(validatedCode);

    setCouponMessage(
      `${validatedCode} verified. You save ${formatMoney(
        validatedDiscount
      )}.`
    );

    return validatedCoupon;
  }

  /*
   * -------------------------------------------------------
   * VALIDATION
   * -------------------------------------------------------
   */

  function validate() {
    const errors: Record<string, string> = {};

    if (!customer.name.trim()) {
      errors["customer.name"] =
        "Enter your full name.";
    }

    if (!isValidPhone(customer.phone)) {
      errors["customer.phone"] =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!isValidEmail(customer.email)) {
      errors["customer.email"] =
        "Enter a valid email address.";
    }

    if (!billing.address.trim()) {
      errors["billing.address"] =
        "Enter the billing address.";
    }

    if (!billing.city.trim()) {
      errors["billing.city"] =
        "Enter the billing city.";
    }

    if (!billing.state.trim()) {
      errors["billing.state"] =
        "Select a state / UT.";
    }

    if (!isValidPincode(billing.pincode)) {
      errors["billing.pincode"] =
        "Enter a valid 6-digit pincode.";
    }

    const finalShippingAddress =
      shippingSameAsBilling ? billing : shipping;

    if (!shippingSameAsBilling) {
      if (!shipping.address.trim()) {
        errors["shipping.address"] =
          "Enter the shipping address.";
      }

      if (!shipping.city.trim()) {
        errors["shipping.city"] =
          "Enter the shipping city.";
      }

      if (!shipping.state.trim()) {
        errors["shipping.state"] =
          "Select a state / UT.";
      }

      if (!isValidPincode(shipping.pincode)) {
        errors["shipping.pincode"] =
          "Enter a valid 6-digit pincode.";
      }
    }

    const stateCode = getStateCode(
      finalShippingAddress.state
    );

    if (!stateCode) {
      errors.shipping =
        "Please select a valid state or Union Territory.";
    } else {
      const rate = shippingRates.find(
        (item) => item.state_code === stateCode
      );

      if (!rate || !rate.is_active) {
        errors.shipping =
          "Shipping is currently unavailable for the selected state or Union Territory.";
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError(
        errors.shipping ?? Object.values(errors)[0]
      );

      return false;
    }

    setError(null);
    return true;
  }

  /*
   * -------------------------------------------------------
   * VERIFY RAZORPAY PAYMENT
   * -------------------------------------------------------
   */

  async function verifyPayment(
    response: RazorpayResponse,
    currentSessionId: string,
    expectedAmount: number
  ) {
    if (verificationStartedRef.current) {
      return;
    }

    verificationStartedRef.current = true;

    try {
      setPaymentStatus("verifying");
      setPaymentMessage(null);
      setError(null);

      const verifyResponse = await fetch(
        "/api/payments/razorpay/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: currentSessionId,
            razorpay_order_id:
              response.razorpay_order_id,
            razorpay_payment_id:
              response.razorpay_payment_id,
            razorpay_signature:
              response.razorpay_signature,
          }),
          cache: "no-store",
        }
      );

      let data: Record<string, unknown> | null = null;

      try {
        data = (await verifyResponse.json()) as Record<
          string,
          unknown
        >;
      } catch {
        data = null;
      }

      if (!verifyResponse.ok) {
        throw new Error(
          typeof data?.message === "string" &&
          data.message.trim()
            ? data.message
            : "Unable to verify the payment."
        );
      }

      const status = String(
        data?.payment_status ?? ""
      )
        .trim()
        .toUpperCase();

      if (status === "PAID") {
        const confirmedAmount = Number(
          data?.amount ?? expectedAmount
        );

        setOrderNumber(
          String(data?.order_number ?? "")
        );

        setPaidAmount(
          Number.isFinite(confirmedAmount) &&
            confirmedAmount > 0
            ? confirmedAmount
            : expectedAmount
        );

        /*
         * Clear the cart only after the server confirms
         * that payment has been verified as PAID.
         */
        try {
          window.localStorage.removeItem(
            CART_STORAGE_KEY
          );

          window.dispatchEvent(
            new Event(CART_EVENT_NAME)
          );
        } catch (cartError) {
          console.error(
            "Cart cleanup error:",
            cartError
          );
        }

        setCart([]);
        setPaymentStatus("paid");
        setPaymentMessage(
          "Your payment has been verified successfully. Your order has been confirmed."
        );

        return;
      }

      if (status === "FAILED") {
        setPaymentStatus("failed");

        setPaymentMessage(
          typeof data?.message === "string"
            ? data.message
            : "Your payment was not completed."
        );

        return;
      }

      setPaymentStatus("pending");

      setPaymentMessage(
        typeof data?.message === "string" &&
        data.message.trim()
          ? data.message
          : "Payment confirmation is still pending. Please check again shortly."
      );
    } catch (err) {
      console.error(
        "Razorpay payment verification error:",
        err
      );

      setPaymentStatus("pending");

      setPaymentMessage(
        err instanceof Error
          ? err.message
          : "Unable to verify the payment. Please contact support if money has been deducted."
      );
    } finally {
      paymentAttemptRef.current = false;
      verificationStartedRef.current = false;
    }
  }

  /*
   * -------------------------------------------------------
   * OPEN RAZORPAY CHECKOUT
   * -------------------------------------------------------
   */

  function openRazorpayCheckout(
    razorpayOrderId: string,
    razorpayKeyId: string,
    paymentAmount: number,
    currentSessionId: string
  ) {
    if (!window.Razorpay) {
      throw new Error(
        "Razorpay Checkout is unavailable. Please refresh the page and try again."
      );
    }

    if (!razorpayOrderId || !razorpayKeyId) {
      throw new Error(
        "Razorpay payment details are incomplete."
      );
    }

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      throw new Error(
        "The payment amount returned by the server is invalid."
      );
    }

    paymentAttemptRef.current = true;

    setPaymentStatus("opening");
    setPaymentMessage(null);

    const checkout = new window.Razorpay({
      key: razorpayKeyId,
      amount: Math.round(paymentAmount * 100),
      currency: "INR",
      name: "Adroiit Technovations",
      description: "Adroiit Store Order",
      order_id: razorpayOrderId,

      prefill: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        contact: `+91${getPhoneDigits(customer.phone)}`,
      },

      notes: {
        session_id: currentSessionId,
      },

      theme: {
        color: "#5921c7",
      },

      handler: (response) => {
        void verifyPayment(
          response,
          currentSessionId,
          paymentAmount
        );
      },

      modal: {
        escape: true,
        backdropclose: false,

        ondismiss: () => {
          if (verificationStartedRef.current) {
            return;
          }

          paymentAttemptRef.current = false;

          setPaymentStatus("idle");
          setPaymentMessage(
            "Payment was not completed. You can try again."
          );
        },
      },
    });

    checkout.on("payment.failed", (response) => {
      console.error(
        "Razorpay payment failed:",
        response
      );

      paymentAttemptRef.current = false;

      setPaymentStatus("failed");

      setPaymentMessage(
        response.error?.description ??
          "Your payment could not be completed. Please try again."
      );
    });

    checkout.open();
  }

  /*
   * -------------------------------------------------------
   * PLACE ORDER
   * -------------------------------------------------------
   *
   * 1. Validate checkout details.
   * 2. Revalidate the applied coupon.
   * 3. Create the temporary payment session.
   * 4. Apply and validate the coupon on that session.
   * 5. Create the Razorpay order through the server API.
   * 6. Open Razorpay Checkout directly.
   *
   * No separate payment page is used.
   * -------------------------------------------------------
   */

  async function placeOrder() {
    if (
      placingOrder ||
      !cartLoaded ||
      paymentAttemptRef.current ||
      paymentStatus === "paid"
    ) {
      return;
    }

    if (cart.length === 0) {
      setError(
        "Your cart is empty. Please return to the store."
      );
      return;
    }

    if (customerLoading) {
      setError(
        "Please wait while your account details are loaded."
      );
      return;
    }

    if (shippingLoading) {
      setError(
        "Please wait while shipping charges are loaded."
      );
      return;
    }

    if (!validate()) {
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      setError(
        "Razorpay Checkout is still loading. Please try again in a moment."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      setError(null);
      setPaymentMessage(null);
      setPaymentStatus("idle");

      /*
       * Re-check stock before creating the payment session.
       */
      const invalidStock = cart.find(
        (item) =>
          item.quantity > item.stockQuantity
      );

      if (invalidStock) {
        throw new Error(
          `${invalidStock.name} does not have enough stock.`
        );
      }

      const finalShippingAddress =
        shippingSameAsBilling ? billing : shipping;

      const stateCode = getStateCode(
        finalShippingAddress.state
      );

      if (!stateCode) {
        throw new Error(
          "Please select a valid state or Union Territory."
        );
      }

      /*
       * Re-read the latest shipping rate immediately
       * before creating the payment session.
       */
      const {
        data: latestRate,
        error: latestRateError,
      } = await supabase
        .from("shipping_rates")
        .select(
          "id,state_code,state_name,charge,is_active"
        )
        .eq("state_code", stateCode)
        .maybeSingle();

      if (latestRateError) {
        throw new Error(latestRateError.message);
      }

      if (!latestRate || !latestRate.is_active) {
        throw new Error(
          "Shipping is currently unavailable for the selected state or Union Territory."
        );
      }

      const latestShippingCharge = Math.max(
        0,
        Number(latestRate.charge ?? 0)
      );

      setShippingRates((current) => {
        const exists = current.some(
          (rate) => rate.state_code === stateCode
        );

        if (!exists) {
          return [
            ...current,
            {
              id: latestRate.id,
              state_code: latestRate.state_code,
              state_name: latestRate.state_name,
              charge: latestShippingCharge,
              is_active: Boolean(latestRate.is_active),
            },
          ];
        }

        return current.map((rate) =>
          rate.state_code === stateCode
            ? {
                ...rate,
                charge: latestShippingCharge,
                is_active: Boolean(latestRate.is_active),
              }
            : rate
        );
      });

      /*
       * Ensure the browser has a valid authenticated
       * Supabase session.
       */
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (!session?.user) {
        const redirectedFrom =
          `${window.location.pathname}${window.location.search}`;

        router.replace(
          `/store/CustomerLogin?redirectedFrom=${encodeURIComponent(
            redirectedFrom
          )}`
        );

        return;
      }

      const customerPhone =
        `+91${getPhoneDigits(customer.phone)}`;

      const items = cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      /*
       * ---------------------------------------------------
       * FINAL COUPON VALIDATION — BEFORE PAYMENT SESSION
       * ---------------------------------------------------
       *
       * If a coupon is applied, validate it again here.
       *
       * This catches coupons that have:
       * - Expired after being applied.
       * - Been deactivated by the administrator.
       * - Reached their total usage limit.
       * - Reached the customer's usage limit.
       * - Become ineligible due to minimum order changes.
       *
       * If the coupon is invalid, payment is stopped.
       */

      const validatedCoupon =
        await validateAppliedCouponBeforePayment();

      /*
       * Create a temporary payment session.
       *
       * The actual Adroiit order should only be created
       * after the payment has been verified server-side.
       */
      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "create_store_payment_session",
        {
          p_customer_name: customer.name.trim(),
          p_customer_email: customer.email.trim(),
          p_customer_phone: customerPhone,

          p_billing_address: billing.address.trim(),
          p_billing_city: billing.city.trim(),
          p_billing_state: billing.state.trim(),
          p_billing_pincode: billing.pincode.trim(),

          p_shipping_address:
            finalShippingAddress.address.trim(),
          p_shipping_city:
            finalShippingAddress.city.trim(),
          p_shipping_state:
            finalShippingAddress.state.trim(),
          p_shipping_pincode:
            finalShippingAddress.pincode.trim(),

          p_items: items,
        }
      );

      if (rpcError) {
        throw new Error(
          `Unable to create payment session: ${rpcError.message}`
        );
      }

      const sessionId =
        typeof data === "string"
          ? data
          : data?.session_id ??
            data?.id ??
            data?.sessionId;

      if (!sessionId) {
        throw new Error(
          "Payment session was created, but no session ID was returned."
        );
      }

      /*
       * ---------------------------------------------------
       * SECOND COUPON VALIDATION — PAYMENT SESSION
       * ---------------------------------------------------
       *
       * The coupon is applied to the newly-created session.
       * This RPC must independently validate the coupon
       * before the payment session receives its discount.
       */

      if (validatedCoupon?.code) {
        const {
          data: couponSession,
          error: applyCouponError,
        } = await supabase.rpc(
          "apply_coupon_to_payment_session",
          {
            p_session_id: String(sessionId),
            p_coupon_code: validatedCoupon.code,
          }
        );

        if (applyCouponError) {
          throw new Error(
            `Unable to apply coupon to payment session: ${applyCouponError.message}`
          );
        }

        if (!couponSession?.success) {
          const couponFailureMessage =
            typeof couponSession?.message === "string" &&
            couponSession.message.trim()
              ? couponSession.message
              : "The coupon is no longer valid.";

          setAppliedCoupon(null);
          setCouponCode("");
          setCouponMessage(
            `${couponFailureMessage} Please select another coupon or continue without a coupon.`
          );

          throw new Error(
            "Your coupon could not be applied to the payment session. Please review your order and try again."
          );
        }

        const serverDiscount = Math.min(
          subtotal,
          Math.max(
            0,
            Number(couponSession?.discount_amount ?? 0)
          )
        );

        if (
          !Number.isFinite(serverDiscount) ||
          serverDiscount <= 0
        ) {
          setAppliedCoupon(null);
          setCouponCode("");

          setCouponMessage(
            "The coupon is no longer eligible for this order."
          );

          throw new Error(
            "The coupon discount could not be verified for this payment session. Please try again."
          );
        }

        /*
         * Keep the displayed discount synchronized with
         * the payment-session server response.
         */
        setAppliedCoupon({
          code: validatedCoupon.code,
          discountAmount: serverDiscount,
        });

        setCouponMessage(
          `${validatedCoupon.code} verified. You save ${formatMoney(
            serverDiscount
          )}.`
        );
      }

      /*
       * ---------------------------------------------------
       * CREATE RAZORPAY ORDER
       * ---------------------------------------------------
       *
       * This happens only after the coupon checks succeed.
       *
       * The server calculates and validates the actual
       * amount associated with this payment session.
       */

      const response = await fetch(
        "/api/payments/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: String(sessionId),
          }),
          cache: "no-store",
        }
      );

      let paymentData: Record<string, unknown> | null =
        null;

      try {
        paymentData = (await response.json()) as Record<
          string,
          unknown
        >;
      } catch {
        paymentData = null;
      }

      if (!response.ok) {
        throw new Error(
          typeof paymentData?.message === "string" &&
          paymentData.message.trim()
            ? paymentData.message
            : "Unable to create Razorpay payment order."
        );
      }

      const returnedSessionId = String(
        paymentData?.session_id ?? sessionId
      ).trim();

      const razorpayOrderId = String(
        paymentData?.razorpay_order_id ?? ""
      ).trim();

      const razorpayKeyId = String(
        paymentData?.key_id ?? ""
      ).trim();

      const paymentAmount = Number(
        paymentData?.amount ?? 0
      );

      if (!returnedSessionId) {
        throw new Error(
          "Payment session ID was not returned by the server."
        );
      }

      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay did not return a valid payment order ID."
        );
      }

      if (!razorpayKeyId) {
        throw new Error(
          "Razorpay key ID is not configured on the server."
        );
      }

      if (
        !Number.isFinite(paymentAmount) ||
        paymentAmount <= 0
      ) {
        throw new Error(
          "The payment amount returned by the server is invalid."
        );
      }

      setOrderNumber(
        String(paymentData?.order_number ?? "")
      );

      /*
       * Open Razorpay directly.
       * No navigation to /store/payment.
       */
      openRazorpayCheckout(
        razorpayOrderId,
        razorpayKeyId,
        paymentAmount,
        returnedSessionId
      );
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to proceed to payment."
      );

      setPaymentStatus("idle");
      paymentAttemptRef.current = false;
    } finally {
      setPlacingOrder(false);
    }
  }

  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */

  if (!cartLoaded) {
    return (
      <main
        className={`${bricolage.className} min-h-screen bg-white`}
      >
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1400px] items-center justify-center px-4">
          <Loader2
            size={28}
            className="animate-spin text-[#5921c7]"
          />
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * EMPTY CART
   * -------------------------------------------------------
   */

  if (cart.length === 0 && paymentStatus !== "paid") {
    return (
      <>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
          onLoad={() => setRazorpayLoaded(true)}
          onError={() => setRazorpayLoaded(false)}
        />

        <main
          className={`${bricolage.className} min-h-screen bg-white`}
        >
          <div className="mx-auto w-full max-w-[1400px] px-3 py-6 sm:px-5 lg:px-6">
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-center">
                <Package
                  size={42}
                  className="mx-auto text-[#5921c7]"
                />

                <h1 className="mt-5 text-[24px] font-bold text-[#17151d]">
                  Your cart is empty
                </h1>

                <p className="mt-2 text-[14px] text-[#716d78]">
                  Add products to your cart before
                  proceeding to checkout.
                </p>

                <Link
                  href="/store"
                  className="mt-6 inline-flex h-[44px] items-center justify-center rounded-[10px] bg-[#5921c7] px-6 text-[13px] font-bold text-white transition hover:bg-[#6d32df]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </main>

      </>
    );
  }

  /*
   * -------------------------------------------------------
   * CHECKOUT PAGE
   * -------------------------------------------------------
   */

  return (
    <main
      className={`${bricolage.className} min-h-screen bg-white text-[#17151d]`}
    >
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          setRazorpayLoaded(false);
          setError(
            "Unable to load Razorpay Checkout. Please refresh the page and try again."
          );
        }}
      />

      <div className="mx-auto w-full max-w-[1400px] px-3 pb-12 pt-5 sm:px-5 lg:px-6">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#5921c7] sm:text-[28px]">
            Checkout
          </h1>

          <p className="mt-1.5 text-[14px] text-[#716d78]">
            Enter your details and address before
            continuing to payment.
          </p>
        </div>

        {/* PAYMENT SUCCESS */}
        {paymentStatus === "paid" && (
          <div className="mb-6 rounded-[15px] border border-[#07885b]/20 bg-[#07885b]/[0.05] p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2
                size={54}
                className="text-[#07885b]"
              />

              <h2 className="mt-4 text-[24px] font-bold text-[#17151d]">
                Payment Successful
              </h2>

              <p className="mt-2 max-w-[500px] text-[13px] leading-6 text-[#716d78]">
                {paymentMessage ??
                  "Your payment has been verified and your order has been confirmed."}
              </p>

              {orderNumber && (
                <div className="mt-5 rounded-[10px] bg-white px-5 py-3 text-[13px] font-bold text-[#5921c7]">
                  Order #{orderNumber}
                </div>
              )}

              <p className="mt-3 text-[16px] font-bold text-[#07885b]">
                {formatMoney(paidAmount)}
              </p>

              <Link
                href="/store"
                className="mt-6 inline-flex h-[44px] items-center justify-center rounded-[10px] bg-[#5921c7] px-6 text-[13px] font-bold text-white transition hover:bg-[#6d32df]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* PAYMENT FAILED / PENDING */}
        {(paymentStatus === "failed" ||
          paymentStatus === "pending") && (
          <div
            className={`mb-6 rounded-[13px] border p-4 ${
              paymentStatus === "failed"
                ? "border-[#d52f3f]/20 bg-[#fff7f7]"
                : "border-[#5921c7]/20 bg-[#5921c7]/[0.04]"
            }`}
          >
            <div className="flex items-start gap-3">
              {paymentStatus === "failed" ? (
                <XCircle
                  size={21}
                  className="mt-0.5 shrink-0 text-[#d52f3f]"
                />
              ) : (
                <Loader2
                  size={21}
                  className="mt-0.5 shrink-0 animate-spin text-[#5921c7]"
                />
              )}

              <div className="min-w-0 flex-1">
                <p
                  className={`text-[14px] font-bold ${
                    paymentStatus === "failed"
                      ? "text-[#a52835]"
                      : "text-[#5921c7]"
                  }`}
                >
                  {paymentStatus === "failed"
                    ? "Payment Failed"
                    : "Payment Confirmation Pending"}
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#716d78]">
                  {paymentMessage}
                </p>

                {paymentStatus === "pending" && (
                  <p className="mt-2 text-[11px] leading-5 text-[#a52835]">
                    If money has been deducted from your
                    account, please do not make another
                    payment until the transaction status
                    has been checked.
                  </p>
                )}

                {paymentStatus === "failed" && (
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStatus("idle");
                      setPaymentMessage(null);
                      setError(null);
                    }}
                    className="mt-3 text-[12px] font-bold text-[#5921c7] underline underline-offset-2"
                  >
                    Try again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-[12px] border border-[#d52f3f]/20 bg-[#fff7f7] px-4 py-3 text-[13px] text-[#a52835]">
            {error}
          </div>
        )}

        {paymentStatus !== "paid" && (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px] xl:grid-cols-[minmax(0,1fr)_480px]">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Customer Details */}
              <section className="rounded-[16px] border border-black/[0.08] bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#5921c7]/10 text-[#5921c7]">
                    <User size={20} />
                  </div>

                  <div>
                    <h2 className="text-[16px] font-bold text-[#5921c7]">
                      Contact Details
                    </h2>

                    <p className="mt-0.5 text-[12px] text-[#716d78]">
                      Your contact information
                    </p>
                  </div>
                </div>

                {customerLoading && (
                  <div className="mb-4 flex items-center gap-2 rounded-[9px] bg-[#5921c7]/[0.05] px-3 py-2.5 text-[12px] text-[#5921c7]">
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Fetching your account details...
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full Name"
                    required
                    value={customer.name}
                    onChange={(value) =>
                      updateCustomer("name", value)
                    }
                    placeholder="Enter your full name"
                    error={fieldErrors["customer.name"]}
                  />

                  <PhoneField
                    label="Phone Number"
                    required
                    value={customer.phone}
                    onChange={(value) =>
                      updateCustomer("phone", value)
                    }
                    error={fieldErrors["customer.phone"]}
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Email Address"
                      required
                      type="email"
                      value={customer.email}
                      onChange={(value) =>
                        updateCustomer("email", value)
                      }
                      placeholder="you@example.com"
                      icon={<Mail size={15} />}
                      error={fieldErrors["customer.email"]}
                    />
                  </div>
                </div>

                {!customerLoading &&
                  customer.name &&
                  customer.email && (
                    <p className="mt-3 text-[11px] text-[#07885b]">
                      Your account details have been loaded.
                      You can edit them if necessary.
                    </p>
                  )}
              </section>

              {/* Billing Address */}
              <section className="rounded-[16px] border border-black/[0.08] bg-white p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#5921c7]/10 text-[#5921c7]">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <h2 className="text-[16px] font-bold text-[#5921c7]">
                        Billing Address
                      </h2>

                      <p className="mt-0.5 text-[12px] text-[#716d78]">
                        Address used for billing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Saved Address Toggle */}
                <div className="mb-5 flex items-center justify-between gap-3 rounded-[11px] border border-[#5921c7]/15 bg-[#5921c7]/[0.04] px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#302c38]">
                      Use saved address from my account
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#716d78]">
                      Fetch your saved delivery address automatically.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={useSavedAddress}
                    aria-label="Use saved address from my account"
                    disabled={savedAddressLoading}
                    onClick={() =>
                      void handleUseSavedAddress(
                        !useSavedAddress
                      )
                    }
                    className={`relative inline-flex h-[25px] w-[46px] shrink-0 items-center rounded-full transition-colors disabled:cursor-wait disabled:opacity-60 ${
                      useSavedAddress
                        ? "bg-[#5921c7]"
                        : "bg-[#c9c5d0]"
                    }`}
                  >
                    <span
                      className={`inline-block h-[19px] w-[19px] rounded-full bg-white shadow-sm transition-transform ${
                        useSavedAddress
                          ? "translate-x-[23px]"
                          : "translate-x-[3px]"
                      }`}
                    />
                  </button>
                </div>

                {savedAddressLoading && (
                  <div className="mb-4 flex items-center gap-2 rounded-[9px] bg-[#5921c7]/[0.05] px-3 py-2.5 text-[12px] text-[#5921c7]">
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Fetching your saved address...
                  </div>
                )}

                {useSavedAddress && !savedAddressLoading && (
                  <div className="mb-4 flex items-center gap-2 rounded-[9px] border border-[#07885b]/15 bg-[#07885b]/[0.05] px-3 py-2.5 text-[12px] text-[#07885b]">
                    <Check size={15} />
                    Saved account address loaded. You can
                    still edit the fields below.
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      label="Address"
                      required
                      value={billing.address}
                      onChange={(value) =>
                        updateBilling("address", value)
                      }
                      placeholder="House / Flat / Street / Area"
                      error={fieldErrors["billing.address"]}
                    />
                  </div>

                  <Field
                    label="City"
                    required
                    value={billing.city}
                    onChange={(value) =>
                      updateBilling("city", value)
                    }
                    placeholder="City"
                    error={fieldErrors["billing.city"]}
                  />

                  <SelectField
                    label="State / UT"
                    required
                    value={billing.state}
                    onChange={(value) =>
                      updateBilling("state", value)
                    }
                    error={fieldErrors["billing.state"]}
                  />

                  <Field
                    label="Pincode"
                    required
                    value={billing.pincode}
                    onChange={(value) =>
                      updateBilling(
                        "pincode",
                        value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                    error={fieldErrors["billing.pincode"]}
                  />
                </div>
              </section>

              {/* Shipping Address */}
              <section className="rounded-[16px] border border-black/[0.08] bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#5921c7]/10 text-[#5921c7]">
                    <Package size={20} />
                  </div>

                  <div>
                    <h2 className="text-[16px] font-bold text-[#5921c7]">
                      Shipping Address
                    </h2>

                    <p className="mt-0.5 text-[12px] text-[#716d78]">
                      Address where your order is to be delivered
                    </p>
                  </div>
                </div>

                <label className="mb-5 flex cursor-pointer items-center gap-3 rounded-[11px] border border-[#5921c7]/15 bg-[#5921c7]/[0.04] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={shippingSameAsBilling}
                    onChange={(event) =>
                      handleSameAsBilling(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#5921c7]"
                  />

                  <span className="text-[13px] font-semibold text-[#302c38]">
                    Shipping Address is same as Billing Address
                  </span>
                </label>

                {!shippingSameAsBilling && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Address"
                        required
                        value={shipping.address}
                        onChange={(value) =>
                          updateShipping("address", value)
                        }
                        placeholder="House / Flat / Street / Area"
                        error={fieldErrors["shipping.address"]}
                      />
                    </div>

                    <Field
                      label="City"
                      required
                      value={shipping.city}
                      onChange={(value) =>
                        updateShipping("city", value)
                      }
                      placeholder="City"
                      error={fieldErrors["shipping.city"]}
                    />

                    <SelectField
                      label="State / UT"
                      required
                      value={shipping.state}
                      onChange={(value) =>
                        updateShipping("state", value)
                      }
                      error={fieldErrors["shipping.state"]}
                    />

                    <Field
                      label="Pincode"
                      required
                      value={shipping.pincode}
                      onChange={(value) =>
                        updateShipping(
                          "pincode",
                          value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="6-digit pincode"
                      inputMode="numeric"
                      error={fieldErrors["shipping.pincode"]}
                    />
                  </div>
                )}

                {shippingSameAsBilling && (
                  <div className="rounded-[11px] border border-black/[0.07] bg-[#fafafa] px-4 py-3 text-[12px] text-[#716d78]">
                    Your shipping address will be
                    automatically copied from the billing
                    address.
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <aside>
              <section className="overflow-hidden rounded-[16px] border border-black/[0.08] bg-white">
                <div className="border-b border-black/[0.07] px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[19px] font-bold text-[#5921c7]">
                        Order Summary
                      </h2>

                      <p className="mt-1 text-[12px] text-[#716d78]">
                        {cart.length}{" "}
                        {cart.length === 1
                          ? "product"
                          : "products"}
                      </p>
                    </div>

                    <CreditCard
                      size={20}
                      className="text-[#5921c7]"
                    />
                  </div>
                </div>

                <div className="divide-y divide-black/[0.06]">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 px-5 py-4 sm:px-6"
                    >
                      <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[10px] border border-black/[0.07] bg-[#f7f7f8]">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="68px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#a09ba8]">
                            <Package size={21} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 text-[#302c38]">
                          {item.name}
                        </h3>

                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span className="text-[12px] text-[#302c38]">
                            Quantity: {item.quantity}
                          </span>

                          <span className="text-[13px] font-bold text-[#302c38]">
                            {formatMoney(
                              item.price * item.quantity
                            )}
                          </span>
                        </div>

                        <p className="mt-0.5 text-[12px] text-[#302c38]">
                          Price per Unit: {formatMoney(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/[0.07] px-5 py-5 sm:px-6">
                  <div className="space-y-3 text-[14px]">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#000000]">
                        Subtotal
                      </span>

                      <span className="font-semibold text-[#302c38]">
                        {formatMoney(subtotal)}
                      </span>
                    </div>

                    {/* Inclusive Tax */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#716d78]">
                        Taxes Included in Subtotal
                      </span>

                      <span className="font-semibold text-[#716d78]">
                        {formatMoney(taxAmount)}
                      </span>
                    </div>

                    {/* Shipping — ABOVE COUPON */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#000000]">
                        Shipping
                      </span>

                      {shippingLoading ? (
                        <Loader2
                          size={15}
                          className="animate-spin text-[#5921c7]"
                        />
                      ) : !selectedShippingState ? (
                        <span className="font-semibold text-[#716d78]">
                          Select state
                        </span>
                      ) : !selectedShippingRate ? (
                        <span className="font-semibold text-[#d52f3f]">
                          Unavailable
                        </span>
                      ) : !selectedShippingRate.is_active ? (
                        <span className="font-semibold text-[#d52f3f]">
                          Unavailable
                        </span>
                      ) : shippingAmount === 0 ? (
                        <span className="font-semibold text-[#07885b]">
                          Free
                        </span>
                      ) : (
                        <span className="font-semibold text-[#302c38]">
                          {formatMoney(shippingAmount)}
                        </span>
                      )}
                    </div>

                    {selectedShippingRate &&
                      selectedShippingRate.is_active && (
                        <p className="rounded-[9px] bg-[#5921c7]/[0.05] px-3 py-2 text-[11px] leading-4 text-[#5921c7]">
                          Shipping to{" "}
                          {selectedShippingRate.state_name}{" "}
                          ·{" "}
                          {formatMoney(
                            selectedShippingRate.charge
                          )}
                        </p>
                      )}

                    {/* Coupon */}
                    <div className="rounded-[11px] border border-black/[0.07] bg-[#fafafa] p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Tag
                            size={15}
                            className="text-[#5921c7]"
                          />

                          <span className="text-[13px] font-semibold text-[#302c38]">
                            Coupon Discount
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={openCouponsModal}
                          className="text-[12px] font-bold text-[#5921c7] underline decoration-[#5921c7]/40 underline-offset-4 transition hover:text-[#6d32df]"
                        >
                          View Coupons
                        </button>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <input
                          value={couponCode}
                          onChange={(event) => {
                            setCouponCode(
                              event.target.value.toUpperCase()
                            );

                            if (couponMessage) {
                              setCouponMessage(null);
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void applyCoupon();
                            }
                          }}
                          disabled={
                            couponLoading ||
                            Boolean(appliedCoupon)
                          }
                          placeholder="Enter coupon code"
                          className="h-[40px] min-w-0 flex-1 rounded-[9px] border border-black/[0.08] bg-white px-3 text-[12px] font-medium uppercase tracking-[0.04em] text-[#302c38] outline-none placeholder:normal-case placeholder:tracking-normal focus:border-[#5921c7]/40"
                        />

                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="h-[40px] shrink-0 rounded-[9px] border border-black/[0.08] bg-white px-3 text-[12px] font-semibold text-[#716d78] transition hover:border-[#d52f3f]/25 hover:text-[#d52f3f]"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void applyCoupon()}
                            disabled={
                              couponLoading ||
                              !couponCode.trim()
                            }
                            className="h-[40px] shrink-0 rounded-[9px] bg-[#5921c7] px-4 text-[12px] font-bold text-white transition hover:bg-[#6d32df] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {couponLoading
                              ? "Applying..."
                              : "Apply"}
                          </button>
                        )}
                      </div>

                      {couponMessage && (
                        <p
                          className={`mt-2 text-[11px] leading-4 ${
                            appliedCoupon
                              ? "text-[#07885b]"
                              : "text-[#d52f3f]"
                          }`}
                        >
                          {couponMessage}
                        </p>
                      )}
                    </div>

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-[#07885b]">
                          Coupon Discount
                        </span>

                        <span className="font-semibold text-[#07885b]">
                          -{formatMoney(couponDiscount)}
                        </span>
                      </div>
                    )}

                    <div className="my-4 border-t border-black/[0.07]" />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-[18px] font-bold text-[#5921c7]">
                        Grand Total
                      </span>

                      <span className="text-[21px] font-bold text-[#5921c7]">
                        {formatMoney(total)}
                      </span>
                    </div>
                  </div>

                  {/* PLACE ORDER */}
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={
                      placingOrder ||
                      customerLoading ||
                      shippingLoading ||
                      !selectedShippingRate ||
                      !selectedShippingRate.is_active ||
                      !razorpayLoaded ||
                      paymentStatus === "opening" ||
                      paymentStatus === "verifying" ||
                      paymentStatus === "pending"
                    }
                    className="mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-[11px] bg-[#5921c7] text-[14px] font-bold text-white transition hover:bg-[#6d32df] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Preparing Payment...
                      </>
                    ) : paymentStatus === "verifying" ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Verifying Payment...
                      </>
                    ) : paymentStatus === "opening" ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Opening Razorpay...
                      </>
                    ) : paymentStatus === "pending" ? (
                      <>
                        <ShieldCheck size={17} />
                        Payment Confirmation Pending
                      </>
                    ) : (
                      <>
                        <CreditCard size={17} />
                        Proceed to Pay
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#5921c7]/[0.04] px-3.5 py-3">
                    <ShieldCheck
                      size={27}
                      className="mt-0.5 shrink-0 text-[#5921c7]"
                    />

                    <p className="text-[11px] leading-4 text-[#716d78]">
                      Secure payment powered by Razorpay.
                      UPI, debit cards, credit cards, net banking and
                      other supported payment methods are
                      available.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}

        {/* AVAILABLE COUPONS MODAL */}
        {showCouponsModal &&
          paymentStatus !== "paid" && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-3 py-5 backdrop-blur-[2px]"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setShowCouponsModal(false);
                }
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="available-coupons-title"
                className="flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[17px] bg-white shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#5921c7]/10 text-[#5921c7]">
                      <Tag size={19} />
                    </div>

                    <div>
                      <h2
                        id="available-coupons-title"
                        className="text-[17px] font-bold text-[#5921c7]"
                      >
                        Available Coupons
                      </h2>

                      <p className="mt-0.5 text-[11px] text-[#716d78]">
                        Choose an offer and apply it to your order.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCouponsModal(false)
                    }
                    aria-label="Close coupons"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#716d78] transition hover:bg-black/[0.05] hover:text-[#302c38]"
                  >
                    <X size={19} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
                  {couponsLoading ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center">
                      <Loader2
                        size={27}
                        className="animate-spin text-[#5921c7]"
                      />

                      <p className="text-[13px] text-[#716d78]">
                        Loading available coupons...
                      </p>
                    </div>
                  ) : couponsError ? (
                    <div className="rounded-[11px] border border-[#d52f3f]/15 bg-[#fff7f7] px-4 py-4 text-center">
                      <p className="text-[13px] font-semibold text-[#a52835]">
                        Unable to load coupons
                      </p>

                      <p className="mt-1 text-[12px] leading-5 text-[#716d78]">
                        {couponsError}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setShowCouponsModal(false);
                          setCouponsError(null);
                        }}
                        className="mt-3 text-[12px] font-bold text-[#5921c7]"
                      >
                        Close
                      </button>
                    </div>
                  ) : availableCoupons.length === 0 ? (
                    <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5921c7]/[0.07] text-[#5921c7]">
                        <Tag size={21} />
                      </div>

                      <h3 className="mt-4 text-[14px] font-bold text-[#302c38]">
                        No coupons available right now
                      </h3>

                      <p className="mt-1 max-w-[300px] text-[12px] leading-5 text-[#716d78]">
                        Please check again later or enter a
                        coupon code if you already have one.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableCoupons.map((coupon) => {
                        const minimumOrder = Number(
                          coupon.min_order_amount ?? 0
                        );

                        const meetsMinimum =
                          subtotal >= minimumOrder;

                        const previewDiscount =
                          getCouponDiscountPreview(
                            coupon,
                            subtotal
                          );

                        const conditions =
                          getCouponConditions(coupon);

                        const isApplied =
                          appliedCoupon?.code ===
                          coupon.code.toUpperCase();

                        return (
                          <div
                            key={coupon.id}
                            className={`overflow-hidden rounded-[12px] border transition ${
                              isApplied
                                ? "border-[#07885b]/40 bg-[#07885b]/[0.035]"
                                : "border-black/[0.09] bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 p-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center rounded-[7px] border border-dashed border-[#5921c7]/40 bg-[#5921c7]/[0.05] px-2.5 py-1 text-[12px] font-extrabold tracking-[0.07em] text-[#5921c7]">
                                    {coupon.code}
                                  </span>

                                  <span className="rounded-full bg-[#07885b]/[0.08] px-2 py-1 text-[10px] font-bold text-[#07885b]">
                                    {getCouponOfferText(coupon)}
                                  </span>
                                </div>

                                {coupon.description && (
                                  <p className="mt-2 text-[12px] leading-5 text-[#302c38]">
                                    {coupon.description}
                                  </p>
                                )}

                                <div className="mt-2 space-y-1">
                                  {conditions.map(
                                    (condition, index) => (
                                      <p
                                        key={`${coupon.id}-${index}`}
                                        className="text-[11px] leading-4 text-[#716d78]"
                                      >
                                        • {condition}
                                      </p>
                                    )
                                  )}

                                  {conditions.length === 0 && (
                                    <p className="text-[11px] text-[#716d78]">
                                      No additional conditions.
                                    </p>
                                  )}
                                </div>

                                {minimumOrder > 0 &&
                                  !meetsMinimum && (
                                    <p className="mt-2 text-[11px] font-semibold text-[#d07813]">
                                      Add{" "}
                                      {formatMoney(
                                        minimumOrder - subtotal
                                      )}{" "}
                                      more to use this coupon.
                                    </p>
                                  )}

                                {meetsMinimum &&
                                  previewDiscount > 0 && (
                                    <p className="mt-2 text-[11px] font-semibold text-[#07885b]">
                                      Estimated savings:{" "}
                                      {formatMoney(
                                        previewDiscount
                                      )}
                                    </p>
                                  )}
                              </div>

                              <div className="shrink-0">
                                {isApplied ? (
                                  <span className="inline-flex h-[34px] items-center gap-1.5 rounded-[8px] bg-[#07885b]/10 px-3 text-[11px] font-bold text-[#07885b]">
                                    <Check size={14} />
                                    Applied
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={
                                      couponLoading ||
                                      Boolean(appliedCoupon) ||
                                      !meetsMinimum ||
                                      previewDiscount <= 0
                                    }
                                    onClick={() =>
                                      void applyCoupon(
                                        coupon.code
                                      )
                                    }
                                    className="inline-flex h-[34px] items-center justify-center rounded-[8px] bg-[#5921c7] px-3.5 text-[11px] font-bold text-white transition hover:bg-[#6d32df] disabled:cursor-not-allowed disabled:bg-[#c9c5d0] disabled:text-white"
                                  >
                                    {couponLoading &&
                                    couponCode ===
                                      coupon.code.toUpperCase()
                                      ? "Applying..."
                                      : "Apply"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-black/[0.07] bg-[#fafafa] px-5 py-3.5 sm:px-6">
                  <p className="text-[11px] text-[#716d78]">
                    {availableCoupons.length}{" "}
                    {availableCoupons.length === 1
                      ? "coupon"
                      : "coupons"}{" "}
                    available
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCouponsModal(false)
                    }
                    className="h-[36px] rounded-[8px] border border-black/[0.10] bg-white px-4 text-[12px] font-semibold text-[#302c38] transition hover:border-[#5921c7]/30 hover:text-[#5921c7]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </main>
    
  );
}

/*
 * -------------------------------------------------------
 * FORM COMPONENTS
 * -------------------------------------------------------
 */

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  error,
  inputMode,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#302c38]">
        {label}

        {required && (
          <span className="ml-1 text-[#d52f3f]">
            *
          </span>
        )}
      </span>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8791]">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          inputMode={inputMode}
          className={`h-[44px] w-full rounded-[10px] border bg-white px-3 text-[13px] text-[#302c38] outline-none transition placeholder:text-[#b0adb4] focus:border-[#5921c7] ${
            icon ? "pl-9" : ""
          } ${
            error
              ? "border-[#d52f3f]"
              : "border-black/[0.10]"
          }`}
        />
      </div>

      {error && (
        <span className="mt-1 block text-[11px] text-[#d52f3f]">
          {error}
        </span>
      )}
    </label>
  );
}

function PhoneField({
  label,
  required,
  value,
  onChange,
  error,
  placeholder = "10-digit mobile number",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const digits = value
    .replace(/\D/g, "")
    .replace(/^91/, "")
    .slice(0, 10);

  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#302c38]">
        {label}

        {required && (
          <span className="ml-1 text-[#d52f3f]">
            *
          </span>
        )}
      </span>

      <div
        className={`flex h-[44px] overflow-hidden rounded-[10px] border bg-white transition focus-within:border-[#5921c7] ${
          error
            ? "border-[#d52f3f]"
            : "border-black/[0.10]"
        }`}
      >
        <div className="flex w-[58px] shrink-0 items-center justify-center border-r border-black/[0.08] bg-[#fafafa] text-[13px] font-semibold text-[#302c38]">
          +91
        </div>

        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={digits}
          onChange={(event) => {
            const next = event.target.value
              .replace(/\D/g, "")
              .slice(0, 10);

            onChange(next ? `+91${next}` : "");
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 text-[13px] text-[#302c38] outline-none placeholder:text-[#b0adb4]"
        />
      </div>

      {error && (
        <span className="mt-1 block text-[11px] text-[#d52f3f]">
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({
  label,
  required,
  value,
  onChange,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#302c38]">
        {label}

        {required && (
          <span className="ml-1 text-[#d52f3f]">
            *
          </span>
        )}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`h-[44px] w-full appearance-none rounded-[10px] border bg-white px-3 pr-9 text-[13px] text-[#302c38] outline-none transition focus:border-[#5921c7] ${
            error
              ? "border-[#d52f3f]"
              : "border-black/[0.10]"
          }`}
        >
          <option value="">Select State / UT</option>

          {INDIAN_STATES_AND_UTS.map((state) => (
            <option
              key={state.code}
              value={state.name}
            >
              {state.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#716d78]"
        />
      </div>

      {error && (
        <span className="mt-1 block text-[11px] text-[#d52f3f]">
          {error}
        </span>
      )}
    </label>
    
  );
}