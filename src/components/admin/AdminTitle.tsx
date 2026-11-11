import type { ReactNode } from "react";

export function AdminTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-[28px] flex flex-wrap items-end justify-between gap-[12px] max-[520px]:items-start">
      <div>
        <span className="text-[11px] text-biscuit">{eyebrow}</span>
        <h1 className="mt-[4px] text-[30px] max-[800px]:text-[25px]">{title}</h1>
      </div>
      {children}
    </div>
  );
}
