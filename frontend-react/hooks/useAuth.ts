import { useMutation } from "@tanstack/react-query";
import userApi from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import { normalizeTaggable } from "@/utils/normalize";
import { resetTokenExpiredFlag } from "@/utils/request";
import type {
  LoginRequest,
  RegisterRequest,
  OAuthRequest,
  AuthResponse,
  User,
} from "@/types";

function commitAuth(response: AuthResponse): void {
  useAuthStore
    .getState()
    .setAuth(response.token, normalizeTaggable(response.user));
  resetTokenExpiredFlag();
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => userApi.login(credentials),
    onSuccess: commitAuth,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => userApi.register(userData),
    onSuccess: commitAuth,
  });
}

export function useOAuthLogin() {
  return useMutation({
    mutationFn: (requestData: OAuthRequest) => userApi.oauthLogin(requestData),
    onSuccess: commitAuth,
  });
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => !!state.token);
}

export function useIsAdmin(): boolean {
  return useAuthStore((state) => state.userInfo?.role === "ADMIN");
}

export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.userInfo);
}
