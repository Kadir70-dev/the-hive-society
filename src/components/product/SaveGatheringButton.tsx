"use client";

import Link from "next/link";
import { useState } from "react";
import { useSavedGatherings } from "@/lib/member/savedGatherings";

export function SaveGatheringButton({ slug }: { slug: string }) {
  const { slugs, ready, toggleSaved } = useSavedGatherings();
  const [error, setError] = useState(false);
  const saved = slugs.includes(slug);

  return (
    <div className="stack gap-10">
      <button
        type="button"
        className={`btn ${saved ? "btn--outline" : "btn--primary"} btn--block`}
        disabled={!ready}
        aria-pressed={saved}
        onClick={() => setError(!toggleSaved(slug))}
      >
        {saved ? "Remove from My Hive" : "Save to My Hive"}
      </button>
      <p className="small text-3" role="status">
        {saved ? <>Saved in this browser. <Link href="/app/hive" className="saved-gathering-link">View My Hive →</Link></> : "Keep this gathering in My Hive for later."}
      </p>
      <p className="small text-3">Saving does not reserve a place. Online booking is not available yet.</p>
      {error && <p className="small text-2" role="alert">Your browser couldn&rsquo;t update your saved gatherings. Allow site storage and try again.</p>}
    </div>
  );
}
