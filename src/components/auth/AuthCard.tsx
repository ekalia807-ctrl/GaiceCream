import type { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto my-[36px] w-[min(440px,92vw)] border border-line bg-white p-[30px] max-[520px]:p-[20px]">
      {children}
    </div>
  );
}
