import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { ApplicationsClient } from "./ApplicationsClient";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = {
  title: "Community Applications",
  robots: { index: false, follow: false },
};

export default async function AdminCommunityPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="section">
      <div className="container stack gap-24">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div className="stack gap-8">
            <span className="eyebrow">The Hive Society — Admin</span>
            <h1 className="h3">Community applications</h1>
          </div>
          <div className="row gap-16" style={{ alignItems: "center" }}>
            <span className="small text-2">{session.email}</span>
            <SignOutButton />
          </div>
        </div>
        <ApplicationsClient />
      </div>
    </div>
  );
}
