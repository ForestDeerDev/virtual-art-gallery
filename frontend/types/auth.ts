import type { User } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  tags?: string[];
}

export interface OAuthRequest {
  provider: string;
  code: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
