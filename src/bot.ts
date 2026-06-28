import { BotClient } from "./core/BotClient.js";
import { logger } from "./utils/logger.js";

const client = new BotClient();

process.on("unhandledRejection", (reason) => {
	logger.error(
		"Process",
		"Unhandled Rejection",
		reason instanceof Error ? reason : new Error(String(reason)),
	);
});

process.on("uncaughtException", (error) => {
	logger.error("Process", "Uncaught Exception", error);
});

async function shutdown(signal: string): Promise<void> {
	logger.warn("Process", `Received ${signal}, shutting down`);
	await client.shutdown();
	process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

client.start().catch((error: unknown) => {
	logger.error("Bot", "Failed to start", error as Error);
	process.exit(1);
});
