import { TFile } from "obsidian";

export async function handleUpdateBuffer(params: { buffer_path: string }) {
	const buffer = params.buffer_path;
	const file = this.app.vault.getAbstractFileByPath(buffer) as TFile;
	if (file) {
		const leaf = this.app.workspace.getLeaf();
		await leaf.openFile(file);
	}
}
