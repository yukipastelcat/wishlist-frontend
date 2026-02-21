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
	<div class="inline-flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1">
		{#each tabs as tab}
			<button
				type="button"
				role="tab"
				aria-selected={activeTabId === tab.id}
				class={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
					activeTabId === tab.id
						? 'bg-white text-slate-900 shadow-sm'
						: 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
				}`}
				onclick={() => selectTab(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
</div>
