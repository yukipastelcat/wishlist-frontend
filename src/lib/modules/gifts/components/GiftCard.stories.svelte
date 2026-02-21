<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import GiftCard from './GiftCard.svelte';

	const { Story } = defineMeta({
		title: 'Gifts/GiftCard',
		component: GiftCard,
		tags: ['autodocs']
	});
</script>

<Story
	name="Guest mode"
	args={{
		title: 'Gift Name',
		description: 'A beautiful gift for any occasion',
		imageUrl: 'https://placehold.co/400x300',
		link: 'https://example.com/gift',
		price: {
			amount: '49.99',
			currency: 'USD'
		},
		canEditGift: false,
		canViewGift: false,
		canReserveGift: false
	}}
/>

<Story
	name="Admin mode"
	args={{
		title: 'Gift Name',
		description: 'A beautiful gift for any occasion',
		imageUrl: 'https://placehold.co/400x300',
		link: 'https://example.com/gift',
		price: {
			amount: '49.99',
			currency: 'USD'
		},
		canEditGift: true,
		canViewGift: true,
		canReserveGift: false
	}}
/>

<Story
	name="User mode"
	args={{
		title: 'Gift Name',
		description: 'A beautiful gift for any occasion',
		imageUrl: 'https://placehold.co/400x300',
		link: 'https://example.com/gift',
		claimable: true,
		price: {
			amount: '49.99',
			currency: 'USD'
		},
		canEditGift: false,
		canViewGift: true,
		canReserveGift: true
	}}
/>