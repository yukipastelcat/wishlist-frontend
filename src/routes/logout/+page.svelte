<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { logout } from '$lib/api/auth';
	import { auth } from '$lib/stores/auth.store';

	onMount(async () => {
		try {
			await logout();
		} finally {
			auth.clearAuth();
			await goto('/', { replaceState: true });
		}
	});
</script>

<p class="text-sm text-(--palette-fg-muted)">Signing you out...</p>

