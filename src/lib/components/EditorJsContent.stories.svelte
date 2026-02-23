<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import EditorJsContent from './EditorJsContent.svelte';

	const { Story } = defineMeta({
		title: 'Core/EditorJSContent',
		component: EditorJsContent,
		tags: ['autodocs']
	});

	const paragraphDoc = {
		version: '2.29.1',
		blocks: [
			{
				type: 'paragraph',
				data: {
					text: 'A rich description rendered from Editor.js blocks.'
				}
			}
		]
	};

	const mixedDoc = {
		version: '2.29.1',
		blocks: [
			{
				type: 'header',
				data: {
					text: 'Gift details'
				}
			},
			{
				type: 'paragraph',
				data: {
					text: 'Includes supported block rendering for paragraphs, headers, and lists.'
				}
			},
			{
				type: 'list',
				data: {
					items: ['Handmade', 'Limited edition', 'Ships worldwide'],
					style: 'unordered'
				}
			}
		]
	};
</script>

<Story
	name="Paragraph"
	args={{
		document: paragraphDoc
	}}
/>

<Story
	name="Mixed blocks"
	args={{
		document: mixedDoc
	}}
/>
