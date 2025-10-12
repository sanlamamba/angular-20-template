import { Injectable, signal, computed } from '@angular/core';

/**
 * Loading Service - Manages global loading state using Signals.
 */
@Injectable({
  providedIn: 'root',
})
export class Loading {
  private loadingCountSignal = signal<number>(0);

  readonly isLoading = computed(() => this.loadingCountSignal() > 0);
  readonly loadingCount = computed(() => this.loadingCountSignal());

  show(): void {
    this.loadingCountSignal.update((count) => count + 1);
  }

  hide(): void {
    this.loadingCountSignal.update((count) => Math.max(0, count - 1));
  }

  reset(): void {
    this.loadingCountSignal.set(0);
  }
}
