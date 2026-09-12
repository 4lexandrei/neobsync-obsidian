import Neobsync from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { createScrollStrategy, ScrollMethod } from "./sync/cursor/scroll";

export interface NeobsyncSettings {
	port: number;
	scrollMethod: ScrollMethod;
}

export const DEFAULT_SETTINGS: Partial<NeobsyncSettings> = {
	port: 9000,
	scrollMethod: "hybrid",
};

export function isValidPort(port: number): boolean {
	return Number.isInteger(port) && port >= 1 && port <= 65535;
}

export class NeobsyncSettingTab extends PluginSettingTab {
	plugin: Neobsync;

	constructor(app: App, plugin: Neobsync) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Port")
			.setDesc("Neobsync UDP port.")
			.addText((text) =>
				text
					.setPlaceholder(String(DEFAULT_SETTINGS.port))
					.setValue(String(this.plugin.settings.port))
					.onChange(async (value) => {
						const port = Number(value);

						if (!isValidPort(port)) return;

						if (port === this.plugin.settings.port) return;

						this.plugin.settings.port = port;
						await this.plugin.saveSettings();
					})
					.inputEl.addEventListener("focusout", async () => {
						const port = this.plugin.settings.port;
						if (!isValidPort(port)) return;
						this.plugin.server.restart(port);
					}),
			);

		new Setting(containerEl)
			.setName("Scroll Method")
			.setDesc(
				"Controls how the cursor position is mapped to the Markdown preview.",
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("hybrid", "Hybrid")
					.addOption("section", "Markdown section")
					.addOption("percentage", "Percentage")
					.setValue(this.plugin.settings.scrollMethod)
					.onChange(async (value) => {
						const method = value as ScrollMethod;
						if (method === this.plugin.settings.scrollMethod)
							return;
						this.plugin.settings.scrollMethod = method;
						this.plugin.cursorSync.setStrategy(
							createScrollStrategy(method, this.app),
						);
						await this.plugin.saveSettings();
					}),
			);
	}
}
