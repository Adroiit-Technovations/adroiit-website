import type { ReactNode } from "react";
import StoreNavigation from "./components/StoreNavigation";
import Footer from "@/sections/Footer";

export default function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <StoreNavigation />
      {children}
      <Footer />
    </>
  );
}