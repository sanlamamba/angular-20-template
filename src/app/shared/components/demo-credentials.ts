import { Component, computed } from '@angular/core';
import { DEMO_USERS } from '@core/models/user';

@Component({
  selector: 'app-demo-credentials',
  template: `
    <div class="pb-4 px-6 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Demo credentials: {{ credentialsText() }}
      </p>
    </div>
  `,
})
export class DemoCredentials {
  protected credentialsText = computed(() => {
    return DEMO_USERS.map((user) => `${user.email} / ${user.password}`).join(' or ');
  });
}
