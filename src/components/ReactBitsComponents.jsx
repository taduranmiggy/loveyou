import React from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Input, 
  Select, 
  Checkbox, 
  Switch, 
  Card, 
  Badge,
  Progress,
  Skeleton,
  Toast as ReactBitsToast
} from 'react-bits';
import { LoadingSpinner } from './LoadingComponents';
import Toast from '../utils/toast';

// Enhanced Button with React Bits + Milady styling
export const MiladyButton = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  capybara = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white',
    secondary: 'bg-pink-100 hover:bg-pink-200 text-pink-800 border-2 border-pink-300',
    ghost: 'hover:bg-pink-50 text-pink-700 border border-pink-200'
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        className={`
          ${variants[variant]} 
          px-6 py-3 rounded-full font-semibold transition-all duration-200
          flex items-center justify-center space-x-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        disabled={loading}
        {...props}
      >
        {loading && <LoadingSpinner size="small" color="white" />}
        {capybara && !loading && <span>🦫</span>}
        <span>{children}</span>
      </Button>
    </motion.div>
  );
};

// Enhanced Input with React Bits + Milady styling
export const MiladyInput = ({ 
  label, 
  error, 
  icon: Icon, 
  capybara = false,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-pink-800">
          {label} {capybara && '🦫'}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
        )}
        <Input
          className={`
            w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 
            border rounded-2xl bg-white/50 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
            placeholder-pink-400 text-pink-800
            ${error ? 'border-red-300 focus:border-red-500' : 'border-pink-200'}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Enhanced Select with React Bits + Milady styling
export const MiladySelect = ({ 
  label, 
  options, 
  error, 
  placeholder = "Choose an option", 
  capybara = false,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-pink-800">
          {label} {capybara && '🦫'}
        </label>
      )}
      <Select
        className={`
          w-full px-4 py-3 border rounded-2xl bg-white/50 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
          text-pink-800
          ${error ? 'border-red-300 focus:border-red-500' : 'border-pink-200'}
        `}
        placeholder={placeholder}
        options={options}
        {...props}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Enhanced Card with React Bits + Milady styling
export const MiladyCard = ({ 
  children, 
  title, 
  subtitle, 
  capybara = false, 
  hover = true,
  ...props 
}) => {
  const motionProps = hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div {...motionProps}>
      <Card
        className="glass rounded-3xl p-6 shadow-lg border border-pink-100 bg-white/60 backdrop-blur-sm"
        {...props}
      >
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-xl font-bold text-pink-800 flex items-center gap-2">
                {title} {capybara && '🦫'}
              </h3>
            )}
            {subtitle && (
              <p className="text-pink-600 mt-1">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </Card>
    </motion.div>
  );
};

// Enhanced Progress with React Bits + Milady styling
export const MiladyProgress = ({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true, 
  capybara = false,
  color = 'pink'
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const colorClasses = {
    pink: 'bg-gradient-to-r from-pink-400 to-pink-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600'
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-pink-800">
            {label} {capybara && '🦫'}
          </span>
          {showPercentage && (
            <span className="text-sm text-pink-600">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

// Enhanced Badge with React Bits + Milady styling
export const MiladyBadge = ({ 
  children, 
  variant = 'default', 
  capybara = false,
  ...props 
}) => {
  const variants = {
    default: 'bg-pink-100 text-pink-800 border-pink-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <Badge
      className={`
        ${variants[variant]} 
        px-3 py-1 rounded-full text-xs font-semibold border
        inline-flex items-center gap-1
      `}
      {...props}
    >
      {capybara && <span>🦫</span>}
      {children}
    </Badge>
  );
};

// Enhanced Checkbox with React Bits + Milady styling
export const MiladyCheckbox = ({ 
  label, 
  capybara = false, 
  ...props 
}) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <Checkbox
        className="
          w-5 h-5 rounded border-2 border-pink-300 
          checked:bg-pink-600 checked:border-pink-600
          focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          transition-all duration-200
        "
        {...props}
      />
      <span className="text-pink-800 group-hover:text-pink-900 transition-colors">
        {label} {capybara && '🦫'}
      </span>
    </label>
  );
};

// Enhanced Switch with React Bits + Milady styling
export const MiladySwitch = ({ 
  label, 
  description, 
  capybara = false, 
  ...props 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-pink-800 font-medium flex items-center gap-2">
          {label} {capybara && '🦫'}
        </label>
        {description && (
          <p className="text-sm text-pink-600 mt-1">{description}</p>
        )}
      </div>
      <Switch
        className="
          relative inline-flex h-6 w-11 items-center rounded-full
          bg-pink-200 transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          data-[checked]:bg-pink-600
        "
        {...props}
      />
    </div>
  );
};

// Enhanced Skeleton with React Bits + Milady styling
export const MiladySkeleton = ({ 
  lines = 1, 
  avatar = false, 
  capybara = false 
}) => {
  return (
    <div className="animate-pulse space-y-3">
      {avatar && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-pink-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-pink-200 rounded-full w-3/4" />
            <div className="h-3 bg-pink-100 rounded-full w-1/2" />
          </div>
        </div>
      )}
      {capybara && (
        <div className="flex items-center justify-center py-4">
          <div className="w-16 h-16 bg-pink-200 rounded-full" />
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-pink-200 rounded-full" />
          <div className="h-4 bg-pink-100 rounded-full w-5/6" />
        </div>
      ))}
    </div>
  );
};

// Export all components
export {
  MiladyButton as Button,
  MiladyInput as Input,
  MiladySelect as Select,
  MiladyCard as Card,
  MiladyProgress as Progress,
  MiladyBadge as Badge,
  MiladyCheckbox as Checkbox,
  MiladySwitch as Switch,
  MiladySkeleton as Skeleton
};
