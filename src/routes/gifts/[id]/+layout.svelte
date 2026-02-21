<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { m } from '$lib/paraglide/messages';

	let { children } = $props();
</script>

<div class="mx-auto w-full max-w-3xl">
	{@render children()}
</div>
