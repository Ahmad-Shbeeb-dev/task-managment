"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";

export function PageShell({ children }: { children: React.ReactNode }) {
  const [pageRef] = useAutoAnimate();

  return (
    <div
      ref={pageRef}
      className="flex w-full flex-col gap-6 bg-slate-50 p-6 dark:bg-gray-900 md:p-10"
    >
      {children}
    </div>
  );
}
