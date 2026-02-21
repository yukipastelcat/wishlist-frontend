<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Pagination from './Pagination.svelte';

	const { Story } = defineMeta({
		title: 'Core/Pagination',
		component: Pagination,
		tags: ['autodocs']
	});
</script>

<Story
	name="Middle page"
	args={{
		page: 3,
		hasPreviousPage: true,
		hasNextPage: true,
		previousHref: '/?cursor=prev',
		nextHref: '/?cursor=next'
	}}
/>

<Story
	name="First page"
	args={{
		page: 1,
		hasPreviousPage: false,
		hasNextPage: true,
		nextHref: '/?cursor=next'
	}}
/>

<Story
	name="Last page"
	args={{
		page: 5,
		hasPreviousPage: true,
		hasNextPage: false,
		previousHref: '/?cursor=prev'
	}}
/>

