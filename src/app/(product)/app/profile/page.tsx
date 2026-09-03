import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — The Hive App",
};

export default function ProfilePage() {
  return (
    <div className="app-content" style={{ paddingTop: 44 }}>
      <div className="app-view-header stack gap-10">
        <span className="eyebrow">Profile</span>
        <span className="tag-proposed" style={{ alignSelf: "flex-start" }}>
          Sample profile — sign-in not yet connected
        </span>
      </div>
      <div className="stack gap-32">
        <div className="profile-header">
          <div className="profile-avatar" />
          <div className="stack gap-6">
            <h2 className="h3">Your Name</h2>
            <p className="small text-2">Al Bateen, Abu Dhabi</p>
          </div>
        </div>
        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.05rem" }}>Interests</h3>
          <div className="pill-row">
            <span className="area-chip">Wellness</span>
            <span className="area-chip">Active</span>
            <span className="area-chip">Creative</span>
            <span className="area-chip">Social</span>
          </div>
        </div>
        <div className="grid grid-3">
          <div className="stack gap-10">
            <h3 className="h3" style={{ fontSize: "1rem" }}>Circles</h3>
            <div className="empty-state">None yet</div>
          </div>
          <div className="stack gap-10">
            <h3 className="h3" style={{ fontSize: "1rem" }}>Upcoming reservations</h3>
            <div className="empty-state">None yet</div>
          </div>
          <div className="stack gap-10">
            <h3 className="h3" style={{ fontSize: "1rem" }}>Past gatherings</h3>
            <div className="empty-state">None yet</div>
          </div>
        </div>
        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.05rem" }}>Membership</h3>
          <div className="card row" style={{ padding: "20px 22px", justifyContent: "space-between", alignItems: "center" }}>
            <span className="small" style={{ fontWeight: 600 }}>Hive Community — free tier</span>
            <Link href="/membership" className="btn btn--outline btn--sm">
              Explore Membership
            </Link>
          </div>
        </div>
        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.05rem" }}>Settings</h3>
          <div className="card" style={{ padding: "4px 22px" }}>
            <div className="settings-row"><span>Notifications</span><span className="text-3">On</span></div>
            <div className="settings-row"><span>Privacy</span><span className="text-3">Standard</span></div>
            <div className="settings-row"><span>Account</span><span className="text-3">—</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
