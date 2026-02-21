<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dialog from './Dialog.svelte';

	const { Story } = defineMeta({
		title: 'Core/Dialog',
		component: Dialog,
		tags: ['autodocs']
	});
</script>

{#snippet content()}
	<h3>Delete gift</h3>
	<p>Are you sure you want to delete this gift? This action cannot be undone.</p>
{/snippet}

{#snippet actions()}
	<button
		type="button"
		class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
	>
		Cancel
	</button>
	<button
		type="button"
		class="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white"
	>
		Delete
	</button>
{/snippet}

<Story
	name="Default"
	args={{
		children: content
	}}
/>

<Story
	name="With actions"
	args={{
		children: content,
		actions
	}}
/>

