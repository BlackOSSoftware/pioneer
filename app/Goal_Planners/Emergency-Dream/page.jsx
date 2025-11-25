"use client";

import { Suspense } from "react";
import EmergencyDreamInner from "./EmergencyDreamInner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmergencyDreamInner />
    </Suspense>
  );
}
