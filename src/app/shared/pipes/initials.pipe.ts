import { Pipe, PipeTransform } from '@angular/core';

/**
 * Extracts initials from a name (first letter of each word)
 */
@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(name: string | null | undefined, maxInitials = 2): string {
    if (!name) return '';

    const words = name.trim().split(/\s+/);
    const initials = words
      .slice(0, maxInitials)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');

    return initials;
  }
}
