import { handleUpdateCursor } from "./cursorHandler";
import { handleUpdateBuffer } from "./bufferHandler";

interface UpdateCursorParams {
	line: number;
	total_lines: number;
	frontmatter_lines: number;
}

interface UpdateBufferParams {
	buffer_path: string;
}

interface Data {
	method: "updateCursor" | "updateBuffer"; // Add more methods if needed
	params: UpdateCursorParams | UpdateBufferParams;
}

export function handleData(data: Data) {
	switch (data.method) {
		case "updateCursor":
			handleUpdateCursor(data.params as UpdateCursorParams);
			break;
		case "updateBuffer":
			handleUpdateBuffer(data.params as UpdateBufferParams);
			break;
		default:
			console.log("Unknown method:", data.method);
	}
}
