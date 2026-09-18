import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Studio — The Hive App",
};

const SAMPLE_EXPERIENCES = [
  { title: "Sunset Rooftop Yoga", status: "Published", bookings: 12 },
  { title: "Watercolour & Wine Evening", status: "Draft", bookings: 0 },
  { title: "Founders' Coffee Circle", status: "Published", bookings: 8 },
];

export default function CreatorStudioPage() {
  return (
    <div className="app-content" style={{ paddingTop: 44 }}>
      <div className="app-view-header stack gap-10">
        <span className="eyebrow">Creator Studio</span>
        <span className="tag-proposed" style={{ alignSelf: "flex-start" }}>
          CREATE members — sign-in not yet connected
        </span>
      </div>
      <div className="stack gap-32">
        <p className="text-2 small" style={{ maxWidth: 560 }}>
          This is where CREATE members will build, publish and manage the experiences they host through The Hive
          Society.
        </p>
        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.05rem" }}>
            Your experiences
          </h3>
          <div className="table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
                  {["Title", "Status", "Bookings", ""].map((h) => (
                    <th key={h} className="small text-2" style={{ padding: "12px 16px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_EXPERIENCES.map((exp) => (
                  <tr key={exp.title} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{exp.title}</td>
                    <td style={{ padding: "12px 16px" }} className="small text-2">
                      {exp.status}
                    </td>
                    <td style={{ padding: "12px 16px" }} className="small text-2">
                      {exp.bookings}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button type="button" className="btn btn--outline btn--sm" disabled>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="stack gap-10">
          <button type="button" className="btn btn--primary" disabled style={{ alignSelf: "flex-start" }}>
            + New experience
          </button>
          <span className="small text-3">Publishing tools are coming soon.</span>
        </div>
      </div>
    </div>
  );
}
