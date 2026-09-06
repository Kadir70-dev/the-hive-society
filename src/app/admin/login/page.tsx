import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { AuthHashHandler } from "./AuthHashHandler";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card stack gap-16" style={{ padding: 32 }}>
          <div className="stack gap-8">
            <span className="eyebrow">The Hive Society</span>
            <h1 className="h3">Admin sign in</h1>
            <p className="text-2 small">
              Enter your admin email to receive a one-time sign-in link.
            </p>
          </div>
          <AuthHashHandler>
            <LoginForm />
          </AuthHashHandler>
        </div>
      </div>
    </div>
  );
}
