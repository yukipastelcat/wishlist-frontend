<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	const {
		skin = 'neutral',
		label,
		children,
		...rest
	} = $props<
		{
			skin?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
			label?: string;
			children?: () => any;
		} & HTMLAttributes<HTMLSpanElement>
	>();

	const classList = $derived.by(() => {
		switch (skin) {
			case 'success':
				return 'bg-(--palette-accent-tint) text-(--palette-accent-tint-fg)';
			case 'warning':
				return 'bg-(--palette-sand-tint) text-(--palette-sand-fg)';
			case 'danger':
				return 'bg-(--palette-blossom-tint) text-(--palette-blossom-fg)';
			case 'info':
				return 'bg-(--palette-sky-tint) text-(--palette-sky-fg)';
			case 'neutral':
			default:
				return 'bg-(--palette-bg-hover) text-(--palette-fg-muted)';
		}
	});
</script>

<span
	{...rest}
	class={`${classList} ${rest.class ?? ''} inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium`}
>
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</span>
