import { getById } from '$lib/api/gifts';

export const ssr = false;

export const load = async ({ params }) => {
	const gift = await getById(params.id);

	return {
		gift
	};
};
