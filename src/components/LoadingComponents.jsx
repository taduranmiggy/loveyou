import React from 'react';
import { motion } from 'framer-motion';

// Main loading spinner component
export const LoadingSpinner = ({ size = 'medium', color = 'pink' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    pink: 'border-pink-300 border-t-pink-600',
    white: 'border-white/30 border-t-white'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full`}
    />
  );
};

// Button loading state
export const LoadingButton = ({ children, loading, disabled, className, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${className} ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && <LoadingSpinner size="small" color="white" />}
        <span>{loading ? 'Loading...' : children}</span>
      </div>
    </button>
  );
};

// Page loading overlay
export const PageLoading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100"
        >
          <motion.img 
            src="/src/assets/smartcapybara.png" 
            alt="Loading Capybara" 
            className="w-20 h-20 object-contain mx-auto mb-4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <LoadingSpinner size="large" />
          <p className="text-pink-700 mt-4 font-medium">{message}</p>
        </motion.div>
      </div>
    </div>
  );
};

// Card skeleton loader
export const SkeletonCard = () => {
  return (
    <div className="glass rounded-3xl p-8 animate-pulse">
      <div className="bg-pink-100 rounded-full w-16 h-16 mx-auto mb-6"></div>
      <div className="bg-pink-100 h-6 rounded-full mb-4"></div>
      <div className="bg-pink-100 h-4 rounded-full mb-2"></div>
      <div className="bg-pink-100 h-4 rounded-full w-3/4"></div>
    </div>
  );
};

// Stats skeleton loader
export const SkeletonStats = () => {
  return (
    <div className="glass rounded-3xl p-6 animate-pulse">
      <div className="bg-pink-100 rounded-full w-12 h-12 mb-4"></div>
      <div className="bg-pink-100 h-8 rounded-full mb-2"></div>
      <div className="bg-pink-100 h-4 rounded-full w-2/3"></div>
    </div>
  );
};

// Calendar skeleton loader
export const SkeletonCalendar = () => {
  return (
    <div className="glass rounded-3xl p-6 animate-pulse">
      <div className="bg-pink-100 h-6 rounded-full mb-6 w-1/3"></div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-pink-100 h-10 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

// Form skeleton loader
export const SkeletonForm = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-pink-100 h-4 rounded-full w-1/4 mb-2"></div>
      <div className="bg-pink-100 h-12 rounded-2xl"></div>
      <div className="bg-pink-100 h-4 rounded-full w-1/4 mb-2"></div>
      <div className="bg-pink-100 h-12 rounded-2xl"></div>
      <div className="bg-pink-100 h-12 rounded-full"></div>
    </div>
  );
};
