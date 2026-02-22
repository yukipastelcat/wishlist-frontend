import {
	authHeaderMiddleware,
	localizationHeaderMiddleware,
	tokenRefreshMiddleware
} from './auth.middleware';
import { ApiClient } from './client';
import { PUBLIC_AUTH_API_URL, PUBLIC_GIFTS_API_URL } from '$env/static/public';

const AUTH_API_BASE_URL = PUBLIC_AUTH_API_URL;
const WISHLIST_API_BASE_URL = PUBLIC_GIFTS_API_URL;

export const wishlistApiClient = new ApiClient(WISHLIST_API_BASE_URL);
wishlistApiClient.useRequestMiddleware(authHeaderMiddleware);
wishlistApiClient.useRequestMiddleware(localizationHeaderMiddleware);
wishlistApiClient.useResponseMiddleware(tokenRefreshMiddleware(`${AUTH_API_BASE_URL}/auth/refresh`));
