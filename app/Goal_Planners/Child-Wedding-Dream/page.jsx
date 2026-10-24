"use client";

import { Suspense } from "react";
import WeddingDreamInner from "./WeddingDreamInner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
          Loading goal preview…
        </div>
      }
    >
      <WeddingDreamInner />
    </Suspense>
  );
}
