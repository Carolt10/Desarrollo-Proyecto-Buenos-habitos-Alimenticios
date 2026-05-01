/**
 * Shared validation utilities
 */

export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validateMinLength = (value: string, min: number, fieldName: string): string | null => {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, max: number, fieldName: string): string | null => {
  if (value.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return null;
};

export const validateArrayNotEmpty = (arr: unknown[], fieldName: string): string | null => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return `${fieldName} must contain at least one item`;
  }
  return null;
};

export const collectErrors = (errors: (string | null)[]): string[] => {
  return errors.filter((error): error is string => error !== null);
};
