"use client";

import { Suspense } from "react";
import ChildEducationDreamInner from "./ChildEducationDreamInner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChildEducationDreamInner />
    </Suspense>
  );
}
