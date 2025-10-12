import { Component } from '@angular/core';
import { AppLayout } from '@shared/components/app-layout';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

/**
 * Defer Example Component
 *
 * Demonstrates Angular's @defer block for lazy loading components.
 * This improves initial load time by deferring non-critical content.
 *
 * Key patterns:
 * - @defer: Lazy load content
 * - @placeholder: Show while loading
 * - @loading: Show during load
 * - @error: Show if load fails
 * - on interaction: Load when user interacts
 * - on viewport: Load when scrolled into view
 */
@Component({
  selector: 'app-defer-example',
  imports: [AppLayout, ButtonModule, CardModule],
  template: `
    <app-layout>
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">&#64;defer Examples</h1>

        <div class="space-y-6">
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h2 class="text-xl font-semibold">1. Load on Interaction</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Click the button to load heavy content
                </p>
              </div>
            </ng-template>

            @defer (on interaction) {
              <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Heavy Content Loaded!
                </h3>
                <p class="text-sm">
                  This content was lazy-loaded only when you interacted with the trigger.
                </p>
              </div>
            } @placeholder {
              <p-button label="Click to Load Content" icon="pi pi-download" />
            }
          </p-card>

          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h2 class="text-xl font-semibold">2. Load on Viewport</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Scroll down to load this content
                </p>
              </div>
            </ng-template>

            <div style="height: 400px" class="flex items-center justify-center">
              <p class="text-gray-500">Scroll down to see deferred content...</p>
            </div>

            @defer (on viewport) {
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Viewport Content Loaded!
                </h3>
                <p class="text-sm">This loaded automatically when scrolled into view.</p>
              </div>
            } @placeholder {
              <div class="h-32 flex items-center justify-center">
                <p class="text-gray-400">Content will load when visible...</p>
              </div>
            }
          </p-card>

          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h2 class="text-xl font-semibold">3. With Loading State</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Shows loading indicator while fetching
                </p>
              </div>
            </ng-template>

            @defer (on interaction; prefetch on idle) {
              <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 class="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  Content with Prefetch!
                </h3>
                <p class="text-sm">
                  This was prefetched during browser idle time for faster loading.
                </p>
              </div>
            } @loading (minimum 1s) {
              <div class="flex items-center justify-center p-8">
                <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
                <span class="ml-2">Loading...</span>
              </div>
            } @placeholder {
              <p-button label="Load with Loading State" icon="pi pi-bolt" />
            } @error {
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p class="text-red-600 dark:text-red-400">Failed to load content</p>
              </div>
            }
          </p-card>

          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h2 class="text-xl font-semibold">Why Use &#64;defer?</h2>
              </div>
            </ng-template>

            <ul class="space-y-2 text-sm">
              <li class="flex items-start">
                <i class="pi pi-check text-green-500 mr-2 mt-1"></i>
                <span>
                  <strong>Faster Initial Load:</strong> Reduce bundle size by loading features
                  on-demand
                </span>
              </li>
              <li class="flex items-start">
                <i class="pi pi-check text-green-500 mr-2 mt-1"></i>
                <span>
                  <strong>Better UX:</strong> Show critical content first, defer secondary features
                </span>
              </li>
              <li class="flex items-start">
                <i class="pi pi-check text-green-500 mr-2 mt-1"></i>
                <span>
                  <strong>Smart Prefetching:</strong> Load content during idle time for instant
                  interaction
                </span>
              </li>
              <li class="flex items-start">
                <i class="pi pi-check text-green-500 mr-2 mt-1"></i>
                <span>
                  <strong>Viewport Loading:</strong> Only load content when user scrolls to it
                </span>
              </li>
            </ul>
          </p-card>
        </div>
      </div>
    </app-layout>
  `,
})
export class DeferExample {}
