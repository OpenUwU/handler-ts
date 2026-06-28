import { appendFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { config } from "../config/config.js";

type LogLevel = "debug" | "info" | "success" | "warn" | "error";

const LEVEL_WEIGHT: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	success: 2,
	warn: 3,
	error: 4,
};

const COLOR: Record<LogLevel, string> = {
	debug: "\x1b[90m",
	info: "\x1b[34m",
	success: "\x1b[32m",
	warn: "\x1b[33m",
	error: "\x1b[31m",
};

const RESET = "\x1b[0m";

class Logger {
	private readonly minLevel: LogLevel;
	private readonly logsDir: string;
	private readonly maxFiles: number;
	private readonly timezone: string;

	constructor() {
		this.minLevel = config.logging.level;
		this.logsDir = path.join(process.cwd(), config.logging.dir);
		this.maxFiles = config.logging.maxFiles;
		this.timezone = config.logging.timezone;
		this.ensureLogsDir();
	}

	private ensureLogsDir(): void {
		if (!existsSync(this.logsDir)) {
			mkdirSync(this.logsDir, { recursive: true });
		}
	}

	private timestamp(): string {
		return new Date().toLocaleString("en-IN", {
			timeZone: this.timezone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
	}

	private writeToFile(level: LogLevel, context: string, message: string, error?: Error): void {
		const fileName = `${new Date().toISOString().slice(0, 10)}.log`;
		const filePath = path.join(this.logsDir, fileName);
		let line = `[${this.timestamp()}] [${level.toUpperCase()}] ${context}: ${message}`;
		if (error) line += `\n${error.stack ?? error.message}`;
		appendFileSync(filePath, `${line}\n`, "utf8");
		this.rotate();
	}

	private rotate(): void {
		const files = readdirSync(this.logsDir)
			.filter((file) => file.endsWith(".log"))
			.sort()
			.reverse();

		for (const file of files.slice(this.maxFiles)) {
			unlinkSync(path.join(this.logsDir, file));
		}
	}

	private log(level: LogLevel, context: string, message: string, error?: Error): void {
		if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[this.minLevel]) return;

		const line = `${COLOR[level]}[${this.timestamp()}] [${level.toUpperCase()}] ${context}${RESET} ${message}`;
		const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
		stream.write(`${line}\n`);
		if (error) process.stderr.write(`${error.stack ?? error.message}\n`);

		this.writeToFile(level, context, message, error);
	}

	debug(context: string, message: string, error?: Error): void {
		this.log("debug", context, message, error);
	}

	info(context: string, message: string, error?: Error): void {
		this.log("info", context, message, error);
	}

	success(context: string, message: string, error?: Error): void {
		this.log("success", context, message, error);
	}

	warn(context: string, message: string, error?: Error): void {
		this.log("warn", context, message, error);
	}

	error(context: string, message: string, error?: Error): void {
		this.log("error", context, message, error);
	}
}

export const logger = new Logger();
