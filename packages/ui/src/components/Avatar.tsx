import React from "react";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  return (
    <div
      className={[
        "inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold overflow-hidden flex-shrink-0",
        sizeStyles[size],
        className,
      ].join(" ")}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
