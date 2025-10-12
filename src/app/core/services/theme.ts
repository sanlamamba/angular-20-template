import { Injectable, signal, computed, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as LocalStorage from '@shared/utils/local-storage.util';

/**
 * Theme Service
 * Manages dark mode state across the application using Signals.
 * Automatically persists theme preference to localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Dark mode state signal
   * @private
   */
  private isDarkModeSignal = signal<boolean>(false);

  /**
   * Public read-only access to dark mode state
   */
  readonly isDarkMode = this.isDarkModeSignal.asReadonly();

  /**
   * Computed: Current theme name
   */
  readonly currentTheme = computed(() => (this.isDarkModeSignal() ? 'dark' : 'light'));

  constructor() {
    // Initialize theme from localStorage or system preference
    if (this.isBrowser) {
      this.initializeTheme();
      effect(() => {
        const isDark = this.isDarkModeSignal();
        this.applyTheme(isDark);
        this.persistTheme(isDark);
      });
    }
  }

  /**
   * Toggle dark mode on/off
   */
  toggleDarkMode(): void {
    this.isDarkModeSignal.update((current) => !current);
  }

  /**
   * Set dark mode explicitly
   * @param isDark - true for dark mode, false for light mode
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkModeSignal.set(isDark);
  }

  /**
   * Initialize theme from localStorage or system preference
   * @private
   */
  private initializeTheme(): void {
    const storedTheme = LocalStorage.getItem<string>('theme');

    if (storedTheme) {
      const isDark = storedTheme === 'dark';
      this.isDarkModeSignal.set(isDark);
      this.applyTheme(isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkModeSignal.set(prefersDark);
      this.applyTheme(prefersDark);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!LocalStorage.hasItem('theme')) {
        this.isDarkModeSignal.set(e.matches);
      }
    });
  }

  /**
   * Apply theme to the document
   * @private
   */
  private applyTheme(isDark: boolean): void {
    if (!this.isBrowser) return;

    const htmlElement = document.documentElement;

    if (isDark) {
      htmlElement.classList.add('app-dark');
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('app-dark');
      htmlElement.classList.remove('dark');
    }
  }

  /**
   * Persist theme preference to localStorage
   * @private
   */
  private persistTheme(isDark: boolean): void {
    if (!this.isBrowser) return;
    LocalStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
