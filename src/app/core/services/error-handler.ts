import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Global Error Handler
 *
 * Catches all uncaught errors in the application.
 * Displays user-friendly error messages using Toast notifications.
 * Logs errors to console for debugging.
 *
 * In production, also send errors to a monitoring service,
 * like Sentry, Rollbar, or CloudWatch.
 *
 * @example
 * Register in app.config.ts:
 * ```typescript
 * providers: [
 *   { provide: ErrorHandler, useClass: GlobalErrorHandler }
 * ]
 * ```
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private messageService = inject(MessageService);

  /**
   * Handle uncaught errors
   * @param error - The error that was thrown
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: Error | any): void {
    console.error('Uncaught error: ', error);

    // Determine error message
    const message = this.getErrorMessage(error);

    // Show user-friendly toast notification
    this.showErrorToast(message);

    this.sendToMonitoring(error);
  }

  /**
   * Extract user-friendly error message
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getErrorMessage(error: any): string {
    if (!error) {
      return 'An unknown error occurred';
    }

    // Handle different error types
    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status && error.statusText) {
      return `Error ${error.status}: ${error.statusText}`;
    }

    return 'An unexpected error occurred';
  }

  /**
   * Show error toast notification
   * @private
   */
  private showErrorToast(message: string): void {
    try {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000, // 3 seconds
        key: 'global-error',
      });
    } catch (toastError) {
      console.error('Failed to show error toast:', toastError);
      console.error('Original error:', message);
    }
  }

  /**
   * Send error to monitoring service
   * @private
   * @example
   * ```typescript
   * private sendToMonitoring(error: any): void {
   *   // Sentry example:
   *   // Sentry.captureException(error);
   *
   *   // Custom API example:
   *   // this.http.post('/api/errors', {
   *   //   message: error.message,
   *   //   stack: error.stack,
   *   //   timestamp: new Date().toISOString()
   *   // }).subscribe();
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sendToMonitoring(error: any): void {
    // TODO: Implement error tracking
    // Example services: Sentry, Rollbar, Bugsnag, CloudWatch
    if (error == null) {
      console.log('No error to send to monitoring');
    }
    return;
  }
}
