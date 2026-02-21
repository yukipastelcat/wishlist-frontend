<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AddGiftCard from './AddGiftCard.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Gifts/AddGiftCard',
		component: AddGiftCard,
		tags: ['autodocs']
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
	name="Default"
/>