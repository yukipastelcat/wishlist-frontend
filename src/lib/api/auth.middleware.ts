import type { RequestMiddleware, ResponseMiddleware } from "./client";
import { get } from "svelte/store";
import { auth } from "$lib/stores/auth.store";
import { m } from "$lib/paraglide/messages";
import { getLocale } from "$lib/paraglide/runtime";

export const authHeaderMiddleware: RequestMiddleware = async (ctx) => {
  const token = get(auth.accessToken);

  if (token) {
    ctx.options.headers = {
      ...ctx.options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return ctx;
};

export const localizationHeaderMiddleware: RequestMiddleware = async (ctx) => {
  const locale = getLocale();
  const currency = m.currency_code({}, { locale }).trim().toUpperCase();

  ctx.options.headers = {
    ...ctx.options.headers,
    "x-locale": locale,
    "x-currency": currency,
  };

  return ctx;
};


export const tokenRefreshMiddleware =
  (refreshTokenUrl: string): ResponseMiddleware =>
  async (response, ctx, retry) => {
    if (response.status !== 401) return response;

    // call auth refresh endpoint
    const refreshRes = await fetch(refreshTokenUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!refreshRes.ok) {
      auth.clearAuth();
      throw new Error('Session expired');
    }

    const data = await refreshRes.json();
    auth.setAccessToken(data.accessToken);

    // update Authorization header
    ctx.options.headers = {
      ...ctx.options.headers,
      Authorization: `Bearer ${data.accessToken}`,
    };

    // retry original request once
    return retry();
  };
