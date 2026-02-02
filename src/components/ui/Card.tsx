"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  noPadding?: boolean;
}

export default function Card({ children, title, subtitle, className = "", noPadding }: CardProps) {
  return (
    <div className={`card-glow bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl shadow-[var(--shadow-sm)] relative z-10 ${noPadding ? '' : 'p-3 sm:p-4 md:p-6'} ${className}`}>
      {title && (
        <div className={`mb-3 sm:mb-5 ${noPadding ? 'px-3 sm:px-6 pt-3 sm:pt-6' : ''}`}>
          <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
