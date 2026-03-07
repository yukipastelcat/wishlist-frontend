export const ssr = false;

export const load = ({ url }) => ({
	giftId: url.searchParams.get('giftId') ?? ''
});
