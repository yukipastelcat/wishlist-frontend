<script lang="ts">
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import { faPlus as fasPlus } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages';
	const { onclick } = $props();
</script>

<button
	type="button"
	class="group flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 shadow-sm transition-all duration-300 hover:border-sky-500 hover:shadow-md hover:cursor-pointer"
	{onclick}
>
	<div
		class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-lg shadow-sky-500/20 transition-transform group-hover:scale-110"
	>
		<FontAwesomeIcon icon={fasPlus as any} class="text-xl text-white" />
	</div>
	<div class="text-center">
		<h3 class="font-semibold text-slate-900 mb-1">{m.gift_add_new()}</h3>
		<p class="text-sm text-slate-500">{m.gift_add_new_description()}</p>
	</div>
</button>
