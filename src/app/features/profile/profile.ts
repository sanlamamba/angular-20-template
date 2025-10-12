import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Auth } from '@core/services/auth';
import { AppLayout } from '@shared/components/app-layout';
import { MetaService } from '@core/services/meta.service';
import { RoleBadgePipe } from '@shared/pipes/role-badge.pipe';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, RoleBadgePipe, AppLayout],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  protected auth = inject(Auth);
  private metaService = inject(MetaService);

  ngOnInit() {
    this.metaService.setPageMeta({
      title: 'Profile',
      description: 'View and manage your account information',
    });
  }
}
