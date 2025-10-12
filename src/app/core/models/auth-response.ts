import { User } from './user';

/**
 * Response from authentication endpoints
 */
export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: number;
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  /** Subject (user email) */
  sub: string;
  /** User's display name */
  name: string;
  /** User's role */
  role: string;
  /** Issued at (seconds since epoch) */
  iat: number;
  /** Expires at (seconds since epoch) */
  exp: number;
}
