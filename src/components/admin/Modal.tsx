"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Modal({
  title,
  description,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] grid place-items-center bg-[rgba(51,27,22,.55)] p-[20px] backdrop-blur-[5px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`relative max-h-[92vh] overflow-auto rounded-[25px] bg-white p-[30px] max-[520px]:p-[22px] ${wide ? "w-[min(620px,95vw)]" : "w-[min(480px,95vw)]"}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-[18px] top-[18px] grid h-[38px] w-[38px] place-items-center rounded-full bg-white"
        >
          <X size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <h2 className="mb-[5px] pr-[40px] text-[25px]">{title}</h2>
        {description && <p className="text-[11px] text-muted">{description}</p>}
        {children}
      </div>
    </div>
  );
}
