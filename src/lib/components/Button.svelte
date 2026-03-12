<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	const {
		skin = 'primary',
		type = 'button',
		children,
		...rest
	} = $props<
		{
			skin?: 'primary' | 'text' | 'outlined' | 'cta' | 'danger';
			type?: 'button' | 'submit' | 'reset' | 'link';
			form?: string;
			children?: () => any;
		} | HTMLButtonAttributes | HTMLAnchorAttributes
	>();

	const classList = $derived.by(() => {
		switch (skin) {
			case 'text':
				return 'bg-transparent text-sky-600 hover:text-sky-700 hover:bg-sky-50 active:bg-sky-100 active:text-sky-800';
			case 'outlined':
				return 'bg-transparent border border-sky-700 text-sky-700 hover:bg-sky-50 hover:border-sky-800 active:bg-sky-100';
			case 'cta':
				return 'bg-(--palette-cta) text-white hover:bg-(--palette-cta-hover) active:bg-(--palette-cta-active)';
			case 'danger':
				return 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white';
			case 'contained':
			default:
				return 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white';
		}
	});
</script>

{#if type === 'link'}
	<a
		{...rest}
		class={`${classList} ${rest.class} inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0,0,0,1)]`}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{...rest}
		class={`${classList} ${rest.class} inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0,0,0,1)] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
	>
		{@render children?.()}
	</button>
{/if}
