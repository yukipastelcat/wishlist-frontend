<script lang="ts">
	import { goto } from '$app/navigation';
	import { unreserve } from '$lib/api/gifts';
	import { onMount } from 'svelte';

	let { data } = $props<{ data: { giftId: string } }>();
	let error = $state<string | null>(null);

	onMount(async () => {
		if (!data.giftId) {
			error = 'Missing giftId.';
			return;
		}

		try {
			await unreserve(data.giftId);
			await goto('/', { replaceState: true });
		} catch {
			error = 'Failed to cancel reservation.';
		}
	});
</script>

{#if error}
	<p class="text-sm text-(--palette-danger)">{error}</p>
{:else}
	<p class="text-sm text-(--palette-fg-muted)">Canceling reservation...</p>
{/if}
