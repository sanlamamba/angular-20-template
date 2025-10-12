import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Form Error Display Component
 *
 * Automatically displays validation errors for a form control.
 * Works with Angular's built-in validators and custom validators.
 *
 * @example
 * ```html
 * <input pInputText formControlName="email" />
 * <app-form-error [control]="form.controls.email" />
 * ```
 */
@Component({
  selector: 'app-form-error',
  template: `
    @if (control() && control()!.invalid && (control()!.dirty || control()!.touched)) {
      <small class="block mt-1 text-red-600 dark:text-red-400">
        {{ getErrorMessage() }}
      </small>
    }
  `,
})
export class FormError {
  control = input<AbstractControl | null>(null);

  /**
   * Get friendly error message based on validation error
   */
  getErrorMessage(): string {
    const errors = this.control()?.errors;
    if (!errors) return '';

    const errorMessages: Record<string, (error: Record<string, unknown>) => string> = {
      required: () => 'This field is required',
      email: () => 'Please enter a valid email address',
      minlength: (error) =>
        `Minimum length is ${error['requiredLength']} characters (current: ${error['actualLength']})`,
      maxlength: (error) =>
        `Maximum length is ${error['requiredLength']} characters (current: ${error['actualLength']})`,
      min: (error) => `Minimum value is ${error['min']} (current: ${error['actual']})`,
      max: (error) => `Maximum value is ${error['max']} (current: ${error['actual']})`,
      pattern: () => 'Please enter a valid format',
      passwordMismatch: () => 'Passwords do not match',
      invalidPassword: () =>
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    };

    // Get first error key
    const firstErrorKey = Object.keys(errors)[0];
    const errorHandler = errorMessages[firstErrorKey];

    return errorHandler ? errorHandler(errors[firstErrorKey]) : 'Invalid input';
  }
}
