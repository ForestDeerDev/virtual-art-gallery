import request from "@/utils/request";
import type {
  LoginRequest,
  RegisterRequest,
  OAuthRequest,
  UserUpdateRequest,
  AuthResponse,
  User,
  UploadAvatarResponse,
} from "@/types";

const userApi = {
  login(credentials: LoginRequest): Promise<AuthResponse> {
    return request<AuthResponse>({
      url: "/auth/login",
      method: "post",
      data: credentials,
    });
  },

  register(userData: RegisterRequest): Promise<AuthResponse> {
    return request<AuthResponse>({
      url: "/auth/register",
      method: "post",
      data: userData,
    });
  },

  oauthLogin(requestData: OAuthRequest): Promise<AuthResponse> {
    return request<AuthResponse>({
      url: `/auth/oauth/${requestData.provider}`,
      method: "post",
      data: { code: requestData.code },
    });
  },

  getUserInfo(): Promise<User> {
    return request<User>({
      url: "/user/info",
      method: "get",
    });
  },

  updateProfile(userData: UserUpdateRequest): Promise<User> {
    return request<User>({
      url: "/user/profile",
      method: "put",
      data: userData,
    });
  },

  uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return request<UploadAvatarResponse>({
      url: "/upload/avatar",
      method: "post",
      data: formData,
    });
  },
};

export default userApi;
