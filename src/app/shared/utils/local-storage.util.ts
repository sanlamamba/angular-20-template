/**
 * LocalStorage utility wrapper with type-safe methods.
 *
 * Security Note: localStorage is vulnerable to XSS. Never store:
 * - Sensitive tokens (use httpOnly cookies)
 * - Personal information or payment details
 *
 * Use for: UI preferences, non-sensitive cache, user settings
 */

export function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to store item "${key}":`, error);
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to retrieve item "${key}":`, error);
    return null;
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item "${key}":`, error);
  }
}

export function clearAll(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

export function hasItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
}
