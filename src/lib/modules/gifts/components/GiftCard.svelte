<script lang="ts">
	import ImageWithFallback from '$lib/components/ImageWithFallback.svelte';
	import type { Gift } from '$lib/types/wishlist';
	import Button from '$lib/components/Button.svelte';
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import {
		faEdit as fasEdit,
		faExternalLink as fasExternalLink,
		faTrash as fasTrash
	} from '@fortawesome/free-solid-svg-icons';
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

	const descriptionText = $derived(description ? getEditorJsDocumentPlainText(description) : '');
</script>

<div
	class="group before:content[''] relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-(--palette-accent)/30 p-5 transition-all duration-300 before:absolute before:inset-2.5 before:rounded-lg before:bg-(--palette-card)"
	style="aspect-ratio: 3 / 5;"
>
	<div class="relative z-1 flex flex-col flex-1 gap-3 min-h-0">
		<div class="flex-shrink-0 aspect-square overflow-hidden rounded-lg shadow-md">
			<ImageWithFallback
				src={imageUrl}
				alt={title}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
		</div>
		<div class="flex flex-1 flex-col min-h-0">
			<h3 class="mb-1 line-clamp-2 text-base font-semibold leading-snug text-(--palette-fg) sm:text-lg">
				{title}
			</h3>
			{#if descriptionText}
				<p class="mb-2 line-clamp-3 text-sm leading-relaxed text-(--palette-fg-muted)">
					{descriptionText}
				</p>
			{:else}
				<div class="mb-2 h-[3.75rem]"></div>
			{/if}
			<div class="mt-auto flex flex-col gap-2">
				<div class="flex items-center justify-between gap-2">
					{#if price}
						<span class="text-base font-semibold text-(--palette-fg)">
							~{price.amount}
							{price.currency}
						</span>
					{:else}
						<span></span>
					{/if}
					{#if link}
						<Button type="link" skin="text" href={link} target="_blank" rel="noopener noreferrer" class="text-sm shrink-0">
							<span>{m.gift_open_link()}</span>
							<FontAwesomeIcon icon={fasExternalLink as any} />
						</Button>
					{/if}
				</div>
				<div class="flex gap-2">
					{#if canViewGift}
						<Button type="link" class="flex-1 text-sm" skin="text" href={`/gifts/${id}`}>
							{m.gift_view_details()}
						</Button>
					{/if}
					{#if canEditGift}
						<Button type="button" class="flex-1 text-sm" onclick={() => onedit?.(id)}>
							<FontAwesomeIcon icon={fasEdit as any} />
							<span>{m.gift_action_edit()}</span>
						</Button>
					{/if}
					{#if canDeleteGift}
						<Button
							type="button"
							skin="danger"
							class="!px-3"
							title={m.gift_action_delete()}
							disabled={$deletePending}
							onclick={handleDelete}
						>
							<FontAwesomeIcon icon={fasTrash as any} />
						</Button>
					{/if}
					{#if canReserveGift && claimable}
						{#if isReservedByMe}
							<Button
								class="flex-1 text-sm"
								skin="outlined"
								disabled={$unreservePending}
								onclick={handleUnreserve}
							>
								{m.gift_cancel_reservation()}
							</Button>
						{:else if isReserved}
							<Button class="flex-1 text-sm" skin="cta" disabled>
								{m.gift_status_reserved()}
							</Button>
						{:else}
							<Button class="flex-1 text-sm" skin="cta" disabled={$reservePending} onclick={handleReserve}>
								{m.gift_action_reserve()}
							</Button>
						{/if}
					{/if}
					{#if !canViewGift && !canEditGift && !canReserveGift && !canDeleteGift}
						<Button type="link" href="/login" class="flex-1 text-sm" skin="cta">
							{m.gift_sign_in_to_reserve()}
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>
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
