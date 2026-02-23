import type { EditorJsDocument } from '$lib/types/editor';

export type CursorPaginatedResponse<T> = {
	data: T[];
	meta: {
		nextCursor: string | null;
		hasNextPage: boolean;
	};
};

export type LocalizedTextMap = Record<string, string>;

export type Tag = {
	id: string;
	createdAt: string;
	title: string;
	color: string;
};

export type GiftPrice = {
	amount: number;
	currency: string;
};

export type Gift = {
	id: string;
	createdAt: string;
	title: string;
	description?: EditorJsDocument;
	imageUrl?: string;
	link?: string;
	price?: GiftPrice | null;
	claimable: boolean;
	isReserved?: boolean;
	isReservedByMe?: boolean;
	tags?: Tag[];
};

export type GiftEditPayload = {
	id: string;
	createdAt: string;
	titleLocalized: LocalizedTextMap;
	descriptionLocalized?: Record<string, EditorJsDocument>;
	imageUrl?: string;
	link?: string;
	price?: GiftPrice | null;
	claimable: boolean;
	tagIds: string[];
};

export type ListGiftsQuery = {
	cursor?: string;
	limit?: number;
	search?: string;
	minPrice?: number;
	maxPrice?: number;
	// Reserved for upcoming multiselect tags filter support.
	tagIds?: string[];
};

export type ListTagsQuery = {
	cursor?: string;
	limit?: number;
};

export type GiftWriteDto = {
	titleLocalized: LocalizedTextMap;
	descriptionLocalized?: Record<string, EditorJsDocument>;
	imageUrl?: string;
	link?: string;
	price?: GiftPrice;
	claimable?: boolean;
	tagIds?: string[];
};

export type TagWriteDto = {
	titleLocalized: LocalizedTextMap;
	color: string;
};
