export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

export class Logger {
	constructor(private level: LogLevel = "warn") {}

	setLevel(level: LogLevel): void {
		this.level = level;
	}

	debug(message: string, ...args: unknown[]): void {
		this.log("debug", message, args);
	}

	info(message: string, ...args: unknown[]): void {
		this.log("info", message, args);
	}

	warn(message: string, ...args: unknown[]): void {
		this.log("warn", message, args);
	}

	error(message: string, ...args: unknown[]): void {
		this.log("error", message, args);
	}

	private log(level: LogLevel, message: string, args: unknown[]) {
		if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) return;

		const prefix = "[Neobsync]";

		switch (level) {
			case "debug":
				console.debug(prefix, message, ...args);
				return;

			case "info":
				console.info(prefix, message, ...args);
				return;

			case "warn":
				console.warn(prefix, message, ...args);
				return;

			case "error":
				console.error(prefix, message, ...args);
				return;
		}
	}
}

export const logger = new Logger();
