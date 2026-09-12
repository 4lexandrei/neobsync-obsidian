import * as dgram from "dgram";
import { logger } from "src/logging";
import { ProtocolMessage } from "src/protocol/messages";

export class UdpServer {
	private socket: dgram.Socket | null = null;
	private messageHandler:
		((message: ProtocolMessage) => Promise<void>) | null = null;

	constructor(
		private port: number,
		private readonly host?: "127.0.0.1",
	) {}

	onMessage(handler: (message: ProtocolMessage) => Promise<void>): void {
		this.messageHandler = handler;
	}

	start(): void {
		if (this.socket) return;

		this.socket = dgram.createSocket("udp4");
		this.socket.bind(this.port, this.host);

		this.socket.on("listening", () => {
			if (!this.socket) return;

			const address = this.socket.address();

			logger.info(
				`UDP - server listening on ${address.address}:${address.port}`,
			);
		});

		this.socket.on("message", async (msg) => {
			const data = msg.toString("utf-8").trim();

			if (!data) {
				logger.error("UDP - Received empty UDP message");
				return;
			}

			let message;

			try {
				message = JSON.parse(data);
			} catch (err) {
				logger.error("UDP - Error parsing JSON:", err);
				return;
			}

			try {
				if (this.messageHandler) await this.messageHandler(message);
			} catch (err) {
				logger.error("UDP - Error handling message:", err);
			}
		});

		this.socket.on("close", () => {
			logger.info("UDP - server closed");
		});

		this.socket.on("error", (err) => {
			logger.error(`UDP - server error: ${err.stack}`);
		});
	}

	close(): void {
		if (this.socket) this.socket.close();
		this.socket = null;
	}

	restart(port: number): void {
		if (this.port === port) return;

		logger.info("UDP - restarting server...");

		this.close();
		this.port = port;
		this.start();
	}
}
