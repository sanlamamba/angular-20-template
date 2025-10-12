import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Auth } from '@core/services/auth';
import { DEMO_USERS } from '@app/core/models/user';

interface AdminStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin',
  imports: [CardModule, TableModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  protected auth = inject(Auth);

  usersArray = DEMO_USERS;

  protected stats: AdminStat[] = [
    {
      label: 'Total Users',
      value: String(this.usersArray.length),
      icon: 'pi-users',
      color: 'blue',
    },
    { label: 'Active Sessions', value: '1', icon: 'pi-circle', color: 'green' },
    { label: 'System Status', value: 'Online', icon: 'pi-server', color: 'purple' },
  ];

  protected users = this.usersArray.map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role,
    status: 'Active',
  }));

  protected getStatColorClasses(color: string): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
      green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
      purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
    };
    return colorMap[color] || '';
  }
}
