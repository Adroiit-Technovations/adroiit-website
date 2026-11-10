
"use client";

import "./globals.css";

import { usePathname } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";

import AdminNavigation from "@/components/admin/AdminNavigation";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className={bricolage.className}>
        <AdminThemeProvider>
          {isLoginPage ? (
            <div className="admin-panel min-h-screen w-full">
              {children}
            </div>
          ) : (
            <div className="admin-panel relative min-h-screen w-full">
              <AdminNavigation />

              <main className="min-h-screen w-full px-2 pb-12 pt-[200px] sm:px-4">
                {children}
              </main>
            </div>
          )}
        </AdminThemeProvider>
      </body>
    </html>
  );
}
