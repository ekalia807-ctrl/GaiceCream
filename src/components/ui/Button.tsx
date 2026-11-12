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
  "inline-flex items-center justify-center gap-[10px] rounded-[2px] text-[12px] font-medium uppercase tracking-[.14em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "border border-chocolate bg-chocolate text-white hover:bg-[#44403c]",
  secondary: "border border-[#d6d3d1] bg-white text-chocolate hover:border-chocolate",
  light: "border border-white bg-white text-chocolate hover:bg-[#f5f5f4]",
};

const sizes: Record<Size, string> = {
  md: "min-h-[48px] px-[26px] py-[14px]",
  sm: "min-h-[40px] px-[18px] py-[10px] text-[11px]",
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
