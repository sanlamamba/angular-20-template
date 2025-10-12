import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/**
 * Error Boundary Component
 *
 * Displays a friendly error message when something goes wrong.
 * Can be used to wrap sections of your app for graceful error handling.
 *
 * @example
 * ```html
 * <app-error-boundary
 *   title="Something went wrong"
 *   [message]="errorMessage"
 *   [showRetry]="true"
 *   (onRetry)="retryOperation()"
 * />
 * ```
 */
@Component({
  selector: 'app-error-boundary',
  imports: [ButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        class="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6"
      >
        <i class="pi pi-exclamation-triangle text-5xl text-red-500 dark:text-red-400"></i>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ title() }}
      </h3>

      <p class="text-gray-600 dark:text-gray-400 max-w-md mb-2">
        {{ message() }}
      </p>

      @if (technicalDetails()) {
        <details class="mt-4 w-full max-w-md">
          <summary
            class="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
          >
            Technical Details
          </summary>
          <pre
            class="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left text-xs overflow-auto"
          >
            <code>{{ technicalDetails() }}</code>
          </pre>
        </details>
      }

      <div class="flex gap-3 mt-6">
        @if (showRetry()) {
          <p-button label="Try Again" icon="pi pi-refresh" (onClick)="retryAction.emit()" />
        }

        @if (showHome()) {
          <p-button
            label="Go Home"
            icon="pi pi-home"
            severity="secondary"
            (onClick)="goHomeAction.emit()"
          />
        }
      </div>
    </div>
  `,
})
export class ErrorBoundary {
  title = input<string>('Oops! Something went wrong');
  message = input<string>('We encountered an unexpected error. Please try again.');
  technicalDetails = input<string>('');
  showRetry = input<boolean>(true);
  showHome = input<boolean>(true);

  retryAction = output<void>();
  goHomeAction = output<void>();
}
