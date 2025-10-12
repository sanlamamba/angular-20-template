import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Global Error Handler
 * Catches uncaught errors and displays user-friendly messages.
 * In production, send errors to a monitoring service (Sentry, Rollbar, etc).
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private messageService = inject(MessageService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: Error | any): void {
    console.error('Uncaught error: ', error);

    const message = this.getErrorMessage(error);
    this.showErrorToast(message);
    this.sendToMonitoring(error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getErrorMessage(error: any): string {
    if (!error) {
      return 'An unknown error occurred';
    }

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sendToMonitoring(error: any): void {
    // TODO: Implement error tracking (Sentry, Rollbar, Bugsnag, CloudWatch)
    if (error == null) {
      console.log('No error to send to monitoring');
    }
    return;
  }
}
