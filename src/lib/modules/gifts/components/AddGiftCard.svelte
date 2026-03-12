<script lang="ts">
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import { faPlus as fasPlus } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages';
	const { onclick } = $props();
</script>

<button
	type="button"
	class="group flex flex-col items-center justify-center gap-3 overflow-hidden rounded-(--palette-radius-lg) border-2 border-dashed border-(--palette-border) bg-(--palette-card) p-6 shadow-sm transition-all duration-300 hover:border-(--palette-accent) hover:shadow-md hover:cursor-pointer"
	{onclick}
>
	<div
		class="flex h-14 w-14 items-center justify-center rounded-(--palette-radius-lg) bg-gradient-to-br from-(--palette-accent) to-(--palette-accent-dark) shadow-lg shadow-(--palette-accent)/20 transition-transform group-hover:scale-110"
	>
		<FontAwesomeIcon icon={fasPlus as any} class="text-xl text-(--palette-fg-on-dark)" />
	</div>
	<div class="text-center">
		<h3 class="font-semibold text-(--palette-fg) mb-1">{m.gift_add_new()}</h3>
		<p class="text-sm text-(--palette-fg-muted)">{m.gift_add_new_description()}</p>
	</div>
</button>
