export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="px-[10px] py-[36px] text-center text-[12px] text-muted">{children}</p>;
}

export function AdminLoading() {
  return (
    <div className="grid min-h-[40vh] place-items-center text-[12px] text-muted">
      Memuat data...
    </div>
  );
}
