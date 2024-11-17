import * as dgram from "dgram";
import { handleData } from "src/handlers/dataHandler";
export class UDPServer {
	constructor(private PORT: number) { }
	private udpServer: dgram.Socket | null = null;
	private HOST = "127.0.0.1";

	start() {

		this.udpServer = dgram.createSocket("udp4");
		this.udpServer.bind(this.PORT, this.HOST);

		this.udpServer.on("listening", () => {
			console.log(`UDP server listening on port ${this.HOST}:${this.PORT}`);
		})

		this.udpServer.on("message", (msg) => {
			try {
				const data = JSON.parse(msg.toString());
				handleData(data);
			} catch (err) {
				console.error("Error parsing JSON:", err);
			}
		});

		this.udpServer.on("close", () => {
			console.log("UDP server closed");
		});
	}

	close() {
		if (this.udpServer) {
			this.udpServer.close();
		}
	}

	async restart(PORT: number) {
		if (this.PORT !== PORT) {
			this.close();
			console.log("Restarting UDP server...")
			this.PORT = PORT;
			this.start();
		}
	}
}
