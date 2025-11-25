"use client";

import { Suspense } from "react";
import DreamHomeDreamInner from "./DreamHomeDreamInner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DreamHomeDreamInner />
    </Suspense>
  );
}
