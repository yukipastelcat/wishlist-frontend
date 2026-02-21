<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	type PaginationProps = {
		page: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
		previousHref?: string;
		nextHref?: string;
	};

	let {
		page,
		hasPreviousPage,
		hasNextPage,
		previousHref,
		nextHref
	}: PaginationProps = $props();
</script>

<nav class="mt-6 flex items-center justify-center gap-3" aria-label="Pagination">
	{#if hasPreviousPage && previousHref}
		<a
			class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
			href={previousHref}
		>
			{m.pagination_previous()}
		</a>
	{:else}
		<span
			class="inline-flex cursor-not-allowed items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400"
		>
			{m.pagination_previous()}
		</span>
	{/if}

	<span class="text-sm font-medium text-slate-600">{m.pagination_page({ page })}</span>

	{#if hasNextPage && nextHref}
		<a
			class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
			href={nextHref}
		>
			{m.pagination_next()}
		</a>
	{:else}
		<span
			class="inline-flex cursor-not-allowed items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400"
		>
			{m.pagination_next()}
		</span>
	{/if}
</nav>
