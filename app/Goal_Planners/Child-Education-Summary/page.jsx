"use client";

import { Suspense } from "react";
import ChildEducationSummaryInner from "./ChildEducationSummaryInner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
          Loading plan summary…
        </div>
      }
    >
      <ChildEducationSummaryInner />
    </Suspense>
  );
}
