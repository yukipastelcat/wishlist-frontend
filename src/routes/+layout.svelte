<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Wishlist</title>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<div class="min-h-screen bg-(--palette-bg) transition-colors duration-500 relative overflow-hidden before:content[''] before:absolute before:h-[calc(100%+800px)] before:w-[calc(100%+800px)] before:opacity-15 before:bg-[url(/gifts.svg)] before:bg-size-[800px_800px] before:animate-[pattern-animate_80s_linear_0s_infinite_forwards]">
	<Navbar />
	<main class="mx-auto max-w-5xl px-4 pt-12 pb-8 sm:px-6 lg:px-8 relative">
		{@render children()}
	</main>
</div>
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
