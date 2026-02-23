<script lang="ts">
	import { goto } from '$app/navigation';
	import { getForEdit, reserve, unreserve, update } from '$lib/api/gifts';
	import { list as listTags } from '$lib/api/tags';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import EditorJsContent from '$lib/components/EditorJsContent.svelte';
	import ImageWithFallback from '$lib/components/ImageWithFallback.svelte';
	import GiftForm, { type GiftFormData } from '$lib/modules/gifts/components/GiftForm.svelte';
	import { m } from '$lib/paraglide/messages';
	import { auth } from '$lib/stores/auth.store';
	import type { Gift } from '$lib/types/wishlist';
	import { useAsyncAction } from '$lib/utils/action';
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import {
		faEdit as fasEdit,
		faArrowLeft as fasArrowLeft,
		faExternalLink as fasExternalLink
	} from '@fortawesome/free-solid-svg-icons';

	let { data } = $props();
	let gift = $state<Gift>({} as Gift);
	let isEditDialogOpen = $state(false);
	let editDialogSubmitting = $state(false);
	let editDialogError = $state<string | null>(null);
	let editDialogInitialData = $state<Partial<GiftFormData> | undefined>(undefined);
	let editDialogTags = $state<Array<{ id: string; title: string; color?: string }>>([]);
	const EDIT_DIALOG_FORM_ID = 'gift-view-edit-form';

	const canEditGift = auth.hasPermission('gift', 'edit');
	const canReserveGift = auth.hasPermission('gift-reservation', 'create');
	const canUnreserveGift = auth.hasPermission('gift-reservation', 'delete');
	const {
		action: reserveGift,
		pending: reservePending,
		error: reserveError
	} = useAsyncAction(
		async () => {
			gift = await reserve(gift.id);
		},
		{ errorMessage: m.error_failed_reserve_gift() }
	);

	const {
		action: unreserveGift,
		pending: unreservePending,
		error: unreserveError
	} = useAsyncAction(
		async () => {
			gift = await unreserve(gift.id);
		},
		{ errorMessage: m.error_failed_unreserve_gift() }
	);

	$effect(() => {
		gift = data.gift;
	});

	async function openEditDialog() {
		const [editPayload, tagsPage] = await Promise.all([
			getForEdit(gift.id),
			listTags({ limit: 100 })
		]);

		editDialogInitialData = {
			titleLocalized: editPayload.titleLocalized,
			descriptionLocalized: editPayload.descriptionLocalized,
			imageUrl: editPayload.imageUrl,
			link: editPayload.link,
			price: editPayload.price ?? undefined,
			claimable: editPayload.claimable,
			tagIds: editPayload.tagIds ?? []
		};
		editDialogTags = tagsPage.data;
		editDialogError = null;
		isEditDialogOpen = true;
	}

	function closeEditDialog() {
		if (editDialogSubmitting) return;
		isEditDialogOpen = false;
	}

	async function submitEditDialog(formData: GiftFormData) {
		editDialogError = null;
		editDialogSubmitting = true;
		try {
			gift = await update(gift.id, formData);
			isEditDialogOpen = false;
		} catch {
			editDialogError = m.error_failed_update_gift();
		} finally {
			editDialogSubmitting = false;
		}
	}
</script>

<div class="flex items-center justify-between">
	<nav>
		<Button type="link" href="/" skin="text">
			<FontAwesomeIcon icon={fasArrowLeft as any} />
			<span>
				{m.common_back()}
			</span>
		</Button>
	</nav>
	<menu>
		{#if $canEditGift}
			<Button type="button" skin="text" onclick={openEditDialog}>
				<FontAwesomeIcon icon={fasEdit as any} />
				<span>{m.gift_action_edit()}</span>
			</Button>
		{/if}
	</menu>
</div>
<div class="mt-2 rounded-2xl bg-white p-6 shadow-sm">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="overflow-hidden rounded-xl bg-slate-100">
			<ImageWithFallback
				src={gift.imageUrl ?? ''}
				alt={gift.title}
				class="h-full w-full object-cover"
			/>
		</div>

		<div class="flex flex-col space-y-4">
			<h1 class="text-2xl font-semibold text-slate-900">{gift.title}</h1>
			{#if gift.description}
				<EditorJsContent document={gift.description} />
			{/if}

			<div class="mt-auto flex items-center justify-between">
				{#if gift.price}
					<span class="text-lg font-semibold text-slate-900">
						~{gift.price.amount}
						{gift.price.currency}
					</span>
				{/if}
				{#if gift.link}
					<Button
						type="link"
						skin="text"
						href={gift.link}
						target="_blank"
						rel="noopener noreferrer"
					>
						<span>
							{m.gift_open_link()}
						</span>
						<FontAwesomeIcon icon={fasExternalLink as any} />
					</Button>
				{/if}
			</div>

			{#if gift.tags?.length}
				<div class="flex flex-wrap gap-2">
					{#each gift.tags as tag}
						<span
							class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-slate-700"
						>
							<span class="inline-block h-2.5 w-2.5 rounded-full" style={`background:${tag.color};`}
							></span>
							{tag.title}
						</span>
					{/each}
				</div>
			{/if}

			<menu class="flex flex-col gap-2">
				{#if $canUnreserveGift && gift.isReservedByMe}
					<Button
						type="button"
						disabled={$reservePending || $unreservePending}
						onclick={() => void unreserveGift()}
					>
						{m.gift_action_unreserve()}
					</Button>
				{:else if $canReserveGift && !gift.isReserved}
					<Button
						type="button"
						skin="cta"
						disabled={$reservePending || $unreservePending}
						onclick={() => void reserveGift()}
					>
						{m.gift_action_reserve()}
					</Button>
				{:else if $canReserveGift && gift.isReserved}
					<Button type="button" disabled>{m.gift_status_reserved()}</Button>
				{:else if !$canEditGift}
					<Button type="link" href="/login">{m.gift_sign_in_to_reserve()}</Button>
				{/if}
			</menu>

			{#if $reserveError || $unreserveError}
				<p class="text-sm text-red-600">{$reserveError ?? $unreserveError}</p>
			{/if}
		</div>
	</div>
</div>

{#if isEditDialogOpen}
	<Dialog onclose={closeEditDialog}>
		{#snippet children()}
			<div class="w-full max-w-2xl">
				<h1 class="mb-4 text-2xl font-semibold">{m.gift_edit_title()}</h1>
				<GiftForm
					id={EDIT_DIALOG_FORM_ID}
					onsubmit={submitEditDialog}
					initialData={editDialogInitialData}
					availableTags={editDialogTags}
				/>
				{#if editDialogError}
					<p class="mt-3 text-sm text-red-600">{editDialogError}</p>
				{/if}
			</div>
		{/snippet}

		{#snippet actions()}
			<Button form={EDIT_DIALOG_FORM_ID} type="submit" disabled={editDialogSubmitting}>
				{m.common_save()}
			</Button>
			<Button skin="text" type="button" disabled={editDialogSubmitting} onclick={closeEditDialog}>
				{m.common_cancel()}
			</Button>
		{/snippet}
	</Dialog>
{/if}
