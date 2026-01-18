import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from '../utils/toast';

// Enhanced Button Component
export const MiladyButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white border-2 border-pink-300 hover:border-pink-400 text-pink-600 hover:bg-pink-50",
    ghost: "text-pink-600 hover:bg-pink-100",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
  };
  
  const sizes = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3 text-base",
    large: "px-6 py-4 text-lg"
  };

  const handleClick = (e) => {
    if (loading || disabled) return;
    
    // Ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    onClick?.(e);
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </div>
      
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </motion.button>
  );
});

// Enhanced Input Component
export const MiladyInput = forwardRef(({
  label,
  error,
  success,
  leftIcon,
  rightIcon,
  className = '',
  type = 'text',
  placeholder = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 
    focus:outline-none focus:ring-4 focus:ring-pink-300/30
    ${error 
      ? 'border-red-400 bg-red-50' 
      : success 
        ? 'border-green-400 bg-green-50'
        : focused 
          ? 'border-pink-400 bg-pink-50' 
          : 'border-pink-200 bg-white hover:border-pink-300'
    }
    ${leftIcon ? 'pl-12' : ''}
    ${rightIcon ? 'pr-12' : ''}
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <motion.label
          className={`block text-sm font-medium transition-colors duration-300 ${
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-pink-700'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400">
            {leftIcon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          whileFocus={{ scale: 1.02 }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {(error || success) && (
          <motion.p
            className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error || success} 🐹
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

// Enhanced Select Component
export const MiladySelect = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium ${error ? 'text-red-600' : 'text-pink-700'}`}>
          {label}
        </label>
      )}
      
      <motion.select
        className={`
          w-full px-4 py-3 border-2 rounded-xl transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-pink-300/30
          ${error ? 'border-red-400 bg-red-50' : 'border-pink-200 bg-white hover:border-pink-300 focus:border-pink-400 focus:bg-pink-50'}
        `}
        whileFocus={{ scale: 1.02 }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      
      {error && (
        <motion.p
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error} 🐹
        </motion.p>
      )}
    </div>
  );
};

// Enhanced Card Component
export const MiladyCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      className={`
        bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-6 shadow-lg
        ${hover ? 'hover:shadow-xl' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Progress Component
export const MiladyProgress = ({ value = 0, max = 100, label, showPercentage = true, className = '' }) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-pink-700">{label}</span>}
          {showPercentage && <span className="text-sm text-pink-600">{percentage}%</span>}
        </div>
      )}
      
      <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Enhanced Badge Component
export const MiladyBadge = ({ children, variant = 'primary', size = 'medium', className = '' }) => {
  const variants = {
    primary: 'bg-pink-100 text-pink-800 border-pink-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  
  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };
  
  return (
    <motion.span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );
};

// Enhanced Checkbox Component
export const MiladyCheckbox = ({ label, checked, onChange, className = '' }) => {
  return (
    <motion.label className={`flex items-center space-x-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <motion.div
          className={`
            w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
            ${checked 
              ? 'bg-pink-500 border-pink-500' 
              : 'bg-white border-pink-300 hover:border-pink-400'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {checked && (
              <motion.svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {label && <span className="text-pink-700 font-medium">{label}</span>}
    </motion.label>
  );
};

// Enhanced Switch Component
export const MiladySwitch = ({ checked, onChange, label, className = '' }) => {
  return (
    <motion.label className={`flex items-center space-x-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <motion.div
          className={`
            w-12 h-6 rounded-full transition-all duration-300
            ${checked ? 'bg-pink-500' : 'bg-gray-300'}
          `}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-md"
            animate={{
              x: checked ? 26 : 2,
              y: 2
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
      {label && <span className="text-pink-700 font-medium">{label}</span>}
    </motion.label>
  );
};

// Enhanced Skeleton Component
export const MiladySkeleton = ({ className = '', width, height }) => {
  return (
    <motion.div
      className={`bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Export backward-compatible aliases
export const LoveYouButton = MiladyButton;
export const LoveYouInput = MiladyInput;
export const LoveYouSelect = MiladySelect;
export const LoveYouCard = MiladyCard;
export const LoveYouProgress = MiladyProgress;
export const LoveYouBadge = MiladyBadge;
export const LoveYouCheckbox = MiladyCheckbox;
export const LoveYouSwitch = MiladySwitch;
export const LoveYouSkeleton = MiladySkeleton;
