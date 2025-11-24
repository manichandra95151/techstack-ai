// /app/components/StackCard.tsx
import React from "react";
import type { Variant } from "@/types/ai";

export default function StackCard({
  title,
  data,
  onChoose,
}: {
  title: string;
  data: Variant;
  onChoose: () => void;
}) {
  return (
    <div className="p-4 border rounded-lg bg-white/5 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm italic mt-1">{data.why}</p>

        <div className="mt-3 text-sm">
          <strong>Frontend:</strong> {data.frontend.join(", ") || "—"}
          <br />
          <strong>Backend:</strong> {data.backend.join(", ") || "—"}
          <br />
          <strong>DB:</strong> {data.database.join(", ") || "—"}
        </div>

        <div className="mt-2 text-xs">
          <strong>Pros:</strong> {data.pros?.join(", ") || "—"}
          <br />
          <strong>Cons:</strong> {data.cons?.join(", ") || "—"}
        </div>
      </div>

      <button className="mt-4 py-2 px-3 rounded bg-white/10" onClick={onChoose}>
        Choose
      </button>
    </div>
  );
}
