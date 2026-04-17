import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border-transparent",
  danger:    "bg-red-600 text-white hover:bg-red-700 border-transparent",
  ghost:     "bg-transparent text-slate-700 hover:bg-slate-100 border-transparent",
  outline:   "bg-transparent text-indigo-600 border-indigo-600 hover:bg-indigo-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm:  "px-3 py-1.5 text-xs font-medium rounded-md gap-1.5",
  md:  "px-4 py-2 text-sm font-medium rounded-lg gap-2",
  lg:  "px-6 py-3 text-base font-semibold rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
