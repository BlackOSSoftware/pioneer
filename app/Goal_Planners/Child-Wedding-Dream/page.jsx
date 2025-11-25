"use client";

import { Suspense } from "react";
import WeddingDreamInner from "./WeddingDreamInner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WeddingDreamInner />
    </Suspense>
  );
}
