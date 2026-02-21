<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    src,
    alt,
    loading = 'lazy',
    ...rest
  } = $props<{
    src: string;
    alt: string;
    loading?: 'eager' | 'lazy' | 'auto';
  } & HTMLAttributes<HTMLImageElement>>();

  const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

  let didError = $state(false);

  function handleError() {
    didError = true
  }
</script>

{#if didError}
	<div
		class={`inline-block bg-gray-100 text-center align-middle ${rest.class ?? ''}`}
		style={rest.style}
	>
		<div class="flex h-full w-full items-center justify-center">
			<img src={ERROR_IMG_SRC} alt="Error loading image" data-original-url={src} {...rest} />
		</div>
	</div>
{:else}
	<img {src} {alt} {loading} {...rest} onerror={handleError} />
{/if}
