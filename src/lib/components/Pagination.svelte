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
			class="inline-flex items-center rounded-(--palette-radius) border border-(--palette-border) bg-(--palette-card) px-3 py-2 text-sm font-medium text-(--palette-fg-muted) transition-colors hover:bg-(--palette-bg-hover)"
			href={previousHref}
		>
			{m.pagination_previous()}
		</a>
	{:else}
		<span
			class="inline-flex cursor-not-allowed items-center rounded-(--palette-radius) border border-(--palette-disabled-border) bg-(--palette-disabled-bg) px-3 py-2 text-sm font-medium text-(--palette-disabled-text)"
		>
			{m.pagination_previous()}
		</span>
	{/if}

	<span class="text-sm font-medium text-(--palette-fg-muted)">{m.pagination_page({ page })}</span>

	{#if hasNextPage && nextHref}
		<a
			class="inline-flex items-center rounded-(--palette-radius) border border-(--palette-border) bg-(--palette-card) px-3 py-2 text-sm font-medium text-(--palette-fg-muted) transition-colors hover:bg-(--palette-bg-hover)"
			href={nextHref}
		>
			{m.pagination_next()}
		</a>
	{:else}
		<span
			class="inline-flex cursor-not-allowed items-center rounded-(--palette-radius) border border-(--palette-disabled-border) bg-(--palette-disabled-bg) px-3 py-2 text-sm font-medium text-(--palette-disabled-text)"
		>
			{m.pagination_next()}
		</span>
	{/if}
</nav>
