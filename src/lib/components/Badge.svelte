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
				return 'bg-emerald-100 text-emerald-800';
			case 'warning':
				return 'bg-amber-100 text-amber-800';
			case 'danger':
				return 'bg-rose-100 text-rose-800';
			case 'info':
				return 'bg-sky-100 text-sky-800';
			case 'neutral':
			default:
				return 'bg-slate-100 text-slate-700';
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
