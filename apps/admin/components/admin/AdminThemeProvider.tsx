"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AdminTheme = "dark" | "light";

type AdminThemeContextType = {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
};

const AdminThemeContext =
  createContext<AdminThemeContextType | null>(null);

const DARK_THEME = {
  "--admin-bg": "#050505",
  "--admin-surface": "#0b0b0b",
  "--admin-surface-2": "#111111",
  "--admin-surface-hover": "#181818",

  "--admin-border": "rgba(255,255,255,0.10)",
  "--admin-border-strong": "rgba(255,255,255,0.18)",

  "--admin-text": "#ffffff",
  "--admin-text-secondary": "#dedede",
  "--admin-text-muted": "#999999",
  "--admin-text-subtle": "#707070",

  "--admin-primary": "#5921c7",
  "--admin-primary-hover": "#6d32df",
  "--admin-primary-light": "#8c52ff",
  "--admin-purple-dark": "#30106f",

  "--admin-yellow": "#ffcc00",

  "--admin-success": "#22c55e",
  "--admin-warning": "#f59e0b",
  "--admin-danger": "#ef4444",

  "--admin-shadow":
    "0 12px 35px rgba(0,0,0,0.30)",

  "--admin-shadow-sm":
    "0 4px 16px rgba(0,0,0,0.18)",
};

const LIGHT_THEME = {
  "--admin-bg": "#f4f3f8",
  "--admin-surface": "#ffffff",
  "--admin-surface-2": "#faf9fc",
  "--admin-surface-hover": "#f0edf8",

  "--admin-border": "rgba(48,16,111,0.12)",
  "--admin-border-strong": "rgba(48,16,111,0.20)",

  "--admin-text": "#17131f",
  "--admin-text-secondary": "#302b3a",
  "--admin-text-muted": "#5e5868",
  "--admin-text-subtle": "#817b8b",

  "--admin-primary": "#5921c7",
  "--admin-primary-hover": "#4820a5",
  "--admin-primary-light": "#8c52ff",
  "--admin-purple-dark": "#30106f",

  "--admin-yellow": "#d9a900",

  "--admin-success": "#087443",
  "--admin-warning": "#9a6500",
  "--admin-danger": "#c62828",

  "--admin-shadow":
    "0 12px 35px rgba(48,16,111,0.10)",

  "--admin-shadow-sm":
    "0 4px 16px rgba(48,16,111,0.08)",
};

export function AdminThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] =
    useState<AdminTheme>("dark");

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem(
        "adroiit-admin-theme"
      ) as AdminTheme | null;

    if (
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      setThemeState(savedTheme);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    window.localStorage.setItem(
      "adroiit-admin-theme",
      theme
    );
  }, [theme, mounted]);

  const setTheme = (
    newTheme: AdminTheme
  ) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((current) =>
      current === "dark"
        ? "light"
        : "dark"
    );
  };

  const variables =
    theme === "dark"
      ? DARK_THEME
      : LIGHT_THEME;

  return (
    <AdminThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      <div
        className="admin-root min-h-screen w-full transition-colors duration-300"
        data-admin-theme={theme}
        style={
          variables as React.CSSProperties
        }
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context =
    useContext(AdminThemeContext);

  if (!context) {
    throw new Error(
      "useAdminTheme must be used inside AdminThemeProvider"
    );
  }

  return context;
}
