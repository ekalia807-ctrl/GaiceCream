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
    timer.current = setTimeout(() => setMessage(""), 2600);
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
          className="fixed bottom-[25px] right-[25px] z-[150] flex items-center gap-[10px] rounded-[12px] bg-chocolate px-[18px] py-[13px] text-[11px] text-white shadow-soft"
        >
          <Check size={16} strokeWidth={2} aria-hidden="true" />
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
