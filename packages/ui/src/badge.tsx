import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md",
        secondary: "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300",
        outline: "border-2 border-gray-300 text-gray-900 bg-white hover:bg-gray-50",
        success: "border-transparent bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md",
        warning: "border-transparent bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md",
        danger: "border-transparent bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md",
        info: "border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

