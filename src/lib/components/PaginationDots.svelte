<script lang="ts">
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

	type Props = {
		currentPage: number;
		totalPages: number;
		maxDots?: number;
		onpageclick?: (page: number) => void;
	};

	let {
		currentPage,
		totalPages,
		maxDots = 7,
		onpageclick
	}: Props = $props();

	const hasPrevious = $derived(currentPage > 0);
	const hasNext = $derived(currentPage < totalPages - 1);

	const visibleDots = $derived.by(() => {
		if (totalPages <= maxDots) {
			return Array.from({ length: totalPages }, (_, i) => i);
		}

		const halfVisible = Math.floor(maxDots / 2);
		let start = currentPage - halfVisible;
		let end = currentPage + halfVisible;

		if (start < 0) {
			start = 0;
			end = maxDots - 1;
		}

		if (end >= totalPages) {
			end = totalPages - 1;
			start = totalPages - maxDots;
		}

		return Array.from({ length: maxDots }, (_, i) => start + i);
	});

	function handleClick(page: number) {
		onpageclick?.(page);
	}

	function handlePrevious() {
		if (hasPrevious) {
			onpageclick?.(currentPage - 1);
		}
	}

	function handleNext() {
		if (hasNext) {
			onpageclick?.(currentPage + 1);
		}
	}
</script>

{#if totalPages > 1}
	<nav class="flex items-center justify-center gap-4 py-4" aria-label="Pagination">
		<button
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--palette-accent) focus:ring-offset-2 {hasPrevious
				? 'bg-(--palette-card) hover:bg-(--palette-bg-hover) text-(--palette-fg) cursor-pointer shadow-sm border border-(--palette-border)'
				: 'bg-(--palette-disabled-bg) text-(--palette-disabled-text) cursor-not-allowed'}"
			aria-label="Previous page"
			disabled={!hasPrevious}
			onclick={handlePrevious}
		>
			<FontAwesomeIcon icon={faChevronLeft as any} class="text-sm" />
		</button>

		<div class="flex items-center gap-2">
			{#each visibleDots as page (page)}
				<button
					type="button"
					class="h-3 w-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--palette-accent) focus:ring-offset-2 {page === currentPage
						? 'bg-(--palette-accent) scale-125'
						: 'bg-(--palette-border) hover:bg-(--palette-fg-muted) cursor-pointer'}"
					aria-label="Go to page {page + 1}"
					aria-current={page === currentPage ? 'page' : undefined}
					onclick={() => handleClick(page)}
				></button>
			{/each}
		</div>

		<button
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--palette-accent) focus:ring-offset-2 {hasNext
				? 'bg-(--palette-card) hover:bg-(--palette-bg-hover) text-(--palette-fg) cursor-pointer shadow-sm border border-(--palette-border)'
				: 'bg-(--palette-disabled-bg) text-(--palette-disabled-text) cursor-not-allowed'}"
			aria-label="Next page"
			disabled={!hasNext}
			onclick={handleNext}
		>
			<FontAwesomeIcon icon={faChevronRight as any} class="text-sm" />
		</button>
	</nav>
{/if}
