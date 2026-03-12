<script lang="ts">
	import type { EditorJsDocument } from '$lib/types/editor';

	const { document, class: className = '' } = $props<{ document?: EditorJsDocument; class?: string }>();

	function toText(value: unknown): string {
		if (typeof value === 'string') {
			return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
		}

		if (typeof value === 'number' || typeof value === 'boolean') {
			return String(value);
		}

		if (Array.isArray(value)) {
			return value.map((item) => toText(item)).filter(Boolean).join(' ').trim();
		}

		if (!value || typeof value !== 'object') {
			return '';
		}

		return Object.values(value)
			.map((item) => toText(item))
			.filter(Boolean)
			.join(' ')
			.trim();
	}

	function listItems(data: Record<string, unknown>): string[] {
		const raw = data.items;
		if (!Array.isArray(raw)) return [];
		return raw.map((item) => toText(item)).filter(Boolean);
	}

	function toInlineHtml(value: unknown): string {
		if (typeof value !== 'string') {
			return escapeHtml(toText(value));
		}
		return sanitizeInlineHtml(value);
	}

	function sanitizeInlineHtml(input: string): string {
		if (typeof window === 'undefined') {
			return escapeHtml(input);
		}

		const template = window.document.createElement('template');
		template.innerHTML = input;
		const container = window.document.createElement('div');

		for (const node of Array.from(template.content.childNodes)) {
			appendSanitizedNode(container, node);
		}

		return container.innerHTML;
	}

	function appendSanitizedNode(parent: HTMLElement, node: ChildNode): void {
		if (node.nodeType === window.Node.TEXT_NODE) {
			parent.appendChild(window.document.createTextNode(node.textContent ?? ''));
			return;
		}

		if (node.nodeType !== window.Node.ELEMENT_NODE) return;
		const source = node as HTMLElement;
		const tag = source.tagName.toLowerCase();

		if (tag === 'b' || tag === 'i') {
			const safe = window.document.createElement(tag);
			for (const child of Array.from(source.childNodes)) {
				appendSanitizedNode(safe, child);
			}
			parent.appendChild(safe);
			return;
		}

		if (tag === 'a') {
			const safe = window.document.createElement('a');
			const href = source.getAttribute('href')?.trim() ?? '';
			if (isSafeHref(href)) {
				safe.setAttribute('href', href);
			}
			safe.setAttribute('rel', 'noopener noreferrer');
			if (href.startsWith('http://') || href.startsWith('https://')) {
				safe.setAttribute('target', '_blank');
			}
			for (const child of Array.from(source.childNodes)) {
				appendSanitizedNode(safe, child);
			}
			parent.appendChild(safe);
			return;
		}

		for (const child of Array.from(source.childNodes)) {
			appendSanitizedNode(parent, child);
		}
	}

	function isSafeHref(href: string): boolean {
		if (!href) return false;
		const normalized = href.toLowerCase();
		if (normalized.startsWith('javascript:') || normalized.startsWith('data:')) {
			return false;
		}
		return (
			normalized.startsWith('http://') ||
			normalized.startsWith('https://') ||
			normalized.startsWith('mailto:') ||
			normalized.startsWith('tel:') ||
			normalized.startsWith('/') ||
			normalized.startsWith('#')
		);
	}

	function escapeHtml(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}
</script>

{#if document?.blocks?.length}
	<div class={`editorjs-content ${className}`.trim()}>
		{#each document.blocks as block, index (block.id ?? `${block.type}-${index}`)}
			{@const text = toText(block.data)}
			{#if block.type === 'header'}
				<h3 class="text-lg font-semibold text-(--palette-fg)">
					{@html toInlineHtml((block.data as Record<string, unknown>).text)}
				</h3>
			{:else if block.type === 'list'}
				{@const rawItems = (block.data as Record<string, unknown>).items}
				{@const items = Array.isArray(rawItems) ? rawItems : []}
				{#if items.length}
					<ul class="list-disc pl-5 text-(--palette-fg-muted)">
						{#each items as item}
							<li>{@html toInlineHtml(item)}</li>
						{/each}
					</ul>
				{/if}
			{:else if text}
				<p class="text-(--palette-fg-muted) leading-relaxed">
					{@html toInlineHtml((block.data as Record<string, unknown>).text)}
				</p>
			{/if}
		{/each}
	</div>
{/if}
