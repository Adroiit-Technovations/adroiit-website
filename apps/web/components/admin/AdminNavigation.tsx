"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Settings,
  ShoppingBag,
  Sun,
  Tags,
  Tag,
  Users,
  X,
  Boxes,
  FileCheck2,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

import { createClient } from "@/lib/supabase/client";
import { useAdminTheme } from "@/components/admin/AdminThemeProvider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

type DropdownName = "certifier" | "store" | null;

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  const { theme, toggleTheme } = useAdminTheme();

  const [openDropdown, setOpenDropdown] =
    useState<DropdownName>(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  };

  /*
   * Certifier now contains:
   *
   * Overview
   * Events
   * Certificates
   * Verification Logs
   *
   * Events are intentionally placed before Certificates.
   */
  const isCertifierActive =
    pathname === "/admin/certifier" ||
    pathname.startsWith("/admin/certifier/") ||
    pathname === "/admin/events" ||
    pathname.startsWith("/admin/events/");

  const isStoreActive =
    pathname.startsWith("/admin/store");

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await supabase.auth.signOut();

      router.push("/admin/login");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  };

  const closeMenus = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  return (
    <div
      className={`${bricolage.className} absolute left-0 right-0 top-[110px] z-[9999] w-full px-2 sm:px-4`}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1350px]
          overflow-visible
          rounded-2xl
          border
          shadow-xl
          backdrop-blur-xl
          transition-colors
          duration-300
        "
        style={{
          backgroundColor: "var(--admin-surface)",
          borderColor:
            "var(--admin-border-strong)",
          boxShadow:
            "var(--admin-shadow)",
        }}
      >
        {/* Desktop */}
        <div className="hidden min-h-[64px] items-center px-3 md:flex">

          {/* Admin Brand */}
          <Link
            href="/admin/store"
            className="
              flex
              min-w-[190px]
              items-center
              gap-3
              rounded-xl
              px-3
              py-2
            "
            style={{
              color: "var(--admin-text)",
            }}
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
              "
              style={{
                background:
                  "linear-gradient(135deg, #5921c7, #8c52ff)",
              }}
            >
              <LayoutDashboard
                size={18}
                color="#ffffff"
                strokeWidth={2.2}
              />
            </div>

            <div className="leading-tight">
              <div
                className="text-sm font-semibold"
                style={{
                  color:
                    "var(--admin-text)",
                }}
              >
                Admin Dashboard
              </div>

              <div
                className="text-[11px]"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                Adroiit Technovations
              </div>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="ml-4 flex flex-1 items-center justify-center gap-1">

            {/* Certifier */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "certifier"
                      ? null
                      : "certifier"
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition
                "
                style={{
                  color:
                    isCertifierActive
                      ? "#5921c7"
                      : "var(--admin-text-secondary)",

                  backgroundColor:
                    isCertifierActive
                      ? "rgba(89,33,199,0.10)"
                      : "transparent",
                }}
              >
                <BookOpenCheck size={17} />

                <span>Certifier</span>

                <ChevronDown
                  size={14}
                  className={
                    openDropdown === "certifier"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>

              {openDropdown === "certifier" && (
                <Dropdown
                  width="250px"
                >
                  {/* Overview */}
                  <AdminDropdownLink
                    href="/admin/certifier"
                    icon={ClipboardCheck}
                    title="Overview"
                    description="Manage certificates and events"
                    active={
                      pathname === "/admin/certifier"
                    }
                    onClick={closeMenus}
                  />

                  {/* Events - BEFORE Certificates */}
                  <AdminDropdownLink
                    href="/admin/events"
                    icon={CalendarDays}
                    title="Events"
                    description="Manage certificate events"
                    active={isActive(
                      "/admin/events"
                    )}
                    onClick={closeMenus}
                  />

                  {/* Certificates */}
                  <AdminDropdownLink
                    href="/admin/certifier/certificates"
                    icon={FileCheck2}
                    title="Certificates"
                    description="View and manage all certificates"
                    active={isActive(
                      "/admin/certifier/certificates"
                    )}
                    onClick={closeMenus}
                  />

                  {/* Verification Logs */}
                  <AdminDropdownLink
                    href="/admin/certifier/logs"
                    icon={BarChart3}
                    title="Verification Logs"
                    description="View verification activity"
                    active={isActive(
                      "/admin/certifier/logs"
                    )}
                    onClick={closeMenus}
                  />
                </Dropdown>
              )}
            </div>

            {/* Store */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "store"
                      ? null
                      : "store"
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition
                "
                style={{
                  color:
                    isStoreActive
                      ? "#5921c7"
                      : "var(--admin-text-secondary)",

                  backgroundColor:
                    isStoreActive
                      ? "rgba(89,33,199,0.10)"
                      : "transparent",
                }}
              >
                <ShoppingBag size={17} />

                <span>Store</span>

                <ChevronDown
                  size={14}
                  className={
                    openDropdown === "store"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>

              {openDropdown === "store" && (
                <Dropdown
                  width="280px"
                >
                  {/* Overview */}
                  <AdminDropdownLink
                    href="/admin/store"
                    icon={LayoutDashboard}
                    title="Overview"
                    description="Store dashboard and analytics"
                    active={
                      pathname ===
                      "/admin/store"
                    }
                    onClick={closeMenus}
                  />

                  {/* Products */}
                  <AdminDropdownLink
                    href="/admin/store/products"
                    icon={Package}
                    title="Products"
                    description="Manage products and pricing"
                    active={isActive(
                      "/admin/store/products"
                    )}
                    onClick={closeMenus}
                  />

                  {/* Categories */}
                  <AdminDropdownLink
                    href="/admin/store/categories"
                    icon={Tags}
                    title="Categories"
                    description="Manage product categories"
                    active={isActive(
                      "/admin/store/categories"
                    )}
                    onClick={closeMenus}
                  />

                  {/* Coupon Codes */}
                  <AdminDropdownLink
                    href="/admin/store/coupons"
                    icon={Tag}
                    title="Coupon Codes"
                    description="Manage discount codes and offers"
                    active={isActive(
                      "/admin/store/coupons"
                    )}
                    onClick={closeMenus}
                  />

                  {/* Inventory */}
                  <AdminDropdownLink
                    href="/admin/store/inventory"
                    icon={Boxes}
                    title="Inventory"
                    description="Manage stock and movements"
                    active={isActive(
                      "/admin/store/inventory"
                    )}
                    onClick={closeMenus}
                  />

                  {/* Orders */}
                  <AdminDropdownLink
                    href="/admin/store/orders"
                    icon={ShoppingBag}
                    title="Orders"
                    description="Manage customer orders"
                    active={isActive(
                      "/admin/store/orders"
                    )}
                    onClick={closeMenus}
                  />

                  {/* Customers */}
                  <AdminDropdownLink
                    href="/admin/store/customers"
                    icon={Users}
                    title="Customers"
                    description="Manage customers"
                    active={isActive(
                      "/admin/store/customers"
                    )}
                    onClick={closeMenus}
                  />
                </Dropdown>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">

            <Link
              href="/admin/settings"
              title="Settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                color:
                  pathname === "/admin/settings"
                    ? "#5921c7"
                    : "var(--admin-text-muted)",
                backgroundColor:
                  pathname === "/admin/settings"
                    ? "rgba(89,33,199,0.10)"
                    : "transparent",
              }}
            >
              <Settings size={18} />
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
              "
              style={{
                color:
                  "var(--admin-text-secondary)",
              }}
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <Link
              href="/"
              target="_blank"
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                px-3
                text-sm
                font-medium
              "
              style={{
                color:
                  "var(--admin-text-secondary)",
              }}
            >
              <ExternalLink size={16} />
              <span>Website</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                px-3
                text-sm
                font-medium
              "
              style={{
                color:
                  "var(--admin-danger)",
              }}
            >
              <LogOut size={16} />

              <span>
                {signingOut
                  ? "Signing out..."
                  : "Sign Out"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex min-h-[64px] items-center justify-between px-3 md:hidden">
          <Link
            href="/admin/store"
            className="flex items-center gap-3"
            onClick={closeMenus}
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
              "
              style={{
                background:
                  "linear-gradient(135deg, #5921c7, #8c52ff)",
              }}
            >
              <LayoutDashboard
                size={18}
                color="#ffffff"
              />
            </div>

            <div>
              <div
                className="text-sm font-semibold"
                style={{
                  color:
                    "var(--admin-text)",
                }}
              >
                Admin Panel
              </div>

              <div
                className="text-[10px]"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                Adroiit Technovations
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
              "
              style={{
                color:
                  "var(--admin-text-secondary)",
              }}
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (current) => !current
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
              "
              style={{
                color:
                  "var(--admin-text)",
              }}
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="
              border-t
              px-3
              pb-3
              pt-3
              md:hidden
            "
            style={{
              borderColor:
                "var(--admin-border)",
            }}
          >
            {/* Certifier Overview */}
            <MobileLink
              href="/admin/certifier"
              icon={BookOpenCheck}
              label="Certifier"
              active={
                pathname === "/admin/certifier"
              }
              onClick={closeMenus}
            />

            {/* Events - BEFORE Certificates */}
            <MobileLink
              href="/admin/events"
              icon={CalendarDays}
              label="Events"
              active={isActive(
                "/admin/events"
              )}
              onClick={closeMenus}
            />

            {/* Certificates */}
            <MobileLink
              href="/admin/certifier/certificates"
              icon={ClipboardCheck}
              label="Certificates"
              active={isActive(
                "/admin/certifier/certificates"
              )}
              onClick={closeMenus}
            />

            {/* Verification Logs */}
            <MobileLink
              href="/admin/certifier/logs"
              icon={FileCheck2}
              label="Verification Logs"
              active={isActive(
                "/admin/certifier/logs"
              )}
              onClick={closeMenus}
            />

            {/* Store Overview */}
            <MobileLink
              href="/admin/store"
              icon={ShoppingBag}
              label="Store Overview"
              active={
                pathname === "/admin/store"
              }
              onClick={closeMenus}
            />

            {/* Products */}
            <MobileLink
              href="/admin/store/products"
              icon={Package}
              label="Products"
              active={isActive(
                "/admin/store/products"
              )}
              onClick={closeMenus}
            />

            {/* Categories */}
            <MobileLink
              href="/admin/store/categories"
              icon={Tags}
              label="Categories"
              active={isActive(
                "/admin/store/categories"
              )}
              onClick={closeMenus}
            />

            {/* Coupon Codes */}
            <MobileLink
              href="/admin/store/coupons"
              icon={Tag}
              label="Coupon Codes"
              active={isActive(
                "/admin/store/coupons"
              )}
              onClick={closeMenus}
            />

            {/* Inventory */}
            <MobileLink
              href="/admin/store/inventory"
              icon={Boxes}
              label="Inventory"
              active={isActive(
                "/admin/store/inventory"
              )}
              onClick={closeMenus}
            />

            {/* Orders */}
            <MobileLink
              href="/admin/store/orders"
              icon={ShoppingBag}
              label="Orders"
              active={isActive(
                "/admin/store/orders"
              )}
              onClick={closeMenus}
            />

            {/* Customers */}
            <MobileLink
              href="/admin/store/customers"
              icon={Users}
              label="Customers"
              active={isActive(
                "/admin/store/customers"
              )}
              onClick={closeMenus}
            />

            <div
              className="my-2 h-px w-full"
              style={{
                backgroundColor:
                  "var(--admin-border)",
              }}
            />

            {/* Settings */}
            <MobileLink
              href="/admin/settings"
              icon={Settings}
              label="Settings"
              active={isActive(
                "/admin/settings"
              )}
              onClick={closeMenus}
            />

            {/* Website */}
            <MobileLink
              href="/"
              icon={ExternalLink}
              label="View Website"
              onClick={closeMenus}
            />

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="
                mt-1
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-sm
                font-medium
              "
              style={{
                color:
                  "var(--admin-danger)",
              }}
            >
              <LogOut size={17} />

              {signingOut
                ? "Signing out..."
                : "Sign Out"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Dropdown({
  children,
  width,
}: {
  children: React.ReactNode;
  width: string;
}) {
  return (
    <div
      className="
        absolute
        left-0
        top-[calc(100%+8px)]
        overflow-hidden
        rounded-2xl
        border
        p-2
        shadow-2xl
      "
      style={{
        width,
        backgroundColor:
          "var(--admin-surface)",
        borderColor:
          "var(--admin-border-strong)",
        boxShadow:
          "var(--admin-shadow)",
      }}
    >
      {children}
    </div>
  );
}

function AdminDropdownLink({
  href,
  icon: Icon,
  title,
  description,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        items-center
        gap-3
        rounded-xl
        p-3
        transition
        duration-200
      "
      style={{
        backgroundColor: active
          ? "rgba(89,33,199,0.10)"
          : "transparent",
      }}
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
        "
        style={{
          backgroundColor: active
            ? "#5921c7"
            : "var(--admin-surface-2)",
          color: active
            ? "#ffffff"
            : "var(--admin-text-secondary)",
        }}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <div
          className="text-sm font-medium"
          style={{
            color:
              "var(--admin-text)",
          }}
        >
          {title}
        </div>

        <div
          className="mt-0.5 text-[11px] leading-4"
          style={{
            color:
              "var(--admin-text-muted)",
          }}
        >
          {description}
        </div>
      </div>
    </Link>
  );
}

function MobileLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-medium
      "
      style={{
        color: active
          ? "#5921c7"
          : "var(--admin-text-secondary)",
        backgroundColor: active
          ? "rgba(89,33,199,0.10)"
          : "transparent",
      }}
    >
      <Icon size={17} />
      <span>{label}</span>
    </Link>
  );
}