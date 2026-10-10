import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border transition-colors", {
  variants: {
    status: {
      OPEN: "bg-amber-50 text-amber-700 border-amber-200",
      IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
      DONE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  },
  defaultVariants: {
    status: "OPEN",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, status, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ status, className }))} {...props}>
      {children || status || "OPEN"}
    </span>
  );
}
