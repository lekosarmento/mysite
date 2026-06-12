import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-[rgba(255,255,255,0.06)] bg-bg-secondary px-[14px] py-[6px] font-mono text-micro lowercase text-text-secondary whitespace-nowrap",
        className
      )}
    >
      {children}
    </span>
  );
}
