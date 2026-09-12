import { UpdateCursorParams } from "src/protocol/messages";
import { ScrollStrategy } from "./scroll";

export class CursorSync {
	constructor(private strategy: ScrollStrategy) {}

	setStrategy(strategy: ScrollStrategy): void {
		this.strategy = strategy;
	}

	update(params: UpdateCursorParams): void {
		this.strategy.scroll(params);
	}
}
