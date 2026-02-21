import { list } from "$lib/api/gifts";
import { list as listTags } from '$lib/api/tags';

export const ssr = false;

const PAGE_LIMIT = 9;

export const load = async ({ url }) => {
	const currentCursor = url.searchParams.get('cursor') ?? undefined;
	const rawHistory = url.searchParams.get('history');
	const cursorHistory = rawHistory === null ? [] : rawHistory.split(',');

	const [giftsPage, tagsPage] = await Promise.all([
		list({
			cursor: currentCursor,
			limit: PAGE_LIMIT
		}),
		listTags({ limit: 100 })
	]);

	return {
		gifts: giftsPage.data,
		giftsMeta: giftsPage.meta,
		tags: tagsPage.data,
		pagination: {
			pathname: url.pathname,
			currentCursor,
			cursorHistory,
			page: cursorHistory.length + 1
		}
	};
};
