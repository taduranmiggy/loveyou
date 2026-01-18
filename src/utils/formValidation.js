import React from 'react';
import Toast from './toast.js';

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z\s]+$/,
  numeric: /^\d+$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};

// Validation rule types
export const ValidationRules = {
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value, minLength, fieldName) => {
    if (value && value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    return null;
  },

  maxLength: (value, maxLength, fieldName) => {
    if (value && value.length > maxLength) {
      return `${fieldName} cannot exceed ${maxLength} characters`;
    }
    return null;
  },

  pattern: (value, pattern, message, fieldName) => {
    if (value && !pattern.test(value)) {
      return message || `${fieldName} format is invalid`;
    }
    return null;
  },

  email: (value, fieldName = 'Email') => {
    if (value && !ValidationPatterns.email.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  password: (value, fieldName = 'Password') => {
    if (value && value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  },

  strongPassword: (value, fieldName = 'Password') => {
    if (value && !ValidationPatterns.strongPassword.test(value)) {
      return 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character';
    }
    return null;
  },

  confirmPassword: (value, originalPassword, fieldName = 'Confirm Password') => {
    if (value !== originalPassword) {
      return 'Passwords do not match';
    }
    return null;
  },

  age: (value, min = 13, max = 100) => {
    const age = parseInt(value);
    if (isNaN(age) || age < min || age > max) {
      return `Please enter a valid age between ${min} and ${max}`;
    }
    return null;
  },

  date: (value, fieldName = 'Date') => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return `Please enter a valid ${fieldName.toLowerCase()}`;
      }
    }
    return null;
  },

  futureDate: (value, fieldName = 'Date') => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date <= today) {
        return `${fieldName} must be in the future`;
      }
    }
    return null;
  },

  pastDate: (value, fieldName = 'Date') => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (date > today) {
        return `${fieldName} cannot be in the future`;
      }
    }
    return null;
  },

  custom: (value, validatorFunction, fieldName) => {
    if (typeof validatorFunction === 'function') {
      return validatorFunction(value, fieldName);
    }
    return null;
  }
};

// Enhanced form validator
export class FormValidator {
  constructor(formData, validationSchema) {
    this.formData = formData;
    this.validationSchema = validationSchema;
    this.errors = {};
  }

  // Validate a single field
  validateField(fieldName, value = null) {
    const fieldValue = value !== null ? value : this.formData[fieldName];
    const fieldRules = this.validationSchema[fieldName];
    
    if (!fieldRules) return null;

    const label = fieldRules.label || fieldName;
    let error = null;

    // Check each validation rule
    if (fieldRules.required) {
      error = ValidationRules.required(fieldValue, label);
      if (error) return error;
    }

    // Skip other validations if field is empty and not required
    if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
      return null;
    }

    if (fieldRules.minLength) {
      error = ValidationRules.minLength(fieldValue, fieldRules.minLength, label);
      if (error) return error;
    }

    if (fieldRules.maxLength) {
      error = ValidationRules.maxLength(fieldValue, fieldRules.maxLength, label);
      if (error) return error;
    }

    if (fieldRules.email) {
      error = ValidationRules.email(fieldValue, label);
      if (error) return error;
    }

    if (fieldRules.password) {
      error = ValidationRules.password(fieldValue, label);
      if (error) return error;
    }

    if (fieldRules.strongPassword) {
      error = ValidationRules.strongPassword(fieldValue, label);
      if (error) return error;
    }

    if (fieldRules.confirmPassword) {
      const originalField = fieldRules.confirmPassword;
      error = ValidationRules.confirmPassword(fieldValue, this.formData[originalField], label);
      if (error) return error;
    }

    if (fieldRules.age) {
      const { min, max } = fieldRules.age;
      error = ValidationRules.age(fieldValue, min, max);
      if (error) return error;
    }

    if (fieldRules.date) {
      error = ValidationRules.date(fieldValue, label);
      if (error) return error;
    }

    if (fieldRules.futureDate) {
      error = ValidationRules.futureDate(fieldValue, label);
      if (error) return error;
    }

    if (fieldRules.pastDate) {
      error = ValidationRules.pastDate(fieldValue, label);
      if (error) return error;
    }

    if (fieldRules.pattern) {
      const { regex, message } = fieldRules.pattern;
      error = ValidationRules.pattern(fieldValue, regex, message, label);
      if (error) return error;
    }

    if (fieldRules.custom) {
      error = ValidationRules.custom(fieldValue, fieldRules.custom, label);
      if (error) return error;
    }

    return null;
  }

  // Validate all fields
  validate() {
    this.errors = {};
    let isValid = true;

    Object.keys(this.validationSchema).forEach(fieldName => {
      const error = this.validateField(fieldName);
      if (error) {
        this.errors[fieldName] = error;
        isValid = false;
      }
    });

    return {
      isValid,
      errors: this.errors
    };
  }

  // Get error for a specific field
  getFieldError(fieldName) {
    return this.errors[fieldName] || null;
  }

  // Check if field has error
  hasFieldError(fieldName) {
    return !!this.errors[fieldName];
  }

  // Clear error for a specific field
  clearFieldError(fieldName) {
    delete this.errors[fieldName];
  }

  // Show validation errors as toast
  showErrorsAsToast() {
    const errorCount = Object.keys(this.errors).length;
    if (errorCount > 0) {
      Toast.error(`Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form`, {
        duration: 4000
      });
    }
  }
}

// Convenient validation function (backward compatible)
export const validateForm = (formData, validationSchema) => {
  const validator = new FormValidator(formData, validationSchema);
  return validator.validate();
};

// Real-time validation hook
export const useFormValidation = (initialData, validationSchema) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validator = new FormValidator(formData, validationSchema);

  const validateField = (fieldName, value = null) => {
    const error = validator.validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    return !error;
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validate if field has been touched
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    validateField(fieldName);
  };

  const validateAll = () => {
    validator.formData = formData;
    const result = validator.validate();
    setErrors(result.errors);
    return result;
  };

  const clearError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const reset = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    clearError,
    reset,
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0
  };
};

export default FormValidator;
