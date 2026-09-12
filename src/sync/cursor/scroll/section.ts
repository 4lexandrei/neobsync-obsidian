import { App } from "obsidian";
import { findSection } from "src/markdown";
import { UpdateCursorParams } from "src/protocol/messages";
import { ScrollStrategy } from ".";

export class SectionScrollStrategy implements ScrollStrategy {
	constructor(private app: App) {}

	scroll(params: UpdateCursorParams): void {
		const activeFile = this.app.workspace.getActiveFile();

		if (!activeFile) {
			console.log("No active file");
			return;
		}

		const sourcePath = activeFile.path;

		if (params.line <= params.frontmatter_lines) {
			const previewContainer = document.querySelector(
				".markdown-preview-view",
			);
			if (previewContainer instanceof HTMLElement)
				previewContainer.scrollTop = 0;
			return;
		}

		const section = findSection(sourcePath, params.line - 1);

		if (!section) {
			console.log(
				`No rendered section found for ${sourcePath} at line ${params.line}`,
			);
			return;
		}

		const previewContainer = section.element.closest(
			".markdown-preview-view",
		);

		// const previewContainer = document.querySelector(
		// 	".markdown-preview-view",
		// );

		if (!(previewContainer instanceof HTMLElement)) {
			console.log("No preview container for section");
			return;
		}

		console.log(
			`Line ${params.line} -> lines ${section.lineStart}-${section.lineEnd}`,
			section.element,
		);

		const elementRect = section.element.getBoundingClientRect();
		const containerRect = previewContainer.getBoundingClientRect();

		const targetScrollTop =
			previewContainer.scrollTop + elementRect.top - containerRect.top;

		console.log("Scrolling to:", targetScrollTop);

		requestAnimationFrame(() => {
			previewContainer.scrollTo({
				top: targetScrollTop,
				// behavior: "smooth", // FIX: breaks when using `G` or `gg` so on the neovim side we will just send if we are on top or bottom and then we can re-enable this line of code
			});
		});
	}
}
