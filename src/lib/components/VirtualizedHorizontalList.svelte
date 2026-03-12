<script lang="ts" generics="T">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		items: T[];
		itemWidth: number;
		itemHeight: number;
		gap?: number;
		bufferCount?: number;
		loadMoreThreshold?: number;
		onpagechange?: (page: number, totalPages: number) => void;
		onnearend?: () => void;
		children: Snippet<[T, number]>;
	};

	let {
		items,
		itemWidth,
		itemHeight,
		gap = 16,
		bufferCount = 2,
		loadMoreThreshold = 2,
		onpagechange,
		onnearend,
		children
	}: Props = $props();

	let containerRef: HTMLDivElement | null = $state(null);
	let scrollRef: HTMLDivElement | null = $state(null);
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let scrollLeft = $state(0);

	const rowCount = $derived(Math.max(1, Math.floor((containerHeight + gap) / (itemHeight + gap))));
	const itemsPerPage = $derived(Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap))) * rowCount);
	const columnsPerPage = $derived(Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap))));
	const pageWidth = $derived(columnsPerPage * (itemWidth + gap));
	const totalPages = $derived(Math.ceil(items.length / itemsPerPage));
	const currentPage = $derived.by(() => {
		if (pageWidth <= 0 || columnsPerPage <= 0) return 0;
		const currentColumn = Math.round(scrollLeft / (itemWidth + gap));
		return Math.floor(currentColumn / columnsPerPage);
	});

	const totalColumns = $derived(Math.ceil(items.length / rowCount));
	const totalContentWidth = $derived(totalColumns * (itemWidth + gap) - gap);

	const visibleStartColumn = $derived(Math.max(0, Math.floor(scrollLeft / (itemWidth + gap)) - bufferCount));
	const visibleEndColumn = $derived(Math.min(totalColumns, Math.ceil((scrollLeft + containerWidth) / (itemWidth + gap)) + bufferCount));

	const visibleItems = $derived.by(() => {
		const result: { item: T; index: number; column: number; row: number }[] = [];
		for (let col = visibleStartColumn; col < visibleEndColumn; col++) {
			for (let row = 0; row < rowCount; row++) {
				const index = col * rowCount + row;
				if (index < items.length) {
					result.push({ item: items[index], index, column: col, row });
				}
			}
		}
		return result;
	});

	let previousPage = $state(0);

	function handleScroll() {
		if (scrollRef) {
			scrollLeft = scrollRef.scrollLeft;
		}
	}

	$effect(() => {
		if (currentPage < previousPage) {
			lastNearEndTrigger = -1;
		}
		previousPage = currentPage;
	});

	function updateDimensions() {
		if (containerRef) {
			containerWidth = containerRef.clientWidth;
			containerHeight = containerRef.clientHeight;
		}
	}

	const isNearEnd = $derived(totalPages > 0 && currentPage >= totalPages - loadMoreThreshold);
	let lastNearEndTrigger = $state(-1);

	$effect(() => {
		onpagechange?.(currentPage, totalPages);
	});

	$effect(() => {
		if (isNearEnd && items.length > 0 && lastNearEndTrigger !== items.length) {
			lastNearEndTrigger = items.length;
			onnearend?.();
		}
	});

	onMount(() => {
		updateDimensions();

		const resizeObserver = new ResizeObserver(() => {
			updateDimensions();
		});

		if (containerRef) {
			resizeObserver.observe(containerRef);
		}

		return () => {
			resizeObserver.disconnect();
		};
	});

	export async function scrollToPage(page: number) {
		await tick();
		if (scrollRef && pageWidth > 0 && columnsPerPage > 0) {
			const clampedPage = Math.max(0, Math.min(page, Math.max(0, totalPages - 1)));
			const targetColumn = clampedPage * columnsPerPage;
			const targetScroll = targetColumn * (itemWidth + gap);
			lastNearEndTrigger = -1;
			scrollRef.scrollTo({ left: targetScroll, behavior: 'smooth' });
		}
	}
</script>

<div
	bind:this={containerRef}
	class="relative h-full w-full overflow-hidden"
>
	<div
		bind:this={scrollRef}
		class="h-full w-full overflow-x-auto overflow-y-hidden hide-scrollbar flex items-center"
		style="scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch;"
		onscroll={handleScroll}
	>
		<div
			class="relative flex-shrink-0"
			style="width: {totalContentWidth}px; height: {rowCount * (itemHeight + gap) - gap}px;"
		>
			{#each visibleItems as { item, index, column, row } (index)}
				<div
					class="absolute scroll-snap-start"
					style="
						left: {column * (itemWidth + gap)}px;
						top: {row * (itemHeight + gap)}px;
						width: {itemWidth}px;
						height: {itemHeight}px;
						scroll-snap-align: {column % columnsPerPage === 0 ? 'start' : 'none'};
					"
				>
					{@render children(item, index)}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.scroll-snap-x-mandatory {
		scroll-snap-type: x mandatory;
	}
	.scroll-snap-start {
		scroll-snap-align: start;
	}
	.hide-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
