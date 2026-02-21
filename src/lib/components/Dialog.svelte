<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';

	const { open, onclose, children, actions } = $props<{
		onclose?: () => void;
		children?: () => any;
		actions?: () => any;
	}>();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onclose?.();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onclose?.();
		}
	}

	$effect(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<div
	class="fixed inset-0 z-10 flex items-center justify-center bg-stone-950/10 backdrop-blur-sm"
	role="presentation"
	onclick={handleBackdropClick}
	in:fade={{ duration: 180 }}
	out:fade={{ duration: 180 }}
>
	<div
		role="dialog"
		aria-modal="true"
		class="prose prose-sm flex w-full max-w-md flex-col items-center justify-center space-y-4 rounded-2xl bg-white p-6 shadow-xl"
		in:scale={{
			duration: 180,
			start: 0.96,
			easing: cubicOut
		}}
		out:scale={{
			duration: 180,
			start: 0.98,
			easing: cubicIn
		}}
	>
		{@render children?.()}

		{#if actions}
			<menu class="mt-4 flex w-full flex-row-reverse justify-start space-x-2 space-x-reverse">
				{@render actions()}
			</menu>
		{/if}
	</div>
</div>
