import React from "react";
import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";

export type StatusValue =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "ROLLED_BACK"
  | "ACTIVE"
  | "ARCHIVED"
  | "MAINTENANCE";

const STATUS_MAP: Record<StatusValue, { label: string; variant: BadgeVariant; dot: string }> = {
  PENDING:     { label: "Pending",     variant: "default", dot: "bg-slate-400" },
  RUNNING:     { label: "Running",     variant: "info",    dot: "bg-sky-500 animate-pulse" },
  IN_PROGRESS: { label: "In Progress", variant: "info",    dot: "bg-sky-500 animate-pulse" },
  SUCCESS:     { label: "Success",     variant: "success", dot: "bg-emerald-500" },
  FAILED:      { label: "Failed",      variant: "danger",  dot: "bg-red-500" },
  CANCELLED:   { label: "Cancelled",   variant: "warning", dot: "bg-amber-500" },
  ROLLED_BACK: { label: "Rolled Back", variant: "warning", dot: "bg-amber-500" },
  ACTIVE:      { label: "Active",      variant: "success", dot: "bg-emerald-500" },
  ARCHIVED:    { label: "Archived",    variant: "default", dot: "bg-slate-400" },
  MAINTENANCE: { label: "Maintenance", variant: "warning", dot: "bg-amber-500" },
};

export interface StatusBadgeProps {
  status: StatusValue;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, variant, dot } = STATUS_MAP[status] ?? STATUS_MAP.PENDING;
  return (
    <Badge variant={variant} className={className}>
      <span className={["inline-block h-1.5 w-1.5 rounded-full", dot].join(" ")} />
      {label}
    </Badge>
  );
}
