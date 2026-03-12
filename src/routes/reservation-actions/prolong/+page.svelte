<script lang="ts">
	import { goto } from '$app/navigation';
	import { prolongReservation } from '$lib/api/gifts';
	import { onMount } from 'svelte';

	let { data } = $props<{ data: { giftId: string } }>();
	let error = $state<string | null>(null);

	onMount(async () => {
		if (!data.giftId) {
			error = 'Missing giftId.';
			return;
		}

		try {
			await prolongReservation(data.giftId);
			await goto('/', { replaceState: true });
		} catch {
			error = 'Failed to prolong reservation.';
		}
	});
</script>

{#if error}
	<p class="text-sm text-(--palette-danger)">{error}</p>
{:else}
	<p class="text-sm text-(--palette-fg-muted)">Prolonging reservation...</p>
{/if}
