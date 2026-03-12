<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type TabItem = {
		id: string;
		label: string;
	};

	const {
		tabs,
		activeTabId,
		onchange,
		class: className,
		...rest
	} = $props<{
		tabs: TabItem[];
		activeTabId: string;
		onchange?: (tabId: string) => void;
	} & Omit<HTMLAttributes<HTMLDivElement>, 'onchange'>>();

	function selectTab(tabId: string) {
		onchange?.(tabId);
	}
</script>

<div class={className} {...rest}>
	<div class="inline-flex flex-wrap items-center gap-1 rounded-(--palette-radius) bg-(--palette-bg-hover) p-1">
		{#each tabs as tab}
			<button
				type="button"
				role="tab"
				aria-selected={activeTabId === tab.id}
				class={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
					activeTabId === tab.id
						? 'bg-(--palette-card) text-(--palette-fg) shadow-sm'
						: 'text-(--palette-fg-muted) hover:bg-(--palette-bg-active) hover:text-(--palette-fg)'
				}`}
				onclick={() => selectTab(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
</div>
