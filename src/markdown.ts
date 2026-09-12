import { MarkdownPostProcessorContext } from "obsidian";

export interface MarkdownSection {
	element: HTMLElement;
	lineStart: number;
	lineEnd: number;
}

const sections = new Map<string, MarkdownSection[]>();

export function registerSection(
	element: HTMLElement,
	context: MarkdownPostProcessorContext,
): void {
	const sectionInfo = context.getSectionInfo(element);

	if (!sectionInfo) return;

	const { sourcePath } = context;

	const sectionsForFile = sections.get(sourcePath) ?? [];

	const existingIndex = sectionsForFile.findIndex(
		(section) =>
			section.lineStart === sectionInfo.lineStart &&
			section.lineEnd === sectionInfo.lineEnd,
	);

	const section: MarkdownSection = {
		element,
		lineStart: sectionInfo.lineStart,
		lineEnd: sectionInfo.lineEnd,
	};

	if (existingIndex >= 0) {
		sectionsForFile[existingIndex] = section;
	} else {
		sectionsForFile.push(section);
	}

	sections.set(sourcePath, sectionsForFile);
}

export function findSection(
	sourcePath: string,
	line: number,
): MarkdownSection | undefined {
	const sourceSections = sections.get(sourcePath);

	if (!sourceSections) {
		return undefined;
	}

	return sourceSections.find(
		(section) =>
			section.element.isConnected &&
			line >= section.lineStart &&
			line <= section.lineEnd,
	);
}

export function clearSections(sourcePath: string): void {
	sections.delete(sourcePath);
}
