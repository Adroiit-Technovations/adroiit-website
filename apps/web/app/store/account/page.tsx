"use client";

import Link from "next/link";
import {
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  Pencil,
  Save,
  UserRound,
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

type CustomerProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type CustomerAddress = {
  id: string;
  address_type: string;
  full_name: string;
  phone: string | null;
  address_line_1: string;
  address_line_2: string | null;
  landmark: string | null;
  city: string;
  district: string | null;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

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
  {
    code: "AN",
    name: "Andaman and Nicobar Islands",
  },
  {
    code: "CH",
    name: "Chandigarh",
  },
  {
    code: "DN",
    name: "Dadra and Nagar Haveli and Daman and Diu",
  },
  {
    code: "DL",
    name: "Delhi",
  },
  {
    code: "JK",
    name: "Jammu and Kashmir",
  },
  {
    code: "LA",
    name: "Ladakh",
  },
  {
    code: "LD",
    name: "Lakshadweep",
  },
  {
    code: "PY",
    name: "Puducherry",
  },
];

export default function CustomerAccountPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  // Prevent duplicate account requests from React Strict Mode effect re-runs.
  const hasStartedLoading = useRef(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] =
    useState<CustomerProfile | null>(null);

  const [address, setAddress] =
    useState<CustomerAddress | null>(null);

  const [editing, setEditing] = useState(false);

  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  async function loadAccount() {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/store/CustomerLogin";
        return;
      }

      setUserId(user.id);

      const {
        data: customerProfile,
        error: profileError,
      } = await supabase
        .from("customer_profiles")
        .select("id,full_name,email,phone")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(profileError.message);
      }

      let currentProfile =
        customerProfile as CustomerProfile | null;

      if (!currentProfile) {
        currentProfile = {
          id: user.id,
          full_name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            null,
          email: user.email ?? null,
          phone: user.phone ?? null,
        };
      }

      setProfile(currentProfile);

      setPhone(
        currentProfile.phone ??
          user.phone ??
          ""
      );

      const {
        data: addresses,
        error: addressError,
      } = await supabase
        .from("customer_addresses")
        .select(
          "id,address_type,full_name,phone,address_line_1,address_line_2,landmark,city,district,state,postal_code,country,is_default"
        )
        .eq("user_id", user.id)
        .order("is_default", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (addressError) {
        throw new Error(addressError.message);
      }

      const defaultAddress =
        (addresses?.[0] as CustomerAddress | undefined) ??
        null;

      setAddress(defaultAddress);

      if (defaultAddress) {
        setAddressLine1(defaultAddress.address_line_1);
        setAddressLine2(defaultAddress.address_line_2 ?? "");
        setLandmark(defaultAddress.landmark ?? "");
        setCity(defaultAddress.city);
        setState(defaultAddress.state);
        setPostalCode(defaultAddress.postal_code);

        if (!currentProfile.phone) {
          setPhone(
            defaultAddress.phone ??
              currentProfile.phone ??
              user.phone ??
              ""
          );
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your account."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasStartedLoading.current) {
      return;
    }

    hasStartedLoading.current = true;
    void loadAccount();
  }, []);

  function beginEditing() {
    setSuccess(null);
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    if (address) {
      setPhone(
        address.phone ??
          profile?.phone ??
          ""
      );

      setAddressLine1(address.address_line_1);
      setAddressLine2(address.address_line_2 ?? "");
      setLandmark(address.landmark ?? "");
      setCity(address.city);
      setState(address.state);
      setPostalCode(address.postal_code);
    } else {
      setPhone(profile?.phone ?? "");
      setAddressLine1("");
      setAddressLine2("");
      setLandmark("");
      setCity("");
      setState("");
      setPostalCode("");
    }

    setEditing(false);
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!userId || !profile) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (!phone.trim()) {
        throw new Error("Phone number is required.");
      }

      if (
        !addressLine1.trim() ||
        !city.trim() ||
        !state.trim() ||
        !postalCode.trim()
      ) {
        throw new Error(
          "Please complete the address fields."
        );
      }

      const validState =
        INDIAN_STATES_AND_UTS.some(
          (item) =>
            item.name.toLowerCase() ===
              state.trim().toLowerCase() ||
            item.code.toLowerCase() ===
              state.trim().toLowerCase()
        );

      if (!validState) {
        throw new Error(
          "Please select a valid state or Union Territory."
        );
      }

      if (!/^\d{6}$/.test(postalCode.trim())) {
        throw new Error(
          "Please enter a valid 6-digit pincode."
        );
      }

      const {
        error: profileUpdateError,
      } = await supabase
        .from("customer_profiles")
        .upsert(
          {
            id: userId,
            full_name: profile.full_name,
            email: profile.email,
            phone: phone.trim(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

      if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
      }

      const addressPayload = {
        user_id: userId,
        address_type: address?.address_type ?? "shipping",
        full_name: profile.full_name ?? "",
        phone: phone.trim(),
        address_line_1: addressLine1.trim(),
        address_line_2: addressLine2.trim() || null,
        landmark: landmark.trim() || null,
        city: city.trim(),
        district: address?.district ?? null,
        state: state.trim(),
        postal_code: postalCode.trim(),
        country: address?.country ?? "India",
        is_default: true,
        updated_at: new Date().toISOString(),
      };

      if (address?.id) {
        const {
          data: updatedAddress,
          error: addressUpdateError,
        } = await supabase
          .from("customer_addresses")
          .update(addressPayload)
          .eq("id", address.id)
          .eq("user_id", userId)
          .select(
            "id,address_type,full_name,phone,address_line_1,address_line_2,landmark,city,district,state,postal_code,country,is_default"
          )
          .single();

        if (addressUpdateError) {
          throw new Error(addressUpdateError.message);
        }

        if (!updatedAddress) {
          throw new Error(
            "The address could not be updated. Please refresh and try again."
          );
        }

        setAddress(updatedAddress as CustomerAddress);
      } else {
        const {
          data: newAddress,
          error: addressInsertError,
        } = await supabase
          .from("customer_addresses")
          .insert(addressPayload)
          .select(
            "id,address_type,full_name,phone,address_line_1,address_line_2,landmark,city,district,state,postal_code,country,is_default"
          )
          .single();

        if (addressInsertError) {
          throw new Error(addressInsertError.message);
        }

        setAddress(newAddress as CustomerAddress);
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              phone: phone.trim(),
            }
          : current
      );

      setEditing(false);

      setSuccess(
        "Your account details have been updated."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your account details."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation.trim() !== "DELETE") {
      setError('Please type "DELETE" to confirm account deletion.');
      return;
    }

    if (!deletePassword) {
      setError(
        "Enter your registered email account password to continue."
      );
      return;
    }

    setDeletingAccount(true);
    setError(null);

    try {
      // Verify the user's identity using their registered Supabase Auth email.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        throw new Error(
          "Unable to verify your registered email address. Please sign in again."
        );
      }

      // Reauthenticate before requesting account deletion.
      const {
        error: reauthError,
      } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword,
      });

      if (reauthError) {
        throw new Error(
          "The password you entered is incorrect. Please try again."
        );
      }

      // Retrieve the refreshed authenticated session.
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const response = await fetch(
        "/api/store/account/delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to delete your account. Please try again."
        );
      }

      // Clear the local cart after successful account deletion.
      try {
        localStorage.removeItem("adroiit-store-cart");

        window.dispatchEvent(
          new Event("adroiit-store-cart-updated")
        );
      } catch {
        // Ignore localStorage errors.
      }

      await supabase.auth.signOut();

      window.location.href = "/store";
    } catch (err) {
      setDeletingAccount(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete your account."
      );

      // Keep the dialog open so the user can correct an invalid password.
    }
  }

  return (
    <main
      className={`${bricolage.className} min-h-screen bg-white text-[#17151d]`}
    >
      <div className="mx-auto -mt-25 w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-30">
        <div className="mb-7">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8c52ff]">
            Your Profile
          </p>

          <h1 className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#30106f] bg-clip-text text-[28px] font-bold tracking-[-0.04em] text-transparent sm:text-[26px]">
            My Account
          </h1>

          <p className="mt-1 text-[13px] leading-6 text-[#716d78]">
            Manage your personal details and address.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-[12px] border border-[#d52f3f]/20 bg-[#fff7f7] px-4 py-3 text-[12px] font-medium text-[#a52835]">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-[12px] border border-[#07885b]/20 bg-[#f1fbf7] px-4 py-3 text-[12px] font-semibold text-[#07885b]">
            <Check size={15} />
            {success}
          </div>
        )}

        {/* Customer Details */}

        <section className="rounded-[18px] border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_rgba(48,16,111,0.05)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-[45px] w-[45px] items-center justify-center rounded-[11px] bg-[#f2edff] text-[#5921c7]">
                <UserRound size={18} />
              </div>

              <div>
                <h2 className="text-[16px] font-bold text-[#5921c7]">
                  Account Details
                </h2>

                <p className="mt-0.5 text-[12px] text-[#716d78]">
                  Your account information
                </p>
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={beginEditing}
                disabled={loading || !profile}
                className="flex items-center gap-1.5 rounded-[9px] bg-[#f6f4fa] px-3 py-2 text-[13px] font-bold text-[#5921c7] transition hover:bg-[#eee9f8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil size={13} />
                Edit Details
              </button>
            )}
          </div>

          <form
            onSubmit={handleSave}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                Name
              </label>

              <input
                type="text"
                value={profile?.full_name ?? ""}
                readOnly
                className="h-[42px] w-full rounded-[10px] border border-black/[0.08] bg-[#f7f6f9] px-3 text-[13px] font-medium text-[#716d78] outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                Email ID
              </label>

              <input
                type="email"
                value={profile?.email ?? ""}
                readOnly
                className="h-[42px] w-full rounded-[10px] border border-black/[0.08] bg-[#f7f6f9] px-3 text-[13px] font-medium text-[#716d78] outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                readOnly={!editing}
                className={`h-[42px] w-full rounded-[10px] border px-3 text-[13px] font-medium outline-none ${
                  editing
                    ? "border-[#5921c7]/30 bg-white text-[#17151d] focus:ring-2 focus:ring-[#5921c7]/10"
                    : "border-black/[0.08] bg-[#f7f6f9] text-[#716d78]"
                }`}
              />
            </div>

            {/* Address */}

            <div className="border-t border-black/[0.06] pt-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[11px] bg-[#f2edff] text-[#5921c7]">
                  <MapPin size={18} />
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-[#5921c7]">
                    Address
                  </h3>

                  <p className="mt-0.5 text-[12px] text-[#716d78]">
                    Your saved delivery address and location details
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                  Address Line 1
                </label>

                <input
                  type="text"
                  value={addressLine1}
                  onChange={(event) =>
                    setAddressLine1(event.target.value)
                  }
                  readOnly={!editing}
                  className={`h-[42px] w-full rounded-[10px] border px-3 text-[13px] font-medium outline-none ${
                    editing
                      ? "border-[#5921c7]/30 bg-white text-[#17151d] focus:ring-2 focus:ring-[#5921c7]/10"
                      : "border-black/[0.08] bg-[#f7f6f9] text-[#716d78]"
                  }`}
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                  Address Line 2
                </label>

                <input
                  type="text"
                  value={addressLine2}
                  onChange={(event) =>
                    setAddressLine2(event.target.value)
                  }
                  readOnly={!editing}
                  placeholder="Apartment, building, street"
                  className={`h-[42px] w-full rounded-[10px] border px-3 text-[13px] font-medium outline-none ${
                    editing
                      ? "border-[#5921c7]/30 bg-white text-[#17151d] focus:ring-2 focus:ring-[#5921c7]/10"
                      : "border-black/[0.08] bg-[#f7f6f9] text-[#716d78]"
                  }`}
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                  Landmark
                </label>

                <input
                  type="text"
                  value={landmark}
                  onChange={(event) =>
                    setLandmark(event.target.value)
                  }
                  readOnly={!editing}
                  placeholder="Nearby landmark"
                  className={`h-[42px] w-full rounded-[10px] border px-3 text-[13px] font-medium outline-none ${
                    editing
                      ? "border-[#5921c7]/30 bg-white text-[#17151d] focus:ring-2 focus:ring-[#5921c7]/10"
                      : "border-black/[0.08] bg-[#f7f6f9] text-[#716d78]"
                  }`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    readOnly={!editing}
                    className={`h-[42px] w-full rounded-[10px] border px-3 text-[13px] font-medium outline-none ${
                      editing
                        ? "border-[#5921c7]/30 bg-white text-[#17151d] focus:ring-2 focus:ring-[#5921c7]/10"
                        : "border-black/[0.08] bg-[#f7f6f9] text-[#716d78]"
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                    State
                  </label>

                  <div className="relative">
                    <select
                      value={state}
                      onChange={(event) =>
                        setState(event.target.value)
                      }
                      disabled={!editing}
                      className={`h-[42px] w-full appearance-none rounded-[10px] border px-3 pr-9 text-[13px] font-medium outline-none ${
                        editing
                          ? "border-[#5921c7]/30 bg-white text-[#17151d] focus:ring-2 focus:ring-[#5921c7]/10"
                          : "border-black/[0.08] bg-[#f7f6f9] text-[#716d78]"
                      }`}
                    >
                      <option value="">
                        Select State / UT
                      </option>

                      {INDIAN_STATES_AND_UTS.map(
                        (item) => (
                          <option
                            key={item.code}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#716d78]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#716d78]">
                    Pincode
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={postalCode}
                    onChange={(event) =>
                      setPostalCode(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    readOnly={!editing}
                    className={`h-[42px] w-full rounded-[10px] border px-3 text-[13px] font-medium outline-none ${
                      editing
                        ? "border-[#5921c7]/30 bg-white text-[#17151d] focus:ring-2 focus:ring-[#5921c7]/10"
                        : "border-black/[0.08] bg-[#f7f6f9] text-[#716d78]"
                    }`}
                  />
                </div>
              </div>
            </div>

            {editing && (
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-[40px] items-center justify-center gap-2 rounded-[10px] bg-[#5921c7] px-5 text-[12px] font-bold text-white transition hover:bg-[#6d32df] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="h-[40px] rounded-[10px] border border-black/[0.10] bg-white px-5 text-[12px] font-bold text-[#17151d] transition hover:bg-[#f6f4fa]"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Account Actions */}

        <section className="mt-5 rounded-[18px] border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_rgba(48,16,111,0.05)] sm:p-6">
          <div className="mb-5">
            <h2 className="text-[17px] font-bold text-[#5921c7]">
              Manage Account
            </h2>

            <p className="mt-0.5 text-[13px] text-[#716d78]">
              Permanently remove your account and saved customer details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmation("");
                setDeletePassword("");
                setError(null);
                setShowDeleteDialog(true);
              }}
              disabled={loading || !profile}
              className="flex h-[42px] items-center gap-2 rounded-[10px] border border-[#d52f3f]/20 bg-[#fff7f7] px-4 text-[12px] font-bold text-[#d52f3f] transition hover:border-[#d52f3f]/35 hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={15} />
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* Delete Account Confirmation */}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17151d]/45 px-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[440px] overflow-hidden rounded-[18px] border border-black/[0.08] bg-white shadow-[0_20px_70px_rgba(23,21,29,0.18)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[11px] bg-[#fff1f1] text-[#d52f3f]">
                  <AlertTriangle size={19} />
                </div>

                <div>
                  <h2 className="text-[16px] font-bold text-[#17151d]">
                    Delete Account
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-[#716d78]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeletePassword("");
                  setDeleteConfirmation("");
                  setError(null);
                }}
                disabled={deletingAccount}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] text-[#716d78] transition hover:bg-[#f6f4fa] hover:text-[#17151d] disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-[12px] border border-[#d52f3f]/15 bg-[#fff7f7] p-4">
                <p className="text-[12px] leading-5 text-[#7e3038]">
                  Deleting your account will permanently remove your login,
                  saved address and customer profile. Your existing order
                  records may be retained for order and business records,
                  but they will no longer be linked to your login account.
                </p>
              </div>

              <div className="mt-5">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#716d78]">
                  Registered Email Password
                </label>

                <input
                  type="password"
                  value={deletePassword}
                  onChange={(event) =>
                    setDeletePassword(event.target.value)
                  }
                  disabled={deletingAccount}
                  placeholder="Enter your account password"
                  autoComplete="current-password"
                  className="h-[42px] w-full rounded-[10px] border border-black/[0.10] bg-white px-3 text-[13px] font-medium text-[#17151d] outline-none focus:border-[#5921c7]/40 focus:ring-2 focus:ring-[#5921c7]/10 disabled:bg-[#f7f6f9]"
                />

                <p className="mt-1.5 text-[10px] leading-4 text-[#716d78]">
                  Confirm your identity using the password for{" "}
                  {profile?.email ?? "your registered email address"}.
                </p>
              </div>

              <div className="mt-5">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#716d78]">
                  Type{" "}
                  <span className="font-bold text-[#d52f3f]">
                    DELETE
                  </span>{" "}
                  to confirm
                </label>

                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(event) =>
                    setDeleteConfirmation(event.target.value)
                  }
                  disabled={deletingAccount}
                  placeholder="DELETE"
                  autoComplete="off"
                  className="h-[42px] w-full rounded-[10px] border border-black/[0.10] bg-white px-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-[#17151d] outline-none focus:border-[#d52f3f]/40 focus:ring-2 focus:ring-[#d52f3f]/10 disabled:bg-[#f7f6f9]"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setDeletePassword("");
                    setDeleteConfirmation("");
                    setError(null);
                  }}
                  disabled={deletingAccount}
                  className="h-[40px] rounded-[10px] border border-black/[0.10] bg-white px-5 text-[12px] font-bold text-[#17151d] transition hover:bg-[#f6f4fa] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={
                    deletingAccount ||
                    !deletePassword ||
                    deleteConfirmation.trim() !== "DELETE"
                  }
                  className="flex h-[40px] items-center gap-2 rounded-[10px] bg-[#d52f3f] px-5 text-[12px] font-bold text-white transition hover:bg-[#bd2635] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingAccount ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}