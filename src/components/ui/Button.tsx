import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "fill";
}

export function Button({ children, className, variant = "ghost", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-6 py-3 font-mono text-[12px] uppercase tracking-[1px] transition-all duration-normal ease-expo cursor-pointer",
        variant === "ghost" 
          ? "bg-transparent border border-border-subtle text-text-primary hover:bg-text-primary hover:text-bg-primary hover:border-text-primary shadow-sm hover:shadow-lg"
          : "bg-bg-tertiary text-text-primary hover:bg-text-primary hover:text-bg-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
