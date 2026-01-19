import { expect, describe, it } from 'vitest';
import { sanitizeInput, validateAndSanitize } from './sanitization';

describe('Sanitization', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML special characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('validateAndSanitize.email', () => {
    it('should accept valid emails', () => {
      expect(validateAndSanitize.email('test@example.com')).toBe('test@example.com');
    });

    it('should reject invalid emails', () => {
      expect(() => validateAndSanitize.email('invalid-email')).toThrow();
    });

    it('should lowercase emails', () => {
      expect(validateAndSanitize.email('TEST@EXAMPLE.COM')).toBe('test@example.com');
    });
  });

  describe('validateAndSanitize.password', () => {
    it('should accept valid passwords', () => {
      expect(validateAndSanitize.password('validPassword123')).toBe('validPassword123');
    });

    it('should reject short passwords', () => {
      expect(() => validateAndSanitize.password('short')).toThrow();
    });
  });

  describe('validateAndSanitize.number', () => {
    it('should parse valid numbers', () => {
      expect(validateAndSanitize.number('42')).toBe(42);
    });

    it('should reject invalid numbers', () => {
      expect(() => validateAndSanitize.number('not a number')).toThrow();
    });

    it('should enforce min/max bounds', () => {
      expect(() => validateAndSanitize.number('5', 10, 20)).toThrow();
    });
  });
});
