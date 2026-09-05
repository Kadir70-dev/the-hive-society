import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { CommunitySignupModalProvider } from "@/components/forms/CommunitySignupModal";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CommunitySignupModalProvider>
      <Header />
      <main id="marketing-main">{children}</main>
      <Footer />
    </CommunitySignupModalProvider>
  );
}
