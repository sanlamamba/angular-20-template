import { Injectable, signal, computed } from '@angular/core';

/**
 * Loading Service
 *
 * Manages global loading state using Signals.
 * Automatically tracks multiple concurrent loading operations.
 *
 * @example
 * ```typescript
 * const loading = inject(Loading);
 *
 * // Show loading
 * loading.show();
 *
 * // Hide loading
 * loading.hide();
 *
 * // Check if loading
 * if (loading.isLoading()) {
 *   console.log('Something is loading...');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class Loading {
  /**
   * Number of active loading operations
   * When > 0, loading indicator should be shown
   */
  private loadingCountSignal = signal<number>(0);

  /**
   * Computed: Is anything currently loading?
   */
  readonly isLoading = computed(() => this.loadingCountSignal() > 0);

  /**
   * Computed: Current number of loading operations
   */
  readonly loadingCount = computed(() => this.loadingCountSignal());

  /**
   * Show loading indicator
   * Increments the loading counter
   *
   * Call this when starting an async operation
   */
  show(): void {
    this.loadingCountSignal.update((count) => count + 1);
  }

  /**
   * Hide loading indicator
   * Decrements the loading counter
   *
   * Call this when an async operation completes
   */
  hide(): void {
    this.loadingCountSignal.update((count) => Math.max(0, count - 1));
  }

  /**
   * Reset loading counter to zero
   * Use this if you need to forcefully clear all loading states
   */
  reset(): void {
    this.loadingCountSignal.set(0);
  }
}
