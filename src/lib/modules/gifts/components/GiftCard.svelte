<script lang="ts">
	import ImageWithFallback from '$lib/components/ImageWithFallback.svelte';
	import type { Gift } from '$lib/types/wishlist';
	import Button from '$lib/components/Button.svelte';
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import { faEdit as fasEdit, faExternalLink as fasExternalLink, faTrash as fasTrash } from '@fortawesome/free-solid-svg-icons';
	import { useAsyncAction } from '$lib/utils/action';
	import Badge from '$lib/components/Badge.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getEditorJsDocumentPlainText } from '$lib/utils/editor';

	type GiftCardProps = Gift & {
		link?: string;
		canViewGift?: boolean;
		canEditGift?: boolean;
		canReserveGift?: boolean;
		canDeleteGift?: boolean;
		onedit?: (id: string) => void | Promise<void>;
		onreserve?: (id: string) => void | Promise<void>;
		onunreserve?: (id: string) => void | Promise<void>;
		ondelete?: (id: string) => void | Promise<void>;
	};

	let {
		id,
		title,
		description,
		imageUrl = '',
		price,
		link,
		claimable = false,
		isReserved = false,
		isReservedByMe = false,
		canViewGift = false,
		canEditGift = false,
		canReserveGift = false,
		canDeleteGift = false,
		onedit,
		onreserve,
		onunreserve,
		ondelete
	}: GiftCardProps = $props();

	const { action: handleReserve, pending: reservePending } = useAsyncAction(async () => {
		await onreserve?.(id);
	});

	const { action: handleUnreserve, pending: unreservePending } = useAsyncAction(async () => {
		await onunreserve?.(id);
	});

	const { action: handleDelete, pending: deletePending } = useAsyncAction(async () => {
		await ondelete?.(id);
	});

	const descriptionText = $derived(
		description ? getEditorJsDocumentPlainText(description) : ''
	);
</script>

<div
	class="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300 flex flex-col"
>
	<div class="relative aspect-video bg-slate-100 overflow-hidden">
		<ImageWithFallback
			src={imageUrl}
			alt={title}
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>
		<div class="absolute top-3 right-3">
			{#if isReservedByMe}
				<Badge skin="success">
					{m.gift_status_your_reservation()}
				</Badge>
			{:else if isReserved}
				<Badge skin="neutral">
					{m.gift_status_reserved()}
				</Badge>
			{/if}
		</div>
	</div>
	<div class="p-5 flex flex-col flex-1">
		<h3 class="font-semibold text-slate-900 text-lg mb-1.5 line-clamp-1">
			{title}
		</h3>
		{#if descriptionText}
			<p class="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
				{descriptionText}
			</p>
		{/if}
		<div class="flex items-center justify-between mt-auto">
			{#if price}
				<span class="text-lg font-semibold text-slate-900">
					~{price.amount} {price.currency}
				</span>
			{/if}
			{#if link}
				<Button
					type="link"
					skin="text"
					href={link}
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
		<div class="flex gap-2 mt-2">
			{#if canViewGift}
				<Button type="link" class="flex-1" skin="text" href={`/gifts/${id}`}>
					{m.gift_view_details()}
				</Button>
			{/if}
			{#if canEditGift}
				<Button type="button" class="flex-1" onclick={() => onedit?.(id)}>
					<FontAwesomeIcon icon={fasEdit as any} />
					<span>{m.gift_action_edit()}</span>
				</Button>
			{/if}
			{#if canDeleteGift}
				<Button type="button" skin="danger" class="!px-3" title={m.gift_action_delete()} disabled={$deletePending} onclick={handleDelete}>
					<FontAwesomeIcon icon={fasTrash as any} />
				</Button>
			{/if}
			{#if canReserveGift && claimable}
				{#if isReservedByMe}
					<Button
						class="flex-1"
						skin="outlined"
						disabled={$unreservePending}
						onclick={handleUnreserve}
					>
						{m.gift_cancel_reservation()}
					</Button>
				{:else if isReserved}
					<Button class="flex-1" skin="cta" disabled>
						{m.gift_status_reserved()}
					</Button>
				{:else}
					<Button
						class="flex-1"
						skin="cta"
						disabled={$reservePending}
						onclick={handleReserve}
					>
						{m.gift_action_reserve()}
					</Button>
				{/if}
			{/if}
			{#if !canViewGift && !canEditGift && !canReserveGift && !canDeleteGift}
				<Button type="link" href="/login" class="flex-1" skin="cta">
					{m.gift_sign_in_to_reserve()}
				</Button>
			{/if}
		</div>
	</div>
</div>
