import Link from "next/link";
import { SparkleIcon } from "@/components/ui/Icons";

export function UtilityRail() {
  return (
    <div className="utility-rail">
      <div className="rail-card rail-card--dark">
        <SparkleIcon className="rail-card__icon" />
        <h3>Host an Activity</h3>
        <p>Share what you love. Gather your Hive.</p>
        <Link href="/host" className="rail-card__link">
          Start here →
        </Link>
      </div>
      <div className="rail-card">
        <h3>Your Hive</h3>
        <span className="rail-card__label">Upcoming reserved spots</span>
        <p>No reservations yet — explore the feed.</p>
      </div>
      <div className="rail-card">
        <h3>Pre-event chats</h3>
        <p>Say hi to break the ice before you arrive.</p>
      </div>
    </div>
  );
}
