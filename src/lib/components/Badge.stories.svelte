<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './Badge.svelte';

	const { Story } = defineMeta({
		title: 'Core/Badge',
		component: Badge,
		tags: ['autodocs']
	});
</script>

<Story
	name="Neutral"
	args={{
		skin: 'neutral',
		label: 'Neutral'
	}}
/>

<Story
	name="Success"
	args={{
		skin: 'success',
		label: 'Success'
	}}
/>

<Story
	name="Warning"
	args={{
		skin: 'warning',
		label: 'Warning'
	}}
/>

<Story
	name="Danger"
	args={{
		skin: 'danger',
		label: 'Danger'
	}}
/>

<Story
	name="Info"
	args={{
		skin: 'info',
		label: 'Info'
	}}
/>

{#snippet children()}
	<strong>Custom slot</strong>
{/snippet}

<Story
	name="With slot content"
	args={{
		skin: 'neutral',
		children
	}}
/>

