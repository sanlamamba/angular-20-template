import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/**
 * Empty State Component
 *
 * Displays a friendly empty state message when there's no data to show.
 * Commonly used in lists, tables, search results, etc.
 *
 * @example
 * ```html
 * <app-empty-state
 *   icon="pi pi-inbox"
 *   title="No items found"
 *   message="There are no items to display at the moment."
 *   [actionLabel]="'Create Item'"
 *   (onAction)="createNewItem()"
 * />
 * ```
 */
@Component({
  selector: 'app-empty-state',
  imports: [ButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6"
      >
        <i [class]="icon() + ' text-5xl text-gray-400 dark:text-gray-500'"></i>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ title() }}
      </h3>

      <p class="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {{ message() }}
      </p>

      @if (actionLabel()) {
        <p-button [label]="actionLabel()" [icon]="actionIcon()" (onClick)="action.emit()" />
      }
    </div>
  `,
})
export class EmptyState {
  icon = input<string>('pi pi-inbox');
  title = input<string>('No data available');
  message = input<string>('There is no data to display at the moment.');
  actionLabel = input<string>('');
  actionIcon = input<string>('pi pi-plus');
  action = output<void>();
}
