"use client";

import { useState } from "react";

export function ReserveButton({ title }: { title: string }) {
  const [reserved, setReserved] = useState(false);

  if (reserved) {
    return (
      <div className="success-panel">
        <div className="hex">✓</div>
        <h3 className="h3" style={{ fontSize: "1.1rem" }}>
          You&rsquo;re in!
        </h3>
        <p className="small text-2">
          Your place at {title} is reserved. The pre-event chat unlocks 48 hours before.
        </p>
      </div>
    );
  }

  return (
    <button className="btn btn--primary btn--block" onClick={() => setReserved(true)}>
      Reserve Your Place
    </button>
  );
}
