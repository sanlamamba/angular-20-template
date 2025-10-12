/**
 * LocalStorage utility wrapper
 *
 * Provides type-safe methods for storing and retrieving data.
 * Automatically handles JSON serialization/deserialization.
 *
 * NOTE: This uses localStorage (data persists even after browser/tab close).
 * For session-only storage, use storage.util.ts instead.
 *
 * Security Note:
 * localStorage is vulnerable to XSS attacks. Never store:
 * - Sensitive tokens (use httpOnly cookies in production)
 * - Personal information
 * - Payment details
 *
 * This is acceptable for:
 * - UI preferences (theme, language)
 * - Non-sensitive cache
 * - User settings
 */

/**
 * Store a value in localStorage
 *
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 *
 * @example
 * ```typescript
 * setItem('theme', 'dark');
 * setItem('userPreferences', { language: 'en', notifications: true });
 * ```
 */
export function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to store item "${key}":`, error);
  }
}

/**
 * Retrieve a value from localStorage
 *
 * @param key - Storage key
 * @returns Parsed value or null if not found
 *
 * @example
 * ```typescript
 * const theme = getItem<string>('theme');
 * const prefs = getItem<UserPreferences>('userPreferences');
 *
 * if (theme) {
 *   console.log('Current theme:', theme);
 * }
 * ```
 */
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

/**
 * Remove a value from localStorage
 *
 * @param key - Storage key to remove
 *
 * @example
 * ```typescript
 * removeItem('theme');
 * ```
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item "${key}":`, error);
  }
}

/**
 * Clear all items from localStorage
 *
 * @example
 * ```typescript
 * clearAll(); // Removes everything
 * ```
 */
export function clearAll(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Check if a key exists in localStorage
 *
 * @param key - Storage key to check
 * @returns true if key exists
 *
 * @example
 * ```typescript
 * if (hasItem('theme')) {
 *   console.log('Theme is set');
 * }
 * ```
 */
export function hasItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
}
