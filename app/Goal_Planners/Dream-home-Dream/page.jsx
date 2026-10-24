"use client";

import { Suspense } from "react";
import DreamHomeDreamInner from "./DreamHomeDreamInner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
          Loading dream home plan…
        </div>
      }
    >
      <DreamHomeDreamInner />
    </Suspense>
  );
}
