import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header class="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Angular Ultimate Template</h1>
          <p-button
            (onClick)="toggleDarkMode()"
            [icon]="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            [label]="isDark ? 'Light Mode' : 'Dark Mode'"
            severity="secondary"
          />
        </div>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-20-template');

  isDark = false;

  toggleDarkMode() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }
}
