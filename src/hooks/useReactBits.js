import { useState, useEffect, useCallback, useRef } from 'react';
import { Toast } from '../utils/toast';

// Enhanced localStorage hook with React Bits integration
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      Toast.error('Failed to load saved data');
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      Toast.error('Failed to save data');
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Debounced input hook for better performance
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Enhanced async hook with loading states
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const result = await asyncFunction(...args);
      setData(result);
      setStatus('success');
      return result;
    } catch (error) {
      setError(error);
      setStatus('error');
      Toast.error('Something went wrong. Please try again.');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle'
  };
};

// Form validation hook with React Bits integration
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${rules.label || name} is required`;
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `${rules.label || name} must be at least ${rules.minLength} characters`;
    }

    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }

    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value, values);
    }

    return null;
  }, [validationRules, values]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
    
    if (isTouched) {
      const error = validateField(name, values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField, values]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return Object.keys(newErrors).length === 0;
  }, [validationRules, validateField, values]);

  const handleSubmit = useCallback(async (onSubmit) => {
    if (!validateForm()) {
      Toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      Toast.success('Form submitted successfully! 🦫✨');
    } catch (error) {
      Toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    validateForm,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Intersection observer hook for scroll animations
export const useIntersection = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};

// Media query hook for responsive design
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event) => setMatches(event.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Previous value hook
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Pill tracking specific hook
export const usePillTracking = () => {
  const [pillData, setPillData] = useLocalStorage('loveyou_pill_data', {
    streak: 0,
    lastTaken: null,
    totalTaken: 0,
    missedDays: 0
  });

  const markPillTaken = useCallback((date = new Date()) => {
    const dateString = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    setPillData(prev => {
      const newData = { ...prev };
      
      if (dateString === today) {
        newData.streak = prev.lastTaken === dateString ? prev.streak : prev.streak + 1;
        newData.lastTaken = dateString;
        newData.totalTaken += 1;
        
        // Show achievement toasts
        if (newData.streak === 7) {
          Toast.achievement('1 week streak! Amazing! 🦫🎉');
        } else if (newData.streak === 30) {
          Toast.achievement('1 month streak! You\'re incredible! 🦫👑');
        } else if (newData.streak % 10 === 0 && newData.streak > 0) {
          Toast.streak(newData.streak);
        } else {
          Toast.pillReminder('Pill logged successfully! 🦫💊');
        }
      }
      
      return newData;
    });
  }, [setPillData]);

  const markPillMissed = useCallback(() => {
    setPillData(prev => ({
      ...prev,
      streak: 0,
      missedDays: prev.missedDays + 1
    }));
    Toast.info('Don\'t worry! Tomorrow is a new day 🦫💕');
  }, [setPillData]);

  return {
    ...pillData,
    markPillTaken,
    markPillMissed,
    resetData: () => setPillData({
      streak: 0,
      lastTaken: null,
      totalTaken: 0,
      missedDays: 0
    })
  };
};

// Theme hook for LoveYou styling
export const useLoveYouTheme = () => {
  const [theme, setTheme] = useLocalStorage('loveyou_theme', 'default');
  
  const themes = {
    default: {
      primary: 'pink',
      capybara: '🦫',
      gradient: 'from-pink-600 to-pink-700'
    },
    cute: {
      primary: 'rose',
      capybara: '🦫💕',
      gradient: 'from-rose-400 to-pink-600'
    },
    professional: {
      primary: 'purple',
      capybara: '🦫✨',
      gradient: 'from-purple-600 to-pink-600'
    }
  };

  return {
    currentTheme: themes[theme],
    setTheme,
    themes
  };
};

// Backward compatibility alias
export const useMiladyTheme = useLoveYouTheme;
