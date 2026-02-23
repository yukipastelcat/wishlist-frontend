<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';

	const BODY_LOCK_ATTR = 'data-dialog-lock-count';

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
		lockBodyScroll();
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			unlockBodyScroll();
		};
	});

	function lockBodyScroll() {
		const body = document.body;
		const root = document.documentElement;
		const currentCount = Number(body.getAttribute(BODY_LOCK_ATTR) ?? '0');
		const nextCount = currentCount + 1;
		body.setAttribute(BODY_LOCK_ATTR, String(nextCount));

		if (currentCount > 0) return;

		const scrollbarWidth = window.innerWidth - root.clientWidth;
		body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) {
			body.style.paddingRight = `${scrollbarWidth}px`;
		}
	}

	function unlockBodyScroll() {
		const body = document.body;
		const currentCount = Number(body.getAttribute(BODY_LOCK_ATTR) ?? '0');
		const nextCount = Math.max(0, currentCount - 1);

		if (nextCount === 0) {
			body.removeAttribute(BODY_LOCK_ATTR);
			body.style.overflow = '';
			body.style.paddingRight = '';
			return;
		}

		body.setAttribute(BODY_LOCK_ATTR, String(nextCount));
	}
</script>

<div
	class="items-safe-center fixed inset-0 z-10 flex justify-center overflow-y-auto bg-stone-950/10 p-4 backdrop-blur-sm sm:p-6"
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
