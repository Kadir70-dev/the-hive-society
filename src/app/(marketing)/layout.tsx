import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { CommunitySignupModalProvider } from "@/components/forms/CommunitySignupModal";
import { EditModeProvider } from "@/components/content/EditModeProvider";
import { GlobalContentProvider } from "@/components/content/GlobalContentProvider";
import { AdminToolbar } from "@/components/content/AdminToolbar";
import { getAdminSession } from "@/lib/admin/session";
import { getPageContent } from "@/lib/content/getPageContent";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, globalContent] = await Promise.all([getAdminSession(), getPageContent("global")]);

  return (
    <EditModeProvider isAdmin={Boolean(session)}>
      <GlobalContentProvider content={globalContent}>
        <CommunitySignupModalProvider>
          <Header />
          <main id="marketing-main">{children}</main>
          <Footer />
        </CommunitySignupModalProvider>
        <AdminToolbar />
      </GlobalContentProvider>
    </EditModeProvider>
  );
}
