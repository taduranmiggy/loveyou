import { z } from 'zod';

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Onboarding schema
export const OnboardingSchema = z.object({
  nickname: z.string().min(2, 'Nickname must be at least 2 characters'),
  pillType: z.string().min(1, 'Please select a pill type'),
  pillTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  cycleLength: z.number().min(21, 'Cycle length must be at least 21 days').max(35, 'Cycle length must be at most 35 days'),
  lastPeriodDate: z.string().min(1, 'Please enter your last period date'),
  cycleRegularity: z.enum(['regular', 'irregular', 'not-sure']),
  previousContraception: z.string().optional(),
  healthConditions: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional()
});

// Settings schema
export const SettingsSchema = z.object({
  nickname: z.string().min(2, 'Nickname must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  pillTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  themePreference: z.enum(['light', 'dark']).optional()
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type OnboardingInput = z.infer<typeof OnboardingSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;
