<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import EditorJsInput from './EditorJsInput.svelte';

	const { Story } = defineMeta({
		title: 'Core/EditorJSInput',
		component: EditorJsInput,
		tags: ['autodocs']
	});

	const prefilledValue = {
		version: '2.29.1',
		blocks: [
			{
				type: 'paragraph',
				data: {
					text: 'Start editing this rich description.'
				}
			}
		]
	};
</script>

<Story
	name="Empty"
	args={{
		placeholder: 'Write gift description...',
		class: 'min-h-36'
	}}
/>

<Story
	name="Prefilled"
	args={{
		value: prefilledValue,
		class: 'min-h-36'
	}}
/>
