"use client";

import { Suspense } from "react";
import ChildEducationDreamInner from "./ChildEducationDreamInner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
          Loading goal preview…
        </div>
      }
    >
      <ChildEducationDreamInner />
    </Suspense>
  );
}
