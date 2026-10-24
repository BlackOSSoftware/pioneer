"use client";

import { Suspense } from "react";
import DreamHomeSummaryInner from "./DreamHomeSummaryInner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-slate-50 p-10 text-center text-sm font-medium text-slate-500">
          Loading dream home summary…
        </div>
      }
    >
      <DreamHomeSummaryInner />
    </Suspense>
  );
}
