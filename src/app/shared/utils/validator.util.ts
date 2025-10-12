import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Strong password validator
 * Requirements: 8+ chars, uppercase, lowercase, number, special character
 */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid =
      hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    if (!passwordValid) {
      return {
        weakPassword: {
          requirements: {
            minLength: hasMinLength,
            uppercase: hasUpperCase,
            lowercase: hasLowerCase,
            number: hasNumber,
            specialChar: hasSpecialChar,
          },
        },
      };
    }

    return null;
  };
}

/**
 * Email validator (stricter than Angular's built-in)
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const BANNED_DOMAINS = ['baddomain.com', 'spamdomain.org', 'tempmail.com'];

    const domain = value.split('@')[1]?.toLowerCase();
    if (domain && BANNED_DOMAINS.includes(domain)) {
      return { invalidEmail: { value, reason: 'Banned domain' } };
    }

    const isValid = emailPattern.test(value);

    return isValid ? null : { invalidEmail: { value, reason: 'Invalid format' } };
  };
}

/**
 * Numeric range validator
 */
export function rangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return { notANumber: { value } };
    }

    if (numValue < min || numValue > max) {
      return {
        outOfRange: {
          min,
          max,
          actual: numValue,
        },
      };
    }

    return null;
  };
}

/**
 * Field match validator (e.g., for password confirmation)
 */
export function matchFieldValidator(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    const field = control.parent.get(fieldName);

    if (!field) {
      console.warn(`matchFieldValidator: Field "${fieldName}" not found`);
      return null;
    }

    const fieldValue = field.value;
    const controlValue = control.value;

    if (fieldValue !== controlValue) {
      return {
        fieldMismatch: {
          field: fieldName,
          expected: fieldValue,
          actual: controlValue,
        },
      };
    }

    return null;
  };
}
