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
				return 'bg-transparent text-(--palette-fg-muted) hover:text-(--palette-fg) hover:bg-(--palette-bg-hover) active:bg-(--palette-bg-active)';
			case 'outlined':
				return 'bg-transparent border border-(--palette-accent) text-(--palette-accent-dark) hover:bg-(--palette-accent-tint) hover:border-(--palette-accent-hover) active:bg-(--palette-accent-tint)';
			case 'cta':
				return 'bg-(--palette-cta) text-(--palette-fg-on-dark) hover:bg-(--palette-cta-hover) active:bg-(--palette-cta-active)';
			case 'danger':
				return 'bg-(--palette-danger) hover:bg-(--palette-danger-hover) active:bg-(--palette-danger-hover) text-(--palette-fg-on-dark)';
			case 'contained':
			default:
				return 'bg-(--palette-accent) hover:bg-(--palette-accent-hover) active:bg-(--palette-accent-dark) text-(--palette-fg-on-dark)';
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
