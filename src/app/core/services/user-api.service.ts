import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '@core/models/user';

/**
 * User API Service - Example service extending ApiService.
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ApiService {
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  getUserById(id: string): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.post<User>('/users', user);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.put<User>(`/users/${id}`, user);
  }

  patchUser(id: string, updates: Partial<User>): Observable<User> {
    return this.patch<User>(`/users/${id}`, updates);
  }

  deleteUser(id: string): Observable<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/users/${id}`);
  }

  searchUsers(filters: {
    role?: 'user' | 'admin';
    name?: string;
    email?: string;
  }): Observable<User[]> {
    return this.get<User[]>('/users/search', {
      params: filters as Record<string, string>,
    });
  }

  uploadAvatar(userId: string, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.post<{ url: string }>(`/users/${userId}/avatar`, formData);
  }

  getUsersWithRetry(): Observable<User[]> {
    return this.get<User[]>('/users', {
      retryAttempts: 5,
      retryDelay: 2000,
    });
  }

  getUsersWithCustomHeaders(): Observable<User[]> {
    return this.get<User[]>('/users', {
      headers: {
        'X-Custom-Header': 'custom-value',
        'X-API-Version': 'v2',
      },
    });
  }
}
