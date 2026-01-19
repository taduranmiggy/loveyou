/**
 * Centralized error handling
 */

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 400,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (error: unknown): AppError => {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }

  // Handle Zod validation errors
  if (error instanceof Error && error.name === 'ZodError') {
    const message = (error as any).errors?.[0]?.message || 'Validation failed';
    return new AppError(message, 400);
  }

  // Handle standard errors
  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }

  // Handle unknown errors
  return new AppError('An unexpected error occurred', 500);
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('Network') || 
           error.message.includes('fetch') ||
           error.message.includes('CORS');
  }
  return false;
};
