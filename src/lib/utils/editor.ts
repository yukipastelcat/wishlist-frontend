import type { EditorJsDocument } from '$lib/types/editor';

export function isEditorJsDocument(value: unknown): value is EditorJsDocument {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const blocks = (value as { blocks?: unknown }).blocks;
	if (!Array.isArray(blocks)) return false;

	for (const block of blocks) {
		if (!block || typeof block !== 'object' || Array.isArray(block)) return false;
		const candidate = block as { type?: unknown; data?: unknown };
		if (typeof candidate.type !== 'string' || !candidate.type.trim()) return false;
		if (!candidate.data || typeof candidate.data !== 'object' || Array.isArray(candidate.data)) {
			return false;
		}
	}

	return true;
}

export function createEditorJsDocumentFromText(value: string): EditorJsDocument {
	const normalized = value.trim();
	const lines = normalized
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

	const blocks = (lines.length > 0 ? lines : [normalized]).filter(Boolean).map((line) => ({
		type: 'paragraph',
		data: {
			text: line
		}
	}));

	return {
		version: '2.29.1',
		blocks
	};
}

export function getEditorJsDocumentPlainText(value?: EditorJsDocument): string {
	if (!value) return '';
	const chunks: string[] = [];

	for (const block of value.blocks) {
		const blockText = collectPlainText(block.data);
		if (blockText) {
			chunks.push(blockText);
		}
	}

	return chunks.join('\n').trim();
}

export function normalizeEditorJsDocument(value: unknown): EditorJsDocument | undefined {
	if (typeof value === 'string') {
		const normalized = value.trim();
		return normalized ? createEditorJsDocumentFromText(normalized) : undefined;
	}

	if (!isEditorJsDocument(value)) {
		return undefined;
	}

	return {
		...('time' in value && typeof value.time === 'number' ? { time: value.time } : {}),
		...('version' in value && typeof value.version === 'string' ? { version: value.version } : {}),
		blocks: value.blocks.map((block) => ({
			...(typeof block.id === 'string' && block.id.trim() ? { id: block.id } : {}),
			type: block.type,
			data: block.data
		}))
	};
}

function collectPlainText(value: unknown): string {
	if (typeof value === 'string') {
		return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	}

	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}

	if (Array.isArray(value)) {
		return value
			.map((item) => collectPlainText(item))
			.filter(Boolean)
			.join(' ')
			.trim();
	}

	if (!value || typeof value !== 'object') {
		return '';
	}

	return Object.values(value)
		.map((item) => collectPlainText(item))
		.filter(Boolean)
		.join(' ')
		.trim();
}
