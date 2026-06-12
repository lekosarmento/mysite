import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "font-mono text-[var(--text-micro)] uppercase tracking-[3px] text-text-muted mb-[var(--leko-space-lg)]",
        className
      )}
    >
      {children}
    </div>
  );
}
