import { App } from "obsidian";
import { UpdateCursorParams } from "src/protocol/messages";
import { HybridScrollStrategy } from "./hybrid";
import { PercentageScrollStrategy } from "./percentage";
import { SectionScrollStrategy } from "./section";

export interface ScrollStrategy {
	scroll(params: UpdateCursorParams): void;
}

export type ScrollMethod = "section" | "percentage" | "hybrid";

export function createScrollStrategy(
	method: ScrollMethod,
	app: App,
): ScrollStrategy {
	switch (method) {
		case "percentage":
			return new PercentageScrollStrategy();
		case "section":
			return new SectionScrollStrategy(app);
		case "hybrid":
			return new HybridScrollStrategy(app);
	}
}

export { HybridScrollStrategy } from "./hybrid";
export { SectionScrollStrategy } from "./section";
export { PercentageScrollStrategy } from "./percentage";
