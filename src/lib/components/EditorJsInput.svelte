<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { EditorJsDocument } from '$lib/types/editor';
	import { normalizeEditorJsDocument } from '$lib/utils/editor';

	type EditorJsInstance = {
		save: () => Promise<EditorJsDocument>;
		destroy: () => void;
		isReady?: Promise<void>;
	};

	const {
		id,
		value,
		onchange,
		placeholder = 'Write something...',
		class: className = ''
	} = $props<{
		id?: string;
		value?: EditorJsDocument;
		onchange?: (value: EditorJsDocument) => void;
		placeholder?: string;
		class?: string;
	}>();

	let holder: HTMLDivElement;
	let editor: EditorJsInstance | null = null;
	let removeLabelBindings: (() => void) | null = null;

	onMount(async () => {
		const EditorJS = await loadGlobalConstructor(
			'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.31.0/dist/editorjs.umd.min.js',
			'EditorJS'
		);

		editor = new EditorJS({
			holder,
			data: value,
			placeholder,
			onChange: async () => {
				if (!editor || !onchange) return;
				const next = normalizeEditorJsDocument(await editor.save());
				if (next) {
					onchange(next);
				}
			}
		}) as EditorJsInstance;

		removeLabelBindings = bindExternalLabels(id);
	});

	onDestroy(() => {
		removeLabelBindings?.();
		removeLabelBindings = null;
		editor?.destroy();
		editor = null;
	});

	async function loadGlobalConstructor(
		url: string,
		globalName: string
	): Promise<new (...args: any[]) => EditorJsInstance> {
		const existing = (window as unknown as Record<string, unknown>)[globalName];
		if (existing) {
			return existing as new (...args: any[]) => EditorJsInstance;
		}

		await new Promise<void>((resolve, reject) => {
			const script = document.createElement('script');
			script.src = url;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error(`Failed to load ${globalName}`));
			document.head.appendChild(script);
		});

		const loaded = (window as unknown as Record<string, unknown>)[globalName];
		if (!loaded) {
			throw new Error(`${globalName} is not available on window`);
		}

		return loaded as new (...args: any[]) => EditorJsInstance;
	}

	async function focusEditorInput() {
		try {
			await editor?.isReady;
		} catch {
			return;
		}

		for (let attempt = 0; attempt < 8; attempt += 1) {
			const editable = holder.querySelector<HTMLElement>('[contenteditable=\"true\"]');
			if (editable) {
				editable.focus();
				return;
			}

			await new Promise((resolve) => setTimeout(resolve, 16));
		}
	}

	function bindExternalLabels(fieldId?: string): () => void {
		if (!fieldId) return () => {};

		const escapedId = CSS.escape(fieldId);
		const labels = Array.from(document.querySelectorAll<HTMLLabelElement>(`label[for="${escapedId}"]`));
		if (labels.length === 0) return () => {};

		const handler = (event: MouseEvent) => {
			event.preventDefault();
			void focusEditorInput();
		};

		for (const label of labels) {
			label.addEventListener('click', handler);
		}

		return () => {
			for (const label of labels) {
				label.removeEventListener('click', handler);
			}
		};
	}
</script>

<div id={id} class={`form-editorjs ${className}`.trim()}>
	<div bind:this={holder}></div>
</div>
