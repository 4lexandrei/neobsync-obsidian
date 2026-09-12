import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	NeobsyncSettings,
	NeobsyncSettingTab,
} from "./settings";
import { UdpServer } from "./transport/udp";
import { registerSection } from "./markdown";
import { createDispatcher } from "./protocol/dispatcher";
import { createScrollStrategy } from "./sync/cursor/scroll";
import { CursorSync } from "./sync/cursor";
import { BufferSync } from "./sync/buffer";

export default class Neobsync extends Plugin {
	settings: NeobsyncSettings;
	server: UdpServer;
	cursorSync: CursorSync;

	async onload() {
		await this.loadSettings();

		const scrollStrategy = createScrollStrategy(
			this.settings.scrollMethod,
			this.app,
		);

		const bufferSync = new BufferSync(this.app);
		this.cursorSync = new CursorSync(scrollStrategy);

		const dispatcher = createDispatcher({
			updateBuffer: (params) => bufferSync.update(params),
			updateCursor: (params) => this.cursorSync.update(params),
		});

		this.registerMarkdownPostProcessor((element, context) => {
			registerSection(element, context);
			// const sectionInfo = context.getSectionInfo(element);
			// 	console.log("Element:", element);
			// console.log("Context:", context);
			// console.log("Section info:", sectionInfo);
		});

		this.addSettingTab(new NeobsyncSettingTab(this.app, this));

		this.server = new UdpServer(this.settings.port);
		this.server.onMessage(dispatcher);
		this.server.start();

		console.log("Neobsync has been loaded");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {
		console.log("Neobsync unloaded");
		this.server.close();
	}
}
