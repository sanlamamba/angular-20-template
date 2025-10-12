import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns CSS classes for role badges
 */
@Pipe({
  name: 'roleBadge',
})
export class RoleBadgePipe implements PipeTransform {
  transform(role: string | undefined | null): string {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';

    const roleClasses: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200',
      user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200',
    };

    const roleClass = roleClasses[role?.toLowerCase() || ''] || roleClasses['user'];

    return `${baseClasses} ${roleClass}`;
  }
}
