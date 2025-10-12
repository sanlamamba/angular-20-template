import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for strong passwords
 *
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character (!@#$%^&*)
 *
 * @returns Validator function
 *
 * @example
 * ```typescript
 * this.form = new FormGroup({
 *   password: new FormControl('', [
 *     Validators.required,
 *     strongPasswordValidator()
 *   ])
 * });
 * ```
 */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values (use Validators.required for that)
    }

    // Check minimum length
    const hasMinLength = value.length >= 8;

    // Check for uppercase letter
    const hasUpperCase = /[A-Z]/.test(value);

    // Check for lowercase letter
    const hasLowerCase = /[a-z]/.test(value);

    // Check for number
    const hasNumber = /[0-9]/.test(value);

    // Check for special character
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
 * Validator for email format
 *
 * More strict than Angular's built-in email validator.
 *
 * @returns Validator function
 *
 * @example
 * ```typescript
 * this.form = new FormGroup({
 *   email: new FormControl('', [
 *     Validators.required,
 *     emailValidator()
 *   ])
 * });
 * ```
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values (use Validators.required for that)
    }

    // RFC 5322 simplified email regex
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
 * Validator for numeric range
 *
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Validator function
 *
 * @example
 * ```typescript
 * this.form = new FormGroup({
 *   age: new FormControl('', [
 *     Validators.required,
 *     rangeValidator(18, 100)
 *   ])
 * });
 * ```
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
 * Validator to match two form fields
 *
 * Useful for password confirmation, email confirmation, etc.
 *
 * @param fieldName - Name of the field to match against
 * @returns Validator function
 *
 * @example
 * ```typescript
 * this.form = new FormGroup({
 *   password: new FormControl(''),
 *   confirmPassword: new FormControl('', [
 *     matchFieldValidator('password')
 *   ])
 * });
 * ```
 */
export function matchFieldValidator(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null; // No parent form yet
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
