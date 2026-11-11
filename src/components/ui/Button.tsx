import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light";
type Size = "md" | "sm";

type StyleOptions = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-[10px] rounded-full font-bold shadow-[0_8px_20px_rgba(113,63,50,.16)] transition-[transform,background-color] duration-[250ms] hover:-translate-y-[2px]";

const variants: Record<Variant, string> = {
  primary: "border-0 bg-chocolate text-white hover:bg-[#592f25]",
  secondary: "border border-[#e7d2c6] bg-white text-chocolate shadow-none",
  light: "border-0 bg-white text-chocolate",
};

const sizes: Record<Size, string> = {
  md: "px-[23px] py-[15px]",
  sm: "px-[18px] py-[11px] text-[13px]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  full = false,
  className,
}: StyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], full && "w-full", className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions;

export function Button({
  variant,
  size,
  full,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, full, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  StyleOptions & {
    href: string;
    /** true untuk link keluar (WhatsApp, dll): dibuka di tab baru */
    external?: boolean;
    children: ReactNode;
  };

export function ButtonLink({
  href,
  external = false,
  variant,
  size,
  full,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const styles = buttonStyles({ variant, size, full, className });

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles} {...props}>
      {children}
    </Link>
  );
}
