<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { create, forceRemove, getForEdit, getReservationStatus, list, remove, reserve, unreserve, update } from '$lib/api/gifts.js';
	import AddGiftCard from '$lib/modules/gifts/components/AddGiftCard.svelte';
	import GiftCard from '$lib/modules/gifts/components/GiftCard.svelte';
	import GiftForm, { type GiftFormData } from '$lib/modules/gifts/components/GiftForm.svelte';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import VirtualizedHorizontalList from '$lib/components/VirtualizedHorizontalList.svelte';
	import PaginationDots from '$lib/components/PaginationDots.svelte';
	import { m } from '$lib/paraglide/messages';
	import { auth } from '$lib/stores/auth.store';
	import type { Gift } from '$lib/types/wishlist';

	const ITEM_WIDTH = 300;
	const ITEM_HEIGHT = 500;
	const ITEM_GAP = 24;
	const PAGE_LIMIT = 9;

	let { data } = $props();
	const canCreateGift = auth.hasPermission('gift', 'create');
	const canViewGift = auth.hasPermission('gift', 'view');
	const canEditGift = auth.hasPermission('gift', 'edit');
	const canDeleteGift = auth.hasPermission('gift', 'delete');
	const canReserveGift = auth.hasPermission('gift-reservation', 'create');
	const canUnreserveGift = auth.hasPermission('gift-reservation', 'delete');

	let gifts = $state<Gift[]>(data.gifts);
	let nextCursor = $state<string | null>(data.giftsMeta.nextCursor);
	let hasNextPage = $state(data.giftsMeta.hasNextPage);
	let isLoadingMore = $state(false);

	$effect(() => {
		gifts = data.gifts;
		nextCursor = data.giftsMeta.nextCursor;
		hasNextPage = data.giftsMeta.hasNextPage;
	});

	type ListItem = { type: 'add' } | { type: 'gift'; gift: Gift };

	const listItems = $derived.by(() => {
		const items: ListItem[] = [];
		if ($canCreateGift) {
			items.push({ type: 'add' });
		}
		for (const gift of gifts) {
			items.push({ type: 'gift', gift });
		}
		return items;
	});

	let currentPage = $state(0);
	let totalPages = $state(1);
	let virtualizedList: { scrollToPage: (page: number) => Promise<void> } | null = $state(null);

	function handlePageChange(page: number, total: number) {
		currentPage = page;
		totalPages = total;
	}

	function handleDotClick(page: number) {
		virtualizedList?.scrollToPage(page);
	}

	async function loadMoreGifts() {
		if (isLoadingMore || !hasNextPage || !nextCursor) return;

		isLoadingMore = true;
		try {
			const response = await list({ cursor: nextCursor, limit: PAGE_LIMIT });
			gifts = [...gifts, ...response.data];
			nextCursor = response.meta.nextCursor;
			hasNextPage = response.meta.hasNextPage;
		} finally {
			isLoadingMore = false;
		}
	}

	let isGiftDialogOpen = $state(false);
	let giftDialogMode = $state<'create' | 'edit'>('create');
	let giftDialogSubmitting = $state(false);
	let giftDialogError = $state<string | null>(null);
	let giftDialogEditId = $state<string | null>(null);
	let giftDialogInitialData = $state<Partial<GiftFormData> | undefined>(undefined);
	const GIFT_DIALOG_FORM_ID = 'gift-dialog-form';

	// 'confirm'  – initial "are you sure?" dialog
	// 'reserved' – warning dialog shown after backend responds with GIFT_RESERVED
	let deleteDialogState = $state<'confirm' | 'reserved' | null>(null);
	let deleteGiftId = $state<string | null>(null);
	let deleteDialogSubmitting = $state(false);
	let deleteDialogError = $state<string | null>(null);

	async function createGift() {
		giftDialogMode = 'create';
		giftDialogEditId = null;
		giftDialogInitialData = undefined;
		giftDialogError = null;
		isGiftDialogOpen = true;
	}

	async function editGift(giftId: string) {
		const gift = await getForEdit(giftId);
		giftDialogMode = 'edit';
		giftDialogEditId = gift.id;
		giftDialogInitialData = {
			titleLocalized: gift.titleLocalized,
			descriptionLocalized: gift.descriptionLocalized,
			imageUrl: gift.imageUrl,
			link: gift.link,
			price: gift.price ?? undefined,
			claimable: gift.claimable,
			tagIds: gift.tagIds ?? []
		};
		giftDialogError = null;
		isGiftDialogOpen = true;
	}

	function closeGiftDialog() {
		if (giftDialogSubmitting) return;
		isGiftDialogOpen = false;
	}

	async function submitGiftDialog(formData: GiftFormData) {
		giftDialogError = null;
		giftDialogSubmitting = true;
		try {
			if (giftDialogMode === 'create') {
				await create(formData);
			} else if (giftDialogEditId) {
				await update(giftDialogEditId, formData);
			}

			isGiftDialogOpen = false;
			await invalidateAll();
		} catch {
			giftDialogError =
				giftDialogMode === 'create'
					? m.error_failed_create_gift()
					: m.error_failed_update_gift();
		} finally {
			giftDialogSubmitting = false;
		}
	}

	async function reserveGift(giftId: string) {
		await reserve(giftId);
		await invalidateAll();
	}

	async function unreserveGift(giftId: string) {
		await unreserve(giftId);
		await invalidateAll();
	}

	async function openDeleteDialog(giftId: string) {
		deleteGiftId = giftId;
		deleteDialogError = null;
		const { isReserved } = await getReservationStatus(giftId);
		deleteDialogState = isReserved ? 'reserved' : 'confirm';
	}

	function closeDeleteDialog() {
		if (deleteDialogSubmitting) return;
		deleteDialogState = null;
	}

	async function submitDeleteConfirm() {
		if (!deleteGiftId) return;
		deleteDialogError = null;
		deleteDialogSubmitting = true;
		try {
			await remove(deleteGiftId);
			deleteDialogState = null;
			await invalidateAll();
		} catch {
			deleteDialogError = m.error_failed_delete_gift();
		} finally {
			deleteDialogSubmitting = false;
		}
	}

	async function submitForceDelete() {
		if (!deleteGiftId) return;
		deleteDialogError = null;
		deleteDialogSubmitting = true;
		try {
			await forceRemove(deleteGiftId);
			deleteDialogState = null;
			await invalidateAll();
		} catch {
			deleteDialogError = m.error_failed_delete_gift();
		} finally {
			deleteDialogSubmitting = false;
		}
	}
</script>

{#if listItems.length === 0}
	<div class="flex items-center justify-center py-12">
		<p class="text-(--palette-fg-muted)">{m.gift_list_empty()}</p>
	</div>
{:else}
	<div class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
		<div class="h-[calc(100vh-calc(var(--spacing)*16)-calc(var(--spacing)*8)-calc(var(--spacing)*4)-calc(var(--spacing)*10)-calc(var(--spacing)*4)-calc(var(--spacing)*4)-calc(var(--spacing)*8))] min-h-[520px] flex items-center">
			<VirtualizedHorizontalList
				bind:this={virtualizedList}
				items={listItems}
				itemWidth={ITEM_WIDTH}
				itemHeight={ITEM_HEIGHT}
				gap={ITEM_GAP}
				onpagechange={handlePageChange}
				onnearend={loadMoreGifts}
			>
				{#snippet children(item, index)}
					{#if item.type === 'add'}
						<AddGiftCard onclick={createGift} />
					{:else}
						<GiftCard
							{...item.gift}
							canViewGift={$canViewGift}
							canEditGift={$canEditGift}
							canDeleteGift={$canDeleteGift}
							canReserveGift={$canReserveGift || $canUnreserveGift}
							onedit={editGift}
							onreserve={reserveGift}
							onunreserve={unreserveGift}
							ondelete={openDeleteDialog}
						/>
					{/if}
				{/snippet}
			</VirtualizedHorizontalList>
		</div>

		<PaginationDots {currentPage} {totalPages} onpageclick={handleDotClick} />
	</div>
{/if}

{#if isGiftDialogOpen}
	<Dialog onclose={closeGiftDialog}>
		{#snippet children()}
			<div class="w-full max-w-2xl">
				<h1 class="mb-4 text-2xl font-semibold text-(--palette-fg)">
					{giftDialogMode === 'create' ? m.gift_create_title() : m.gift_edit_title()}
				</h1>
				<GiftForm
					id={GIFT_DIALOG_FORM_ID}
					onsubmit={submitGiftDialog}
					initialData={giftDialogInitialData}
					availableTags={data.tags}
				/>
				{#if giftDialogError}
					<p class="mt-3 text-sm text-(--palette-danger)">{giftDialogError}</p>
				{/if}
			</div>
		{/snippet}

		{#snippet actions()}
			<Button form={GIFT_DIALOG_FORM_ID} type="submit" disabled={giftDialogSubmitting}>
				{giftDialogMode === 'create' ? m.common_create() : m.common_save()}
			</Button>
			<Button skin="text" type="button" disabled={giftDialogSubmitting} onclick={closeGiftDialog}>
				{m.common_cancel()}
			</Button>
		{/snippet}
	</Dialog>
{/if}

{#if deleteDialogState === 'confirm'}
	<Dialog onclose={closeDeleteDialog}>
		{#snippet children()}
			<div class="w-full">
				<h1 class="mb-4 text-2xl font-semibold text-(--palette-fg)">{m.gift_delete_title()}</h1>
				<p class="text-(--palette-fg-muted)">{m.gift_delete_confirm_message()}</p>
				{#if deleteDialogError}
					<p class="mt-3 text-sm text-(--palette-danger)">{deleteDialogError}</p>
				{/if}
			</div>
		{/snippet}

		{#snippet actions()}
			<Button skin="danger" type="button" disabled={deleteDialogSubmitting} onclick={submitDeleteConfirm}>
				{m.gift_action_delete()}
			</Button>
			<Button skin="text" type="button" disabled={deleteDialogSubmitting} onclick={closeDeleteDialog}>
				{m.common_cancel()}
			</Button>
		{/snippet}
	</Dialog>
{/if}

{#if deleteDialogState === 'reserved'}
	<Dialog onclose={closeDeleteDialog}>
		{#snippet children()}
			<div class="w-full">
				<h1 class="mb-4 text-2xl font-semibold text-(--palette-fg)">{m.gift_delete_reserved_title()}</h1>
				<div class="rounded-(--palette-radius) border-l-4 border-(--palette-sand) bg-(--palette-sand-tint) p-4 text-(--palette-sand-fg)">
					{m.gift_delete_reserved_message()}
				</div>
				{#if deleteDialogError}
					<p class="mt-3 text-sm text-(--palette-danger)">{deleteDialogError}</p>
				{/if}
			</div>
		{/snippet}

		{#snippet actions()}
			<Button skin="danger" type="button" disabled={deleteDialogSubmitting} onclick={submitForceDelete}>
				{m.gift_action_delete()}
			</Button>
			<Button skin="text" type="button" disabled={deleteDialogSubmitting} onclick={closeDeleteDialog}>
				{m.common_cancel()}
			</Button>
		{/snippet}
	</Dialog>
{/if}
