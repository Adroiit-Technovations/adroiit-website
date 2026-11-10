"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Globe2,
  IndianRupee,
  LockKeyhole,
  Moon,
  Palette,
  Save,
  Settings,
  ShieldCheck,
  Store,
  Sun,
  UserRound,
} from "lucide-react";

import { useAdminTheme } from "@/components/admin/AdminThemeProvider";

type SettingsSection =
  | "GENERAL"
  | "STORE"
  | "APPEARANCE"
  | "NOTIFICATIONS"
  | "SECURITY";

type SettingsNavItem = {
  id: SettingsSection;
  title: string;
  description: string;
  icon: ReactNode;
};

const SETTINGS_NAV: SettingsNavItem[] = [
  {
    id: "GENERAL",
    title: "General",
    description: "Basic admin preferences",
    icon: <Settings size={17} />,
  },
  {
    id: "STORE",
    title: "Store",
    description: "Store configuration",
    icon: <Store size={17} />,
  },
  {
    id: "APPEARANCE",
    title: "Appearance",
    description: "Theme and interface",
    icon: <Palette size={17} />,
  },
  {
    id: "NOTIFICATIONS",
    title: "Notifications",
    description: "Admin notifications",
    icon: <Bell size={17} />,
  },
  {
    id: "SECURITY",
    title: "Security",
    description: "Account and access",
    icon: <ShieldCheck size={17} />,
  },
];

function SettingCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        backgroundColor: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold">
          {title}
        </h2>

        {description && (
          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-semibold"
        style={{
          color: "var(--admin-text)",
        }}
      >
        {label}
      </label>

      {children}

      {description && (
        <p
          className="mt-1.5 text-xs"
          style={{
            color: "var(--admin-text-muted)",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 shrink-0 rounded-full transition"
      style={{
        backgroundColor: checked
          ? "var(--admin-primary)"
          : "var(--admin-surface-hover)",
        border: `1px solid ${
          checked
            ? "var(--admin-primary)"
            : "var(--admin-border-strong)"
        }`,
      }}
    >
      <span
        className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition"
        style={{
          left: checked ? "22px" : "3px",
        }}
      />
    </button>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 border-b py-4 last:border-b-0"
      style={{
        borderColor: "var(--admin-border)",
      }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p
          className="mt-1 text-xs leading-5"
          style={{
            color: "var(--admin-text-muted)",
          }}
        >
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

function ActionRow({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b py-4 text-left last:border-b-0"
      style={{
        borderColor: "var(--admin-border)",
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          color: "var(--admin-primary-light)",
          backgroundColor:
            "rgba(89,33,199,0.08)",
        }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p
          className="mt-1 text-xs"
          style={{
            color: "var(--admin-text-muted)",
          }}
        >
          {description}
        </p>
      </div>

      <ChevronRight
        size={17}
        style={{
          color: "var(--admin-text-muted)",
        }}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const {
    theme,
    setTheme,
  } = useAdminTheme();

  const [activeSection, setActiveSection] =
    useState<SettingsSection>("GENERAL");

  const [storeName, setStoreName] =
    useState("Adroiit Technovations");

  const [storeEmail, setStoreEmail] =
    useState(
      "info@adroiittechnovations.in"
    );

  const [storePhone, setStorePhone] =
    useState("+91 88700 02908");

  const [currency, setCurrency] =
    useState("INR");

  const [timezone, setTimezone] =
    useState("Asia/Kolkata");

  const [orderNotifications, setOrderNotifications] =
    useState(true);

  const [lowStockNotifications, setLowStockNotifications] =
    useState(true);

  const [customerNotifications, setCustomerNotifications] =
    useState(true);

  const [verificationNotifications, setVerificationNotifications] =
    useState(true);

  const [compactTables, setCompactTables] =
    useState(false);

  const [confirmBeforeDelete, setConfirmBeforeDelete] =
    useState(true);

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    const savedSettings =
      window.localStorage.getItem(
        "adroiit-admin-settings"
      );

    if (!savedSettings) return;

    try {
      const parsed = JSON.parse(
        savedSettings
      );

      if (
        typeof parsed.storeName ===
        "string"
      ) {
        setStoreName(
          parsed.storeName
        );
      }

      if (
        typeof parsed.storeEmail ===
        "string"
      ) {
        setStoreEmail(
          parsed.storeEmail
        );
      }

      if (
        typeof parsed.storePhone ===
        "string"
      ) {
        setStorePhone(
          parsed.storePhone
        );
      }

      if (
        typeof parsed.currency ===
        "string"
      ) {
        setCurrency(
          parsed.currency
        );
      }

      if (
        typeof parsed.timezone ===
        "string"
      ) {
        setTimezone(
          parsed.timezone
        );
      }

      if (
        typeof parsed.orderNotifications ===
        "boolean"
      ) {
        setOrderNotifications(
          parsed.orderNotifications
        );
      }

      if (
        typeof parsed.lowStockNotifications ===
        "boolean"
      ) {
        setLowStockNotifications(
          parsed.lowStockNotifications
        );
      }

      if (
        typeof parsed.customerNotifications ===
        "boolean"
      ) {
        setCustomerNotifications(
          parsed.customerNotifications
        );
      }

      if (
        typeof parsed.verificationNotifications ===
        "boolean"
      ) {
        setVerificationNotifications(
          parsed.verificationNotifications
        );
      }

      if (
        typeof parsed.compactTables ===
        "boolean"
      ) {
        setCompactTables(
          parsed.compactTables
        );
      }

      if (
        typeof parsed.confirmBeforeDelete ===
        "boolean"
      ) {
        setConfirmBeforeDelete(
          parsed.confirmBeforeDelete
        );
      }
    } catch {
      // Ignore invalid local settings.
    }
  }, []);

  function saveSettings() {
    const settings = {
      storeName,
      storeEmail,
      storePhone,
      currency,
      timezone,
      orderNotifications,
      lowStockNotifications,
      customerNotifications,
      verificationNotifications,
      compactTables,
      confirmBeforeDelete,
    };

    window.localStorage.setItem(
      "adroiit-admin-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  }

  function renderSection() {
    switch (activeSection) {
      case "STORE":
        return (
          <div className="space-y-5">
            <SettingCard
              title="Store Information"
              description="Basic information used throughout the store."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Store Name">
                  <input
                    value={storeName}
                    onChange={(event) =>
                      setStoreName(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field label="Store Email">
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(event) =>
                      setStoreEmail(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field label="Store Phone">
                  <input
                    value={storePhone}
                    onChange={(event) =>
                      setStorePhone(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  />
                </Field>

                <Field
                  label="Currency"
                  description="Currency used for store prices and reports."
                >
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    />

                    <select
                      value={currency}
                      onChange={(event) =>
                        setCurrency(
                          event.target.value
                        )
                      }
                      className="h-11 w-full appearance-none rounded-xl border pl-9 pr-4 text-sm outline-none"
                      style={{
                        backgroundColor:
                          "var(--admin-surface-2)",
                        borderColor:
                          "var(--admin-border)",
                        color:
                          "var(--admin-text)",
                      }}
                    >
                      <option value="INR">
                        INR — Indian Rupee
                      </option>

                      <option value="USD">
                        USD — US Dollar
                      </option>

                      <option value="EUR">
                        EUR — Euro
                      </option>
                    </select>
                  </div>
                </Field>

                <Field
                  label="Timezone"
                  description="Used for orders, inventory movements and reports."
                >
                  <select
                    value={timezone}
                    onChange={(event) =>
                      setTimezone(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    <option value="Asia/Kolkata">
                      Asia/Kolkata — IST
                    </option>

                    <option value="UTC">
                      UTC
                    </option>

                    <option value="Asia/Dubai">
                      Asia/Dubai
                    </option>

                    <option value="Asia/Singapore">
                      Asia/Singapore
                    </option>
                  </select>
                </Field>
              </div>
            </SettingCard>

            <SettingCard
              title="Store Preferences"
              description="Control how common admin actions behave."
            >
              <ToggleRow
                title="Confirm before deleting"
                description="Ask for confirmation before permanently deleting products, categories or other records."
                checked={
                  confirmBeforeDelete
                }
                onChange={
                  setConfirmBeforeDelete
                }
              />

              <ToggleRow
                title="Compact tables"
                description="Use tighter row spacing in administrative tables."
                checked={compactTables}
                onChange={
                  setCompactTables
                }
              />
            </SettingCard>
          </div>
        );

      case "APPEARANCE":
        return (
          <div className="space-y-5">
            <SettingCard
              title="Admin Theme"
              description="Choose the appearance of the Adroiit admin panel."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setTheme("dark")
                  }
                  className="rounded-2xl border p-4 text-left transition"
                  style={{
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(89,33,199,0.08)"
                        : "var(--admin-surface-2)",
                    borderColor:
                      theme === "dark"
                        ? "var(--admin-primary)"
                        : "var(--admin-border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          "rgba(89,33,199,0.10)",
                        color:
                          "var(--admin-primary-light)",
                      }}
                    >
                      <Moon
                        size={18}
                      />
                    </div>

                    {theme ===
                      "dark" && (
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full"
                        style={{
                          backgroundColor:
                            "var(--admin-primary)",
                          color: "#ffffff",
                        }}
                      >
                        <Check
                          size={14}
                        />
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-sm font-bold">
                    Dark
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Near-black surfaces with
                    Adroiit purple accents.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTheme("light")
                  }
                  className="rounded-2xl border p-4 text-left transition"
                  style={{
                    backgroundColor:
                      theme === "light"
                        ? "rgba(89,33,199,0.06)"
                        : "var(--admin-surface-2)",
                    borderColor:
                      theme === "light"
                        ? "var(--admin-primary)"
                        : "var(--admin-border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          "rgba(89,33,199,0.08)",
                        color:
                          "var(--admin-primary)",
                      }}
                    >
                      <Sun
                        size={18}
                      />
                    </div>

                    {theme ===
                      "light" && (
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full"
                        style={{
                          backgroundColor:
                            "var(--admin-primary)",
                          color: "#ffffff",
                        }}
                      >
                        <Check
                          size={14}
                        />
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-sm font-bold">
                    Light
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color:
                        "var(--admin-text-muted)",
                    }}
                  >
                    Light surfaces with the same
                    Adroiit brand system.
                  </p>
                </button>
              </div>
            </SettingCard>

            <SettingCard
              title="Interface"
              description="Additional admin interface preferences."
            >
              <ToggleRow
                title="Compact tables"
                description="Reduce table row spacing to display more products and orders at once."
                checked={compactTables}
                onChange={
                  setCompactTables
                }
              />
            </SettingCard>
          </div>
        );

      case "NOTIFICATIONS":
        return (
          <div className="space-y-5">
            <SettingCard
              title="Admin Notifications"
              description="Choose which events should generate admin notifications."
            >
              <ToggleRow
                title="New order notifications"
                description="Notify when a new store order is received."
                checked={
                  orderNotifications
                }
                onChange={
                  setOrderNotifications
                }
              />

              <ToggleRow
                title="Low stock notifications"
                description="Notify when a product reaches its configured low-stock threshold."
                checked={
                  lowStockNotifications
                }
                onChange={
                  setLowStockNotifications
                }
              />

              <ToggleRow
                title="Customer notifications"
                description="Notify when customer-related store activity occurs."
                checked={
                  customerNotifications
                }
                onChange={
                  setCustomerNotifications
                }
              />

              <ToggleRow
                title="Certificate verification notifications"
                description="Notify about certificate verification activity."
                checked={
                  verificationNotifications
                }
                onChange={
                  setVerificationNotifications
                }
              />
            </SettingCard>

            <SettingCard
              title="Notification Status"
              description="Current notification configuration."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [
                    "Orders",
                    orderNotifications,
                  ],
                  [
                    "Low Stock",
                    lowStockNotifications,
                  ],
                  [
                    "Customers",
                    customerNotifications,
                  ],
                  [
                    "Verification",
                    verificationNotifications,
                  ],
                ].map(
                  ([label, enabled]) => (
                    <div
                      key={
                        String(label)
                      }
                      className="rounded-xl border p-3"
                      style={{
                        backgroundColor:
                          "var(--admin-surface-2)",
                        borderColor:
                          "var(--admin-border)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              enabled
                                ? "var(--admin-success)"
                                : "var(--admin-text-subtle)",
                          }}
                        />

                        <span className="text-xs font-semibold">
                          {String(
                            label
                          )}
                        </span>
                      </div>

                      <p
                        className="mt-2 text-xs"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        {enabled
                          ? "Enabled"
                          : "Disabled"}
                      </p>
                    </div>
                  )
                )}
              </div>
            </SettingCard>
          </div>
        );

      case "SECURITY":
        return (
          <div className="space-y-5">
            <SettingCard
              title="Admin Account"
              description="Manage the account used to access the admin panel."
            >
              <ActionRow
                icon={
                  <UserRound
                    size={18}
                  />
                }
                title="Account details"
                description="Your authenticated Supabase admin account."
              />

              <ActionRow
                icon={
                  <LockKeyhole
                    size={18}
                  />
                }
                title="Password"
                description="Password management is handled through Supabase authentication."
              />
            </SettingCard>

            <SettingCard
              title="Access Protection"
              description="Current protection applied to the admin area."
            >
              <div
                className="rounded-2xl border p-4"
                style={{
                  backgroundColor:
                    "rgba(52,211,153,0.05)",
                  borderColor:
                    "rgba(52,211,153,0.16)",
                }}
              >
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    style={{
                      color:
                        "var(--admin-success)",
                    }}
                  />

                  <div>
                    <p className="text-sm font-bold">
                      Authentication enabled
                    </p>

                    <p
                      className="mt-1 text-xs leading-5"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      Admin routes require an
                      authenticated Supabase
                      session.
                    </p>
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case "GENERAL":
      default:
        return (
          <div className="space-y-5">
            <SettingCard
              title="General Preferences"
              description="Configure general preferences for the admin panel."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Admin Language"
                  description="Language used by the administration interface."
                >
                  <div className="relative">
                    <Globe2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    />

                    <select
                      defaultValue="en"
                      className="h-11 w-full appearance-none rounded-xl border pl-9 pr-4 text-sm outline-none"
                      style={{
                        backgroundColor:
                          "var(--admin-surface-2)",
                        borderColor:
                          "var(--admin-border)",
                        color:
                          "var(--admin-text)",
                      }}
                    >
                      <option value="en">
                        English
                      </option>
                    </select>
                  </div>
                </Field>

                <Field
                  label="Currency"
                  description="Default currency used throughout the store."
                >
                  <div className="flex h-11 items-center gap-2 rounded-xl border px-4 text-sm"
                    style={{
                      backgroundColor:
                        "var(--admin-surface-2)",
                      borderColor:
                        "var(--admin-border)",
                      color:
                        "var(--admin-text)",
                    }}
                  >
                    <IndianRupee
                      size={16}
                      style={{
                        color:
                          "var(--admin-primary-light)",
                      }}
                    />

                    <span>
                      Indian Rupee
                    </span>

                    <span
                      className="ml-auto text-xs"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      INR
                    </span>
                  </div>
                </Field>
              </div>
            </SettingCard>

            <SettingCard
              title="Admin Interface"
              description="Personalize how the administration area behaves."
            >
              <ToggleRow
                title="Compact tables"
                description="Display more records by reducing table spacing."
                checked={compactTables}
                onChange={
                  setCompactTables
                }
              />

              <ToggleRow
                title="Confirm before deleting"
                description="Show a confirmation step before destructive actions."
                checked={
                  confirmBeforeDelete
                }
                onChange={
                  setConfirmBeforeDelete
                }
              />
            </SettingCard>

            <SettingCard
              title="Quick Access"
              description="Frequently used administration settings."
            >
              <ActionRow
                icon={
                  <Store size={18} />
                }
                title="Store configuration"
                description="Manage store information, currency and timezone."
                onClick={() =>
                  setActiveSection(
                    "STORE"
                  )
                }
              />

              <ActionRow
                icon={
                  <Palette
                    size={18}
                  />
                }
                title="Appearance"
                description="Change the admin panel theme and interface preferences."
                onClick={() =>
                  setActiveSection(
                    "APPEARANCE"
                  )
                }
              />

              <ActionRow
                icon={
                  <Bell size={18} />
                }
                title="Notifications"
                description="Configure store and certificate notifications."
                onClick={() =>
                  setActiveSection(
                    "NOTIFICATIONS"
                  )
                }
              />
            </SettingCard>
          </div>
        );
    }
  }

  return (
    <section
      className="mx-auto w-full max-w-[1400px]"
      style={{
        color: "var(--admin-text)",
      }}
    >
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "rgba(89,33,199,0.10)",
                color:
                  "var(--admin-primary-light)",
              }}
            >
              <Settings size={20} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Settings
              </h1>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                Configure your Adroiit admin
                panel and store preferences.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition"
          style={{
            backgroundColor:
              "var(--admin-primary)",
          }}
        >
          {saved ? (
            <>
              <Check size={16} />
              Settings Saved
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Settings navigation */}
        <aside
          className="h-fit rounded-2xl border p-2 lg:sticky lg:top-[152px]"
          style={{
            backgroundColor:
              "var(--admin-surface)",
            borderColor:
              "var(--admin-border)",
          }}
        >
          <div className="mb-2 px-3 py-2">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              Administration
            </p>
          </div>

          <div className="space-y-1">
            {SETTINGS_NAV.map(
              (item) => {
                const active =
                  activeSection ===
                  item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        item.id
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition"
                    style={{
                      backgroundColor:
                        active
                          ? "rgba(89,33,199,0.10)"
                          : "transparent",
                      color: active
                        ? "var(--admin-text)"
                        : "var(--admin-text-secondary)",
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        color: active
                          ? "var(--admin-primary-light)"
                          : "var(--admin-text-muted)",
                      }}
                    >
                      {item.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {item.title}
                      </span>

                      <span
                        className="mt-0.5 block truncate text-[11px]"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        {
                          item.description
                        }
                      </span>
                    </span>

                    {active && (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            "var(--admin-primary-light)",
                        }}
                      />
                    )}
                  </button>
                );
              }
            )}
          </div>
        </aside>

        {/* Settings content */}
        <div className="min-w-0">
          {renderSection()}
        </div>
      </div>
    </section>
  );
}
