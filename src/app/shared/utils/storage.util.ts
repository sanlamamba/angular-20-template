/**
 * Storage utility for non-sensitive UI state
 */

export function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to store item "${key}":`, error);
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);

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
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item "${key}":`, error);
  }
}

export function clearAll(): void {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Failed to clear sessionStorage:', error);
  }
}

export function hasItem(key: string): boolean {
  return sessionStorage.getItem(key) !== null;
}
