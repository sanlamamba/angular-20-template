import { ApplicationRef, Injectable, inject, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, first } from 'rxjs/operators';
import { concat, interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  private swUpdate = inject(SwUpdate);
  private appRef = inject(ApplicationRef);

  readonly updateAvailable = signal(false);
  readonly currentVersion = signal<string>('');
  readonly latestVersion = signal<string>('');

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.checkForUpdates();
      this.handleUpdates();
    }
  }

  private checkForUpdates(): void {
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        if (updateFound) {
          console.log('Update found, will download in background');
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    });
  }

  private handleUpdates(): void {
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(evt => {
        console.log('New version available:', evt.latestVersion);
        this.updateAvailable.set(true);
        this.currentVersion.set(JSON.stringify(evt.currentVersion));
        this.latestVersion.set(JSON.stringify(evt.latestVersion));
      });
  }

  async activateUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) return;

    try {
      await this.swUpdate.activateUpdate();
      console.log('Update activated, reloading...');
      document.location.reload();
    } catch (error) {
      console.error('Failed to activate update:', error);
    }
  }
}
