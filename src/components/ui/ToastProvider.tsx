"use client";

import { Check } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Notify = (message: string) => void;

const ToastContext = createContext<Notify>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback<Notify>((text) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 3200);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[84px] left-1/2 z-[150] flex w-max max-w-[92vw] -translate-x-1/2 items-center gap-[10px] rounded-[2px] bg-chocolate px-[18px] py-[13px] text-[12px] text-white shadow-soft min-[801px]:bottom-[25px] min-[801px]:left-auto min-[801px]:right-[25px] min-[801px]:translate-x-0"
        >
          <Check size={16} strokeWidth={2} aria-hidden="true" />
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
