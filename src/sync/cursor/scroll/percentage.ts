import { UpdateCursorParams } from "src/protocol/messages";
import { ScrollStrategy } from ".";

export class PercentageScrollStrategy implements ScrollStrategy {
	scroll(params: UpdateCursorParams): void {
		const previewContainer = document.querySelector(
			".markdown-preview-view",
		);

		if (previewContainer) {
			const line = params.line;
			const totalLines = params.total_lines;
			const frontmatterLines = params.frontmatter_lines;
			const effectiveTotalLines = totalLines - frontmatterLines;
			const adjustedLine = Math.max(0, line - frontmatterLines);
			const cursorPercentage = adjustedLine / effectiveTotalLines;
			const contentHeight = previewContainer.scrollHeight;
			const targetScrollTop =
				cursorPercentage * (contentHeight - window.innerHeight);

			requestAnimationFrame(() => {
				previewContainer.scrollTo({
					top: targetScrollTop,
				});
			});
		}
	}
}
