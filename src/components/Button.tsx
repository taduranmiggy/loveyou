import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

// Button variant types
type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDrop'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  shimmer?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  shimmer = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className = '',
  children,
  onClick,
  ...buttonProps
}, ref) => {

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-4 py-2',
      text: 'text-sm',
      iconSize: 'w-4 h-4',
      minHeight: 'min-h-[36px]',
      gap: 'gap-2'
    },
    md: {
      padding: 'px-6 py-3',
      text: 'text-base',
      iconSize: 'w-5 h-5',
      minHeight: 'min-h-[44px]',
      gap: 'gap-2'
    },
    lg: {
      padding: 'px-8 py-4',
      text: 'text-lg',
      iconSize: 'w-6 h-6',
      minHeight: 'min-h-[52px]',
      gap: 'gap-3'
    }
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      base: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl border border-pink-300',
      hover: 'hover:from-pink-600 hover:via-rose-600 hover:to-pink-700',
      active: 'active:from-pink-700 active:via-rose-700 active:to-pink-800',
      disabled: 'disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 disabled:shadow-sm',
      focus: 'focus:ring-4 focus:ring-pink-200'
    },
    secondary: {
      base: 'bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl border border-purple-300',
      hover: 'hover:from-purple-600 hover:via-violet-600 hover:to-purple-700',
      active: 'active:from-purple-700 active:via-violet-700 active:to-purple-800',
      disabled: 'disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 disabled:shadow-sm',
      focus: 'focus:ring-4 focus:ring-purple-200'
    },
    glass: {
      base: 'bg-white/20 backdrop-blur-md text-gray-800 shadow-lg hover:shadow-xl border border-white/30',
      hover: 'hover:bg-white/30 hover:border-white/40',
      active: 'active:bg-white/40',
      disabled: 'disabled:bg-gray-200/20 disabled:text-gray-400 disabled:shadow-sm',
      focus: 'focus:ring-4 focus:ring-white/20'
    },
    outline: {
      base: 'bg-transparent text-pink-600 border-2 border-pink-300 hover:bg-pink-50',
      hover: 'hover:border-pink-400 hover:text-pink-700',
      active: 'active:bg-pink-100',
      disabled: 'disabled:border-gray-300 disabled:text-gray-400 disabled:bg-transparent',
      focus: 'focus:ring-4 focus:ring-pink-200'
    },
    ghost: {
      base: 'bg-transparent text-gray-700 hover:bg-gray-100',
      hover: 'hover:text-gray-900',
      active: 'active:bg-gray-200',
      disabled: 'disabled:text-gray-400 disabled:bg-transparent',
      focus: 'focus:ring-4 focus:ring-gray-200'
    }
  };

  const sizeClasses = sizeConfig[size];
  const variantClasses = variantConfig[variant];
  const isDisabled = disabled || loading;

  const baseClasses = [
    'relative',
    'font-semibold',
    'rounded-xl',
    'transition-all',
    'duration-300',
    'ease-out',
    'focus:outline-none',
    'transform',
    'overflow-hidden',
    'select-none',
    'pointer-events-auto',
    sizeClasses.padding,
    sizeClasses.text,
    sizeClasses.minHeight,
    variantClasses.base,
    variantClasses.hover,
    variantClasses.active,
    variantClasses.disabled,
    variantClasses.focus,
    fullWidth ? 'w-full' : 'inline-flex',
    'items-center',
    'justify-center',
    sizeClasses.gap,
    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
    className
  ].join(' ');

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        ease: 'easeInOut' as const,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: isDisabled ? 1 : 1.02,
      y: isDisabled ? 0 : -2,
      transition: { duration: 0.2, ease: 'easeOut' as const }
    },
    tap: { 
      scale: isDisabled ? 1 : 0.98,
      y: isDisabled ? 0 : 0,
      transition: { duration: 0.1 }
    }
  };

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    initial: { opacity: 1 },
    loading: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="inline-block pointer-events-auto"
    >
      <button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        onClick={onClick}
        {...buttonProps}
      >
      {/* Shimmer effect */}
      {shimmer && !isDisabled && (
        <motion.div
          className="absolute inset-0 -z-1"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        >
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12" />
        </motion.div>
      )}

      {/* Glass morphism background blur effect */}
      {variant === 'glass' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm" />
      )}

      {/* Content container */}
      <div className="relative flex items-center justify-center gap-inherit">
        {/* Loading state */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              variants={loadingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              <Loader2 className={`${sizeClasses.iconSize} animate-spin`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button content */}
        <motion.div
          className="flex items-center gap-inherit"
          variants={contentVariants}
          animate={loading ? 'loading' : 'initial'}
        >
          {/* Left icon */}
          {icon && iconPosition === 'left' && !loading && (
            <motion.span
              className={`${sizeClasses.iconSize} flex-shrink-0`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {icon}
            </motion.span>
          )}

          {/* Button text */}
          <motion.span
            className="font-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.span>

          {/* Right icon */}
          {icon && iconPosition === 'right' && !loading && (
            <motion.span
              className={`${sizeClasses.iconSize} flex-shrink-0`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {icon}
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={false}
        whileTap={isDisabled ? {} : {
          background: variant === 'glass' 
            ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }}
        transition={{ duration: 0.3 }}
      />
      </button>
    </motion.div>
  );
});

Button.displayName = 'Button';

export default Button;
