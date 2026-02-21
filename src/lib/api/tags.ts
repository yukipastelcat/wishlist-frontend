import { wishlistApiClient as tagsApiClient } from "./wishlist";
import type {
	CursorPaginatedResponse,
	ListTagsQuery,
	Tag,
	TagWriteDto
} from '$lib/types/wishlist';
export type {
	CursorPaginatedResponse,
	ListTagsQuery,
	Tag,
	TagWriteDto
} from '$lib/types/wishlist';

function toQueryString(query?: Record<string, string | number | undefined>) {
	if (!query) return '';

	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		params.set(key, String(value));
	});

	const qs = params.toString();
	return qs ? `?${qs}` : '';
}

export async function list(query?: ListTagsQuery) {
	return tagsApiClient.request<CursorPaginatedResponse<Tag>>(`/tags${toQueryString(query)}`);
}

export async function create(data: TagWriteDto) {
	return tagsApiClient.request<Tag>('/tags', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function update(id: string, data: Partial<TagWriteDto>) {
	return tagsApiClient.request<Tag>(`/tags/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
}

export async function remove(id: string) {
	return tagsApiClient.request<Tag>(`/tags/${id}`, {
		method: 'DELETE',
	});
}
