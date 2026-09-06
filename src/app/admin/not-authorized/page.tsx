import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Authorized",
  robots: { index: false, follow: false },
};

export default function NotAuthorizedPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card stack gap-16" style={{ padding: 32, textAlign: "center" }}>
          <h1 className="h3">Not authorized</h1>
          <p className="text-2 small">
            This account isn&rsquo;t on the admin allow-list, or Supabase isn&rsquo;t configured yet.
            Contact an existing admin if you believe this is a mistake.
          </p>
          <Link href="/admin/login" className="btn btn--outline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
