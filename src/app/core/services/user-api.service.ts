import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '@core/models/user';

/**
 * User API Service
 *
 * Example service extending ApiService to demonstrate domain-specific API services.
 * This service handles all user-related API calls.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class UserListComponent {
 *   private userApi = inject(UserApiService);
 *
 *   ngOnInit() {
 *     this.userApi.getUsers().subscribe({
 *       next: (users) => console.log('Users:', users),
 *       error: (err) => console.error('Failed to fetch users', err)
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ApiService {
  /**
   * Get all users
   * @returns Observable of user array
   */
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  /**
   * Get a single user by ID
   * @param id - User ID
   * @returns Observable of user object
   */
  getUserById(id: string): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user
   * @param user - User data
   * @returns Observable of created user
   */
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.post<User>('/users', user);
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param user - Updated user data
   * @returns Observable of updated user
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.put<User>(`/users/${id}`, user);
  }

  /**
   * Partially update a user
   * @param id - User ID
   * @param updates - Fields to update
   * @returns Observable of updated user
   */
  patchUser(id: string, updates: Partial<User>): Observable<User> {
    return this.patch<User>(`/users/${id}`, updates);
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns Observable of deletion result
   */
  deleteUser(id: string): Observable<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/users/${id}`);
  }

  /**
   * Search users with filters
   * @param filters - Search filters
   * @returns Observable of filtered user array
   *
   * @example
   * ```typescript
   * userApi.searchUsers({ role: 'admin', name: 'John' }).subscribe(users => {
   *   console.log('Found admins named John:', users);
   * });
   * ```
   */
  searchUsers(filters: {
    role?: 'user' | 'admin';
    name?: string;
    email?: string;
  }): Observable<User[]> {
    return this.get<User[]>('/users/search', {
      params: filters as Record<string, string>,
    });
  }

  /**
   * Example: Upload user avatar
   * Demonstrates handling different response types
   *
   * @param userId - User ID
   * @param file - Avatar file
   * @returns Observable of upload result
   */
  uploadAvatar(userId: string, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.post<{ url: string }>(`/users/${userId}/avatar`, formData);
  }

  /**
   * Example: Get users with custom retry options
   * Demonstrates using request options for custom behavior
   *
   * @returns Observable of user array with custom retry settings
   */
  getUsersWithRetry(): Observable<User[]> {
    return this.get<User[]>('/users', {
      retryAttempts: 5,
      retryDelay: 2000,
    });
  }

  /**
   * Example: Get users with custom headers
   * Demonstrates adding custom headers to requests
   *
   * @returns Observable of user array
   */
  getUsersWithCustomHeaders(): Observable<User[]> {
    return this.get<User[]>('/users', {
      headers: {
        'X-Custom-Header': 'custom-value',
        'X-API-Version': 'v2',
      },
    });
  }
}
