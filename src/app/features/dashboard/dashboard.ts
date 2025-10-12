import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Auth } from '@core/services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected auth = inject(Auth);
}
