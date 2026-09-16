import type { Metadata } from "next";
import { AppSidebar } from "@/components/product/AppSidebar";
import { EditModeProvider } from "@/components/content/EditModeProvider";
import { AdminToolbar } from "@/components/content/AdminToolbar";
import { getAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProductLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();

  return (
    <EditModeProvider isAdmin={Boolean(session)}>
      <div className="app-shell">
        <AppSidebar />
        <main className="app-main">{children}</main>
      </div>
      <AdminToolbar />
    </EditModeProvider>
  );
}
