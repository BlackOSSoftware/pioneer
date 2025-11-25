"use client";

import { Suspense } from "react";
import WealthDreamInner from "./WealthDreamInner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WealthDreamInner />
    </Suspense>
  );
}
