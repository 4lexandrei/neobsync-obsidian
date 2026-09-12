export interface UpdateCursorParams {
	line: number;
	total_lines: number;
	frontmatter_lines: number;
}

export interface UpdateBufferParams {
	buffer_path: string;
}

export type ProtocolPayloadMap = {
	updateCursor: UpdateCursorParams;
	updateBuffer: UpdateBufferParams;
};

export type ProtocolMethod = keyof ProtocolPayloadMap;

export type ProtocolMessage = {
	[K in ProtocolMethod]: {
		method: K;
		params: ProtocolPayloadMap[K];
	};
}[ProtocolMethod];
