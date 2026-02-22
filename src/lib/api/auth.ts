import { authHeaderMiddleware, tokenRefreshMiddleware } from "./auth.middleware";
import { ApiClient } from "./client";
import type { User } from "$lib/types/auth";
import { PUBLIC_AUTH_API_URL } from '$env/static/public';

const AUTH_API_BASE_URL = PUBLIC_AUTH_API_URL;

export const authApiClient = new ApiClient(AUTH_API_BASE_URL);
authApiClient.useRequestMiddleware(async (ctx) => ({
  ...ctx,
  options: {
    ...ctx.options,
    credentials: 'include',
  },
}));
authApiClient.useRequestMiddleware(authHeaderMiddleware);
authApiClient.useResponseMiddleware(tokenRefreshMiddleware(`${AUTH_API_BASE_URL}/auth/refresh`));

export type RequestCodeDto = {
    email: string;
}

export type VerifyCodeDto = RequestCodeDto & {
  code: string;
}

export type VerifyCodeResponse = {
  accessToken: string;
}

export type UserResponse = User;

export async function requestCode(data: RequestCodeDto) {
  return authApiClient.request('/auth/request-code', { method: 'POST', body: JSON.stringify(data) });
}

export async function verifyCode(data: VerifyCodeDto) {
  return authApiClient.request<VerifyCodeResponse>('/auth/verify-code', { method: 'POST', body: JSON.stringify(data) });
}

export async function logout() {
  return authApiClient.request('/auth/logout', { method: 'POST' });
}

export async function getUser() {
  return authApiClient.request<UserResponse>('/auth/user');
}
