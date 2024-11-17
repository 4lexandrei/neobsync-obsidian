import { App, PluginSettingTab, Setting } from "obsidian";
import Neobsync, { DEFAULT_SETTINGS } from "./main";

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
			.setDesc("Listening on port")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.port)
					.setValue(this.plugin.settings.port)
					.onChange(async (value) => {
						this.plugin.settings.port = value;
						await this.plugin.saveSettings();
					})
					.inputEl.addEventListener("focusout", async () => {
						await this.plugin.server.restart(parseInt(this.plugin.settings.port));
					})
			);
	}
}
