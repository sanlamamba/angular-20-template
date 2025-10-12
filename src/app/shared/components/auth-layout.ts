import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ThemeService } from '@core/services/theme';

@Component({
  selector: 'app-auth-layout',
  imports: [ButtonModule, CardModule],
  template: `
    <div
      class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8"
    >
      <div class="fixed top-4 right-4">
        <p-button
          (onClick)="themeService.toggleDarkMode()"
          [icon]="themeService.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
          [text]="true"
          [rounded]="true"
          severity="secondary"
          size="large"
        />
      </div>

      <p-card class="w-full max-w-md">
        <ng-content />
      </p-card>
    </div>
  `,
})
export class AuthLayout {
  protected themeService = inject(ThemeService);
}
