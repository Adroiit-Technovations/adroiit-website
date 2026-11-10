"use client";

import { usePathname } from "next/navigation";
import AdminNavigation from "@/components/AdminNavigation";
import { AdminThemeProvider } from "@/components/AdminThemeProvider";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage =
    pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminThemeProvider>
      <div
        className="min-h-screen w-full"
        style={{
          backgroundColor:
            "var(--admin-bg)",
          color:
            "var(--admin-text)",
        }}
      >
        {/* Main website navbar occupies the top area */}
        <div className="h-[116px] w-full" />

        {/* ADMIN NAVIGATION */}
        <div className="sticky top-0 z-[9999] w-full px-2 sm:px-4">
          <AdminNavigation />
        </div>

        {/* ADMIN CONTENT */}
        <main
          className="min-h-screen w-full px-4 pb-12 pt-6 sm:px-6 lg:px-8"
          style={{
            backgroundColor:
              "var(--admin-bg)",
            color:
              "var(--admin-text)",
          }}
        >
          {children}
        </main>
      </div>
    </AdminThemeProvider>
  );
}
