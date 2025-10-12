import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Auth } from '@core/services/auth';
import { AppLayout } from '@shared/components/app-layout';
import { MetaService } from '@core/services/meta.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, AppLayout],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  protected auth = inject(Auth);
  private metaService = inject(MetaService);

  ngOnInit() {
    this.metaService.setPageMeta({
      title: 'Dashboard',
      description: 'View your personal dashboard and analytics',
    });
  }
}
