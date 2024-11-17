import { Plugin } from "obsidian";
import { NeobsyncSettingTab } from "./settings";
import { UDPServer } from "./server/udp";

interface NeobsyncSettings {
	port: string;
}

export const DEFAULT_SETTINGS = {
	port: "9000",
}

export default class Neobsync extends Plugin {
	settings: NeobsyncSettings;
	server: UDPServer;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new NeobsyncSettingTab(this.app, this));
		this.server = new UDPServer(parseInt(this.settings.port));
		this.server.start();
		console.log("Neobsync-UDP loaded");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onunload() {
		console.log("Neobsync unloaded");
		this.server.close();
	}
}
