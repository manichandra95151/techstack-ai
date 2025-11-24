// /app/components/StackDetails.tsx
import React from "react";
import type { StackDetail } from "@/types/ai";
import mermaid from "mermaid";

export default function StackDetails({ detail }: { detail: StackDetail }) {
  React.useEffect(() => {
    if (!detail.architectureDiagram) return;
    mermaid.initialize({ startOnLoad: false, theme: "neutral" });
    mermaid.render(`md-${Date.now()}`, detail.architectureDiagram).then(({ svg }) => {
      const el = document.getElementById("mermaid-root");
      if (el) el.innerHTML = svg;
    }).catch(console.error);
  }, [detail]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Overview</h2>
      {/* <p>{detail.overview}</p> */}

      <section>
        <h3 className="font-semibold">Architecture</h3>
        <div id="mermaid-root" className="p-4 border rounded bg-white/5" />
      </section>

      <section>
        <h3 className="font-semibold">DB Design</h3>
        <pre className="p-3 bg-black/10 rounded overflow-auto">{detail.db_design}</pre>
      </section>

      <section>
        <h3 className="font-semibold">API Spec (sample)</h3>
        <pre className="p-3 bg-black/10 rounded overflow-auto">{detail.api_spec}</pre>
      </section>

      <section>
        <h3 className="font-semibold">Roadmap</h3>
        {(detail.roadmap?.["1_month"] ?? []).map((w, i) => (
          <div key={i} className="p-3 border rounded mb-2">
            <div className="text-sm italic">Week {w.week}</div>
            <div><strong>Tasks:</strong> {w.items?.join(", ")}</div>
            <div><strong>Difficulty:</strong> {w.difficulty}</div>
            <div><strong>Hours:</strong> {w.estimated_hours}</div>
            <div><strong>Mini project:</strong> {w.project_tutorial}</div>
            {w.youtube && (
              <a className="text-blue-400 underline" target="_blank" href={w.youtube.url}>{w.youtube.title} — {w.youtube.duration}</a>
            )}
          </div>
        ))}
      </section>

      <section>
        <h3 className="font-semibold">Resources</h3>
        <ul>
          {(detail.resources?.youtube ?? []).map((y, i) => (
            <li key={i}><a className="text-blue-400 underline" href={y.url} target="_blank">{y.title}</a> — {y.duration}</li>
          ))}
        </ul>
        <ul>
          {(detail.resources?.docs ?? []).map((d, i) => (
            <li key={i}><a className="text-blue-400 underline" href={d.url} target="_blank">{d.title}</a></li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold">Sample Code</h3>
        {detail.sample_code?.map((f, idx) => (
          <div key={idx} className="mb-3">
            <div className="text-xs italic">{f.path}</div>
            <pre className="p-3 bg-black/10 rounded overflow-auto">{f.content}</pre>
          </div>
        ))}
      </section>

      <section>
        <h3 className="font-semibold">README (preview)</h3>
        <pre className="p-3 bg-black/10 rounded overflow-auto">{detail.readme}</pre>
      </section>
    </div>
  );
}
