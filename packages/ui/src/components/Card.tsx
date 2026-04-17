import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
  bordered?: boolean;
}

export function Card({ noPadding = false, bordered = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-2xl shadow-sm",
        bordered ? "border border-slate-200" : "",
        noPadding ? "" : "p-6",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["flex items-center justify-between mb-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={["text-base font-semibold text-slate-900", className].join(" ")} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["text-sm text-slate-600", className].join(" ")} {...props}>
      {children}
    </div>
  );
}
