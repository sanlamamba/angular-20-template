import { Component, inject } from '@angular/core';
import { SwUpdateService } from '@core/services/sw-update';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [ButtonModule],
  template: `
    @if (swUpdate.updateAvailable()) {
      <div class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
        <p class="font-semibold mb-2">New Update Available!</p>
        <p class="text-sm mb-3">A new version of the app is ready.</p>
        <button
          pButton
          label="Update Now"
          icon="pi pi-refresh"
          class="w-full"
          (click)="update()">
        </button>
      </div>
    }
  `
})
export class UpdateNotificationComponent {
  protected swUpdate = inject(SwUpdateService);

  update() {
    this.swUpdate.activateUpdate();
  }
}
