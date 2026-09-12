import { App, TFile } from "obsidian";
import { UpdateBufferParams } from "src/protocol/messages";

export class BufferSync {
	constructor(private readonly app: App) {}

	async update(params: UpdateBufferParams): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(params.buffer_path);

		if (!(file instanceof TFile)) return;

		const leaf = this.app.workspace.getLeaf();
		await leaf.openFile(file);
	}
}
