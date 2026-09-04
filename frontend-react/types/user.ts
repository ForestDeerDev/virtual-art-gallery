export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  tags?: string[];
  enabled: boolean;
  provider?: string;
  providerId?: string;
  createTime: string;
  updateTime: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  avatar?: string;
  tags?: string[];
}

export interface UploadAvatarResponse {
  url: string;
}
