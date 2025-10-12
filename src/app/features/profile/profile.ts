import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Auth } from '@core/services/auth';

import { RoleBadgePipe } from '@shared/pipes/role-badge.pipe';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, RoleBadgePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected auth = inject(Auth);
}
