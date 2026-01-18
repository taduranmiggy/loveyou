import { toast } from 'react-hot-toast';

// Predefined toast configurations for consistency
export const toastConfig = {
  success: {
    style: {
      background: '#fce7f3',
      color: '#831843',
      border: '2px solid #f9a8d4',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500',
      maxWidth: '400px'
    },
    iconTheme: {
      primary: '#ec4899',
      secondary: '#fce7f3',
    },
    duration: 3000
  },
  error: {
    style: {
      background: '#fef2f2',
      color: '#991b1b',
      border: '2px solid #fca5a5',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500',
      maxWidth: '400px'
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fef2f2',
    },
    duration: 5000
  },
  loading: {
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '2px solid #93c5fd',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500'
    },
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#eff6ff',
    }
  },
  info: {
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '2px solid #93c5fd',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500'
    },
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#eff6ff',
    },
    duration: 4000
  }
};

// Enhanced toast functions with capybara personality
export const Toast = {
  success: (message, options = {}) => {
    const capybaraIcons = ['🦫✨', '🦫💕', '🦫🌸', '🦫⭐', '🦫💖'];
    const randomIcon = capybaraIcons[Math.floor(Math.random() * capybaraIcons.length)];
    
    return toast.success(message, {
      ...toastConfig.success,
      icon: options.icon || randomIcon,
      ...options
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      ...toastConfig.error,
      icon: options.icon || '🦫💔',
      ...options
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...toastConfig.loading,
      icon: options.icon || '🦫⏳',
      ...options
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      ...toastConfig.info,
      icon: options.icon || '🦫💭',
      ...options
    });
  },

  custom: (message, type = 'success', options = {}) => {
    const config = toastConfig[type] || toastConfig.success;
    return toast(message, {
      ...config,
      ...options
    });
  },

  // Special themed toasts
  pillReminder: (message, options = {}) => {
    return toast.success(message, {
      ...toastConfig.success,
      icon: '💊🦫',
      duration: 6000,
      ...options
    });
  },

  streak: (days, options = {}) => {
    return toast.success(`${days} day streak! You're on fire! 🔥`, {
      ...toastConfig.success,
      icon: '🦫🔥',
      duration: 4000,
      ...options
    });
  },

  welcome: (name, options = {}) => {
    return toast.success(`Welcome back, ${name}! Your capybara missed you! 🦫💕`, {
      ...toastConfig.success,
      icon: '👋',
      duration: 3000,
      ...options
    });
  },

  achievement: (message, options = {}) => {
    return toast.success(message, {
      ...toastConfig.success,
      icon: '🦫🏆',
      duration: 5000,
      ...options
    });
  },

  // Promise-based toast for async operations
  promise: (promise, options = {}) => {
    const defaultOptions = {
      loading: 'Working on it...',
      success: 'Success! 🦫✨',
      error: 'Oops! Something went wrong 🦫💔'
    };

    return toast.promise(promise, {
      ...defaultOptions,
      ...options
    }, {
      style: toastConfig.success.style,
      success: {
        ...toastConfig.success,
        icon: '🦫✨'
      },
      error: {
        ...toastConfig.error,
        icon: '🦫💔'
      },
      loading: {
        ...toastConfig.loading,
        icon: '🦫⏳'
      }
    });
  }
};

// Helper function to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Helper function to get toast position based on screen size
export const getToastPosition = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? 'top-center' : 'top-right';
  }
  return 'top-center';
};

export default Toast;
