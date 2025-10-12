import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ThemeService } from '@core/services/theme';
import { Auth } from '@core/services/auth';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  imports: [ButtonModule, AvatarModule, MenuModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm"
      >
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-3">
            <p-button
              icon="pi pi-bars"
              [text]="true"
              [rounded]="true"
              (onClick)="sidebarVisible.set(true)"
              class="lg:hidden"
            />
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Angular 20</h1>
          </div>

          <div class="flex items-center gap-2">
            <p-button
              (onClick)="themeService.toggleDarkMode()"
              [icon]="themeService.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
              [text]="true"
              [rounded]="true"
              severity="secondary"
            />

            <div class="flex items-center gap-2 ml-2">
              <div class="hidden md:block text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ auth.currentUser()?.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ auth.currentUser()?.email }}
                </p>
              </div>
              <p-button
                icon="pi pi-user"
                [rounded]="true"
                severity="secondary"
                (onClick)="router.navigate(['/profile'])"
              />
            </div>
          </div>
        </div>
      </header>

      <div class="flex flex-1">
        <aside
          class="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          <nav class="flex-1 px-4 py-6 space-y-2">
            @for (item of menuItems; track item.label) {
              <a
                [routerLink]="item.routerLink"
                routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                [routerLinkActiveOptions]="{ exact: item['exact'] ?? false }"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i [class]="item.icon"></i>
                <span class="font-medium">{{ item.label }}</span>
              </a>
            }
          </nav>

          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <p-button
              label="Logout"
              icon="pi pi-sign-out"
              severity="danger"
              [text]="true"
              (onClick)="auth.logout()"
              styleClass="w-full"
            />
          </div>
        </aside>

        @if (sidebarVisible()) {
          <div class="fixed inset-0 z-50 lg:hidden">
            <div
              class="absolute inset-0 bg-black/50 transition-opacity"
              (click)="sidebarVisible.set(false)"
              (keydown.escape)="sidebarVisible.set(false)"
              role="button"
              tabindex="0"
              aria-label="Close sidebar"
            ></div>

            <div
              class="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col"
            >
              <div
                class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                <p-button
                  icon="pi pi-times"
                  [text]="true"
                  [rounded]="true"
                  (onClick)="sidebarVisible.set(false)"
                  severity="secondary"
                />
              </div>

              <nav class="flex-1 space-y-2 p-4 overflow-y-auto">
                @for (item of menuItems; track item.label) {
                  <a
                    [routerLink]="item.routerLink"
                    routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    [routerLinkActiveOptions]="{ exact: item['exact'] ?? false }"
                    (click)="sidebarVisible.set(false)"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <i [class]="item.icon"></i>
                    <span class="font-medium">{{ item.label }}</span>
                  </a>
                }
              </nav>

              <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                <p-button
                  label="Logout"
                  icon="pi pi-sign-out"
                  severity="danger"
                  [text]="true"
                  (onClick)="auth.logout(); sidebarVisible.set(false)"
                  styleClass="w-full"
                />
              </div>
            </div>
          </div>
        }

        <main class="flex-1 overflow-auto">
          <div class="p-6">
            <ng-content />
          </div>

          <footer
            class="mt-auto py-6 px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div class="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>© 2025 Angular 20 Template. Built with Angular {{ angularVersion() }}</p>
              <p class="mt-1">
                <a
                  href="https://github.com"
                  target="_blank"
                  class="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  GitHub
                </a>
                <span class="mx-2">•</span>
                <a
                  href="https://angular.dev"
                  target="_blank"
                  class="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Documentation
                </a>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  `,
})
export class AppLayout {
  protected themeService = inject(ThemeService);
  protected auth = inject(Auth);
  protected router = inject(Router);

  protected sidebarVisible = signal(false);
  protected angularVersion = signal('20.x');

  protected menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/dashboard'],
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      routerLink: ['/profile'],
    },
    {
      label: 'Examples',
      icon: 'pi pi-code',
      routerLink: ['/examples'],
    },
    {
      label: 'Admin',
      icon: 'pi pi-shield',
      routerLink: ['/admin'],
    },
  ];
}
