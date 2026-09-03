import type { Metadata } from "next";
import { AppSidebar } from "@/components/product/AppSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProductLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
