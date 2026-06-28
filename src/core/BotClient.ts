import { Client, GatewayIntentBits } from "discord.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { config } from "../config/config.js";
import { CommandHandler } from "./CommandHandler.js";
import { EventLoader } from "./EventLoader.js";
import { logger } from "../utils/logger.js";

function resolveShardOptions(): {
	shards: number[];
	shardCount: number;
} | null {
	try {
		const info = getInfo();
		return { shards: info.SHARD_LIST, shardCount: info.TOTAL_SHARDS };
	} catch {
		return null;
	}
}

export class BotClient extends Client {
	public readonly commands: CommandHandler;
	public readonly events: EventLoader;
	public readonly cluster: ClusterClient<BotClient> | null;

	constructor() {
		const shardOptions = resolveShardOptions();

		super({
			...(shardOptions ?? {}),
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildVoiceStates,
			],
			allowedMentions: { parse: [], repliedUser: false },
			failIfNotExists: false,
		});

		this.cluster = shardOptions ? new ClusterClient(this) : null;
		this.commands = new CommandHandler();
		this.events = new EventLoader(this);

		if (!shardOptions) {
			logger.warn("Bot", "Not running in cluster mode");
		}
	}

	async start(): Promise<void> {
		await this.events.load();
		await this.commands.load();
		await this.login(config.token);
	}

	async shutdown(): Promise<void> {
		logger.warn("Bot", "Shutting down");
		this.destroy();
	}
}
