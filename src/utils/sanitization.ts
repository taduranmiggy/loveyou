/**
 * Security utilities for input sanitization
 */

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>\"'&]/g, (char) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[char] || char;
    })
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const validateAndSanitize = {
  email: (email: string): string => {
    const sanitized = sanitizeEmail(email);
    if (!sanitized.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email format');
    }
    return sanitized;
  },

  password: (password: string): string => {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    return password; // Don't sanitize passwords - they should contain special chars
  },

  text: (text: string, minLength = 1, maxLength = 255): string => {
    const sanitized = sanitizeInput(text);
    if (sanitized.length < minLength) {
      throw new Error(`Text must be at least ${minLength} characters`);
    }
    if (sanitized.length > maxLength) {
      throw new Error(`Text must be at most ${maxLength} characters`);
    }
    return sanitized;
  },

  number: (num: unknown, min?: number, max?: number): number => {
    const parsed = Number(num);
    if (isNaN(parsed)) {
      throw new Error('Invalid number');
    }
    if (min !== undefined && parsed < min) {
      throw new Error(`Number must be at least ${min}`);
    }
    if (max !== undefined && parsed > max) {
      throw new Error(`Number must be at most ${max}`);
    }
    return parsed;
  }
};
