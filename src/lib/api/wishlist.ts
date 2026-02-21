import {
	authHeaderMiddleware,
	localizationHeaderMiddleware,
	tokenRefreshMiddleware
} from './auth.middleware';
import { ApiClient } from './client';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL;
const WISHLIST_API_BASE_URL =
	import.meta.env.VITE_WISHLIST_API_URL ??
	import.meta.env.VITE_GIFTS_API_URL ??
	import.meta.env.VITE_TAGS_API_URL;

export const wishlistApiClient = new ApiClient(WISHLIST_API_BASE_URL);
wishlistApiClient.useRequestMiddleware(authHeaderMiddleware);
wishlistApiClient.useRequestMiddleware(localizationHeaderMiddleware);
wishlistApiClient.useResponseMiddleware(tokenRefreshMiddleware(`${AUTH_API_BASE_URL}/auth/refresh`));
