import React from 'react';
import toast from 'react-hot-toast';

// Error types for better categorization
export const ErrorTypes = {
  NETWORK: 'network',
  AUTHENTICATION: 'auth',
  VALIDATION: 'validation',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

// Error messages mapping
const errorMessages = {
  [ErrorTypes.NETWORK]: {
    title: 'Connection Problem 🦫💔',
    message: 'Unable to connect to our servers. Please check your internet connection and try again.',
    action: 'Try Again'
  },
  [ErrorTypes.AUTHENTICATION]: {
    title: 'Authentication Error 🔐',
    message: 'Your session has expired or credentials are invalid. Please log in again.',
    action: 'Login'
  },
  [ErrorTypes.VALIDATION]: {
    title: 'Invalid Information 📝',
    message: 'Please check your input and make sure all required fields are filled correctly.',
    action: 'Fix'
  },
  [ErrorTypes.SERVER]: {
    title: 'Server Error 🚫',
    message: 'Something went wrong on our end. Our capybara team is working to fix it!',
    action: 'Retry'
  },
  [ErrorTypes.UNKNOWN]: {
    title: 'Unexpected Error 😟',
    message: 'Something unexpected happened. Please try again or contact support if the problem persists.',
    action: 'Retry'
  }
};

// Determine error type from error object or response
export const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN;
  
  // Network errors
  if (error.message === 'Failed to fetch' || error.code === 'NETWORK_ERROR') {
    return ErrorTypes.NETWORK;
  }
  
  // HTTP status based errors
  if (error.status || error.response?.status) {
    const status = error.status || error.response.status;
    
    if (status === 401 || status === 403) {
      return ErrorTypes.AUTHENTICATION;
    }
    
    if (status >= 400 && status < 500) {
      return ErrorTypes.VALIDATION;
    }
    
    if (status >= 500) {
      return ErrorTypes.SERVER;
    }
  }
  
  // Validation errors (if error has validation field)
  if (error.validation || error.errors) {
    return ErrorTypes.VALIDATION;
  }
  
  return ErrorTypes.UNKNOWN;
};

// Get user-friendly error message
export const getErrorMessage = (error, customMessage) => {
  if (customMessage) return customMessage;
  
  const errorType = getErrorType(error);
  const errorConfig = errorMessages[errorType];
  
  // Try to get specific message from error response
  const specificMessage = error.response?.data?.message || 
                          error.message || 
                          errorConfig.message;
  
  return {
    title: errorConfig.title,
    message: specificMessage,
    action: errorConfig.action
  };
};

// Show error toast with appropriate styling
export const showErrorToast = (error, customMessage) => {
  const errorInfo = getErrorMessage(error, customMessage);
  
  toast.error(errorInfo.message, {
    duration: 5000,
    style: {
      background: '#fef2f2',
      color: '#991b1b',
      border: '2px solid #fca5a5',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500',
      maxWidth: '400px'
    },
    icon: '🦫💔'
  });
  
  return errorInfo;
};

// Show success toast
export const showSuccessToast = (message, icon = '🦫✨') => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#fce7f3',
      color: '#831843',
      border: '2px solid #f9a8d4',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500'
    },
    icon
  });
};

// Show info toast
export const showInfoToast = (message, icon = '🦫💭') => {
  toast(message, {
    duration: 4000,
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '2px solid #93c5fd',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500'
    },
    icon
  });
};

// Enhanced error boundary component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    showErrorToast(error, 'Something went wrong. Please refresh the page.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
          <div className="text-center glass rounded-3xl p-8 max-w-md">
            <img 
              src="/src/assets/cutesycapybara.png" 
              alt="Error Capybara" 
              className="w-32 h-32 object-contain mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-pink-800 mb-4">
              Oops! Something went wrong 🦫💔
            </h2>
            <p className="text-pink-600 mb-6">
              Don't worry, our capybara team is on it! Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-pink-800 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// API error handler wrapper
export const handleApiError = async (apiCall, options = {}) => {
  const { 
    showToast = true, 
    customMessage = null,
    fallbackValue = null,
    retries = 0 
  } = options;
  
  try {
    const result = await apiCall();
    return { success: true, data: result };
  } catch (error) {
    console.error('API Error:', error);
    
    if (showToast) {
      showErrorToast(error, customMessage);
    }
    
    // Retry logic for network errors
    if (retries > 0 && getErrorType(error) === ErrorTypes.NETWORK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return handleApiError(apiCall, { ...options, retries: retries - 1 });
    }
    
    return { 
      success: false, 
      error, 
      data: fallbackValue,
      errorInfo: getErrorMessage(error, customMessage)
    };
  }
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const rule = rules[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `Invalid ${rule.label || field} format`;
    }
    
    if (value && rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = 'Please enter a valid email address';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
