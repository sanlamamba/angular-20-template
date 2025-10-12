import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ThemeService } from '@core/services/theme';
import { Loading } from '@app/core/services/loading';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-auth-layout',
  imports: [ButtonModule, CardModule],
  template: `
    <div
      class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8"
    >
      <div class="fixed top-4 right-4 flex gap-2">
        <p-button
          (onClick)="themeService.toggleDarkMode()"
          [icon]="themeService.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
          [text]="true"
          [rounded]="true"
          severity="secondary"
          size="large"
        />

        @if (showDebugTools) {
          <p-button
            (onClick)="toggleLoading()"
            icon="pi pi-spinner"
            [loading]="loading.isLoading()"
            [disabled]="loading.isLoading()"
            [label]="
              loading.isLoading() ? loading.loadingCount() + ' Actions Running' : 'Simulate Loading'
            "
          />
          <p-button
            (onClick)="simulateError()"
            icon="pi pi-exclamation-triangle"
            [text]="true"
            severity="danger"
            size="large"
            label="Simulate Error"
          />
        }
      </div>

      <p-card class="w-full max-w-md">
        <ng-content />
      </p-card>
    </div>
  `,
})
export class AuthLayout {
  protected themeService = inject(ThemeService);
  protected loading = inject(Loading);
  protected showDebugTools = environment.features.enableDebugTools;

  toggleLoading() {
    this.loading.show();
    setTimeout(() => {
      this.loading.hide();
      throw new Error('Simulated error for testing purposes');
    }, 3000);
  }
  simulateError() {
    throw new Error('Simulated error for testing purposes');
  }
}
