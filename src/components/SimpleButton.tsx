import React from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const SimpleButton = React.forwardRef<HTMLButtonElement, SimpleButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    fullWidth = false,
    className = '',
    disabled,
    children,
    ...props 
  }, ref) => {
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    // Variant classes
    const variantClasses = {
      primary: 'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700',
      secondary: 'bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700',
      ghost: 'bg-transparent text-pink-600 hover:bg-pink-50 active:bg-pink-100',
      outline: 'border-2 border-pink-500 text-pink-600 hover:bg-pink-50 active:bg-pink-100'
    };

    const isDisabled = disabled || loading;

    const baseClasses = `
      inline-flex items-center justify-center gap-2
      rounded-lg font-medium transition-colors
      focus:outline-none focus:ring-2 focus:ring-pink-300
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

SimpleButton.displayName = 'SimpleButton';

export default SimpleButton;
