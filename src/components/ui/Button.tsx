import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-transparent border-2 border-neon-cyan text-neon-cyan ' +
    'hover:bg-neon-cyan hover:text-void-900 ' +
    'shadow-neon-cyan hover:shadow-[0_0_20px_#00f5ff,0_0_40px_#00f5ff60] ' +
    'active:scale-95',
  secondary:
    'bg-transparent border-2 border-neon-purple text-neon-purple ' +
    'hover:bg-neon-purple hover:text-void-900 ' +
    'shadow-neon-purple hover:shadow-[0_0_20px_#bf00ff,0_0_40px_#bf00ff60] ' +
    'active:scale-95',
  danger:
    'bg-transparent border-2 border-neon-pink text-neon-pink ' +
    'hover:bg-neon-pink hover:text-white ' +
    'shadow-neon-pink hover:shadow-[0_0_20px_#ff007f,0_0_40px_#ff007f60] ' +
    'active:scale-95',
  ghost:
    'bg-transparent border border-white/20 text-white/70 ' +
    'hover:border-white/50 hover:text-white ' +
    'active:scale-95',
};

const sizeClasses = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

/** Neon-styled button component */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'font-mono font-bold uppercase tracking-widest',
        'rounded transition-all duration-150 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
