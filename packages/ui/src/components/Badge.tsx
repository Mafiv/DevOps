import React from "react";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger:  "bg-red-100 text-red-700",
  info:    "bg-sky-100 text-sky-700",
  purple:  "bg-purple-100 text-purple-700",
};

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
