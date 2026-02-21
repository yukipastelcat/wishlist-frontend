import { wishlistApiClient as giftsApiClient } from "./wishlist";
import type {
	CursorPaginatedResponse,
	Gift,
	GiftEditPayload,
	GiftWriteDto,
	ListGiftsQuery
} from '$lib/types/wishlist';
export type {
	CursorPaginatedResponse,
	Gift,
	GiftEditPayload,
	GiftWriteDto,
	ListGiftsQuery
} from '$lib/types/wishlist';

function toQueryString(
	query?: Record<string, string | number | Array<string | number> | undefined>
) {
	if (!query) return '';

	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			for (const item of value) {
				params.append(key, String(item));
			}
			return;
		}

		params.set(key, String(value));
	});

	const qs = params.toString();
	return qs ? `?${qs}` : '';
}

export async function list(query?: ListGiftsQuery) {
	return giftsApiClient.request<CursorPaginatedResponse<Gift>>(`/gifts${toQueryString(query)}`);
}

export async function getById(id: string) {
	return giftsApiClient.request<Gift>(`/gifts/${id}`);
}

export async function getForEdit(id: string) {
	return giftsApiClient.request<GiftEditPayload>(`/gifts/${id}/edit-data`);
}

export async function create(data: GiftWriteDto) {
	return giftsApiClient.request<Gift>('/gifts', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function update(id: string, data: Partial<GiftWriteDto>) {
	return giftsApiClient.request<Gift>(`/gifts/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
}

export async function remove(id: string) {
	return giftsApiClient.request<Gift>(`/gifts/${id}`, {
		method: 'DELETE',
	});
}

export async function reserve(id: string) {
	return giftsApiClient.request<Gift>(`/gifts/${id}/reserve`, {
		method: 'POST',
	});
}

export async function unreserve(id: string) {
	return giftsApiClient.request<Gift>(`/gifts/${id}/unreserve`, {
		method: 'POST',
	});
}

// Backward-compatible aliases
export const claim = reserve;
export const unclaim = unreserve;
