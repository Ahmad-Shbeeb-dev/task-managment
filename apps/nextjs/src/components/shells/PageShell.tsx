export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-6 bg-slate-50 p-6 md:p-10">
      {children}
    </div>
  );
}
