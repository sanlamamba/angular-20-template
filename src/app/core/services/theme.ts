import { Injectable, signal, computed, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as LocalStorage from '@shared/utils/local-storage.util';

/**
 * Theme Service - Manages dark mode state using Signals.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private isDarkModeSignal = signal<boolean>(false);

  readonly isDarkMode = this.isDarkModeSignal.asReadonly();
  readonly currentTheme = computed(() => (this.isDarkModeSignal() ? 'dark' : 'light'));

  constructor() {
    if (this.isBrowser) {
      this.initializeTheme();
      effect(() => {
        const isDark = this.isDarkModeSignal();
        this.applyTheme(isDark);
        this.persistTheme(isDark);
      });
    }
  }

  toggleDarkMode(): void {
    this.isDarkModeSignal.update((current) => !current);
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkModeSignal.set(isDark);
  }

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

  private persistTheme(isDark: boolean): void {
    if (!this.isBrowser) return;
    LocalStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
