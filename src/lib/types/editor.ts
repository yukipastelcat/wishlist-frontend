export type EditorJsBlock = {
	id?: string;
	type: string;
	data: Record<string, unknown>;
};

export type EditorJsDocument = {
	time?: number;
	version?: string;
	blocks: EditorJsBlock[];
};
