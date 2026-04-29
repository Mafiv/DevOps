import React from "react";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeStyles = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export function Spinner({ size = "md", className = "", label = "Loading…" }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={["inline-flex", className].join(" ")}>
      <span
        className={[
          "animate-spin rounded-full border-indigo-600 border-t-transparent",
          sizeStyles[size],
        ].join(" ")}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
