/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { config } from "../../config/config.js";
import { PrefixCommandContext } from "../../structures/context/index.js";
import { defineEvent } from "../../types/index.js";
import { logger } from "../../utils/logger.js";
import { canBotSendMessages } from "../../utils/permissions.js";
import { runMiddlewares } from "../../utils/runMiddlewares.js";
import { errorContainer } from "../../utils/components.js";
import { MessageFlags } from "discord.js";

export default defineEvent({
	name: "messageCreate",
	async execute(client, message) {
		if (message.author.bot || !message.inGuild()) return;
		if (!canBotSendMessages(message.channel)) return;

		const prefix = config.prefix;
		if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

		const args = message.content.slice(prefix.length).trim().split(/\s+/);
		const resolved = client.commands.resolvePrefixCommand(args);
		if (!resolved) return;

		const { command, args: commandArgs } = resolved;
		const ctx = new PrefixCommandContext(client, message, commandArgs);
		const result = await runMiddlewares(ctx, command);

		if (!result.ok) {
			const container = errorContainer(result.error.title, result.error.description);
			await message
				.reply({ components: [container], flags: MessageFlags.IsComponentsV2 })
				.catch(() => {});
			return;
		}

		try {
			await command.execute(ctx);
		} catch (error) {
			logger.error(
				"MessageCreate",
				`Error executing ${Array.isArray(command.name) ? command.name.join(" ") : command.name}`,
				error as Error,
			);
			const container = errorContainer(
				"Command Error",
				"An unexpected error occurred while running this command.",
			);
			await message
				.reply({ components: [container], flags: MessageFlags.IsComponentsV2 })
				.catch(() => {});
		}
	},
});
