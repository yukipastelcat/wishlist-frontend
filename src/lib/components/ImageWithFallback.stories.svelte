<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ImageWithFallback from './ImageWithFallback.svelte';

	const { Story } = defineMeta({
		title: 'Core/ImageWithFallback',
		component: ImageWithFallback,
		tags: ['autodocs']
	});
</script>

<Story
	name="Valid image"
	args={{
		src: 'https://placehold.co/600x400/png',
		alt: 'Placeholder image',
		class: 'h-48 w-72 rounded-xl object-cover border border-slate-200'
	}}
/>

<Story
	name="Fallback on error"
	args={{
		src: 'https://example.com/this-image-does-not-exist.png',
		alt: 'Broken image',
		class: 'h-48 w-72 rounded-xl object-cover border border-slate-200'
	}}
/>

<Story
	name="Eager loading"
	args={{
		src: 'https://placehold.co/1200x800/jpg',
		alt: 'Large image',
		loading: 'eager',
		class: 'h-56 w-80 rounded-xl object-cover border border-slate-200'
	}}
/>

