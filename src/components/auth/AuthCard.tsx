import type { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto my-[45px] w-[min(460px,92vw)] rounded-[24px] bg-white p-[32px] shadow-soft max-[520px]:p-[22px]">
      {children}
    </div>
  );
}
