import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Auth } from '@core/services/auth';
import { ThemeService } from '@core/services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, ToastModule, TooltipModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      @if (auth.isAuthenticated()) {
        <header class="bg-white dark:bg-gray-800 shadow-sm p-4 transition-colors duration-200">
          <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              Angular Ultimate Template
            </h1>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-700 dark:text-gray-200">
                Hi, {{ auth.currentUser()?.name }} ({{ auth.currentUser()?.role }})
              </span>
              <p-button label="Logout" (onClick)="handleLogout()" severity="danger" size="small" />
              <p-button
                (onClick)="themeService.toggleDarkMode()"
                [icon]="themeService.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
                [text]="true"
                severity="secondary"
                [pTooltip]="
                  themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'
                "
                tooltipPosition="bottom"
              />
            </div>
          </div>
        </header>
      }
      <main class="transition-colors duration-200">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-20-template');
  private messageService = inject(MessageService);
  protected auth = inject(Auth);
  protected themeService = inject(ThemeService);

  handleLogout() {
    this.auth.logout();
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out',
      life: 3000,
    });
  }
}
