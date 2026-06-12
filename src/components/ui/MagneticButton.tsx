"use client";

import { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'ghost' | 'fill';
}

export function MagneticButton({ 
  children, 
  className = "", 
  variant = 'ghost',
  ...props 
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyle = "rounded-full px-6 py-3 font-mono text-[12px] uppercase tracking-[1px] transition-colors duration-normal ease-expo relative flex items-center justify-center shadow-lg";
  const variants = {
    ghost: "bg-transparent border border-border-subtle text-text-primary hover:bg-white hover:text-black",
    fill: "bg-[#1A1A1A] text-white hover:bg-black"
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
