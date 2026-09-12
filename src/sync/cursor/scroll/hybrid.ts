import { App } from "obsidian";
import { logger } from "src/logging";
import { findSection, MarkdownSection } from "src/markdown";
import { UpdateCursorParams } from "src/protocol/messages";
import { ScrollStrategy } from ".";

export class HybridScrollStrategy implements ScrollStrategy {
	constructor(private app: App) {}

	scroll(params: UpdateCursorParams): void {
		const activeFile = this.app.workspace.getActiveFile();

		if (!activeFile) {
			logger.info("No active file");
			return;
		}

		const sourcePath = activeFile.path;
		const targetLine = params.line - 1;

		if (params.line <= params.frontmatter_lines) {
			const previewContainer = document.querySelector(
				".markdown-preview-view",
			);

			if (previewContainer instanceof HTMLElement) {
				previewContainer.scrollTop = 0;
			}

			return;
		}

		const section = findSection(sourcePath, targetLine);

		if (section) {
			this.scrollToSection(section, params);
			return;
		}

		const previewContainer = document.querySelector(
			".markdown-preview-view",
		);

		if (!(previewContainer instanceof HTMLElement)) {
			return;
		}

		const percentage = targetLine / Math.max(params.total_lines - 1, 1);

		const currentPercentage =
			previewContainer.scrollTop /
			Math.max(
				previewContainer.scrollHeight - previewContainer.clientHeight,
				1,
			);

		const distance = Math.abs(percentage - currentPercentage);

		if (distance < 0.15) {
			return;
		}

		const targetScroll =
			percentage *
			(previewContainer.scrollHeight - previewContainer.clientHeight);

		previewContainer.scrollTo({
			top: targetScroll,
		});

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const renderedSection = findSection(sourcePath, targetLine);

				if (!renderedSection) {
					logger.debug(
						`Section still not rendered for ${sourcePath} at line ${params.line}`,
					);
					return;
				}

				this.scrollToSection(renderedSection, params);
			});
		});
	}

	private scrollToSection(
		section: MarkdownSection,
		params: UpdateCursorParams,
	): void {
		const previewContainer = section.element.closest(
			".markdown-preview-view",
		);

		if (!(previewContainer instanceof HTMLElement)) {
			logger.debug("No preview container for section");
			return;
		}

		const elementRect = section.element.getBoundingClientRect();

		const containerRect = previewContainer.getBoundingClientRect();

		const sectionHeight = elementRect.height;
		const viewportHeight = containerRect.height;

		if (sectionHeight > viewportHeight) {
			const sectionLineCount = section.lineEnd - section.lineStart + 1;

			const lineInSection = params.line - 1 - section.lineStart;

			const sectionPercentage =
				sectionLineCount > 1
					? lineInSection / (sectionLineCount - 1)
					: 0;

			const maxSectionScroll = sectionHeight - viewportHeight;

			const sectionOffset = sectionPercentage * maxSectionScroll;

			const targetScrollTop =
				previewContainer.scrollTop +
				elementRect.top -
				containerRect.top +
				sectionOffset;

			logger.debug(
				`Long section ${section.lineStart}-${section.lineEnd}`,
				`line=${params.line}`,
				`percentage=${sectionPercentage}`,
				`scroll=${targetScrollTop}`,
			);

			requestAnimationFrame(() => {
				previewContainer.scrollTo({
					top: targetScrollTop,
				});
			});

			return;
		}

		const targetScrollTop =
			previewContainer.scrollTop + elementRect.top - containerRect.top;

		logger.debug(
			`Line ${params.line} -> lines ${section.lineStart}-${section.lineEnd}`,
			section.element,
		);

		logger.debug("Scrolling to:", targetScrollTop);

		requestAnimationFrame(() => {
			previewContainer.scrollTo({
				top: targetScrollTop,
			});
		});
	}
}
