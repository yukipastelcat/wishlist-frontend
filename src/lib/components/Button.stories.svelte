<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Core/Button',
		component: Button,
		tags: ['autodocs']
	});
</script>

{#snippet children()}
  <span>Button Text</span>
{/snippet}

<Story
	name="Call to Action"
	args={{
		skin: 'cta',
        children
	}}
/>

<Story
	name="Contained"
	args={{
		skin: 'contained',
        children
	}}
/>

<Story
	name="Outlined"
	args={{
		skin: 'outlined',
		children
	}}
/>

<Story
	name="Text"
	args={{
		skin: 'text',
        children
	}}
/>

<Story
	name="As link"
	args={{
		skin: 'text',
		type: 'link',
		href: 'https://www.example.com',
        children
	}}
/>