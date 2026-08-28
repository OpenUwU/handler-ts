/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777
 * github.com/openUwU/
 */
import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import type { BotClient } from "../../core/BotClient.js";
import { SlashCommandContext } from "../../structures/context/index.js";
import { defineEvent } from "../../types/index.js";
import { errorContainer } from "../../utils/components.js";
import { logger } from "../../utils/logger.js";
import { canBotSendMessages } from "../../utils/permissions.js";
import { runMiddlewares } from "../../utils/runMiddlewares.js";

async function handleChatInput(
	client: BotClient,
	interaction: ChatInputCommandInteraction,
): Promise<void> {
	await interaction.deferReply().catch(() => {
		/** empty because errors during deferReply can be safely ignored */
	});

	if (!interaction.inCachedGuild()) {
		await interaction
			.followUp({
				components: [
					errorContainer("Not in a server", "This command can only be used in a server."),
				],
				flags: MessageFlags.IsComponentsV2,
			})
			.catch(() => {
				/** empty because errors are intentionally ignored */
			});
		return;
	}

	const subCommandGroup = interaction.options.getSubcommandGroup(false);
	const subCommand = interaction.options.getSubcommand(false);
	const command = client.commands.getSlashCommandFile(
		interaction.commandName,
		subCommandGroup,
		subCommand,
	);

	if (!command) {
		logger.warn("InteractionCreate", `No command file found for /${interaction.commandName}`);
		await interaction
			.followUp({
				components: [
					errorContainer("Command not found", "This command is outdated or improperly configured."),
				],
				flags: MessageFlags.IsComponentsV2,
			})
			.catch(() => {
				/** empty because errors are intentionally ignored */
			});
		return;
	}

	if (!canBotSendMessages(interaction.channel)) {
		await interaction
			.followUp({
				components: [
					errorContainer(
						"No permission",
						"I don't have permission to send messages in this channel.",
					),
				],
				flags: MessageFlags.IsComponentsV2,
			})
			.catch(() => {
				/** empty because intentionally ignoring errors */
			});
		return;
	}

	const ctx = new SlashCommandContext(client, interaction);
	const result = await runMiddlewares(ctx, command);

	if (!result.ok) {
		if (result.silent) {
			await interaction.deleteReply().catch(() => {
				/** empty because errors are intentionally ignored */
			});
			return;
		}

		const container = errorContainer(result.error.title, result.error.description);
		await interaction
			.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 })
			.catch(() => {
				// empty because intentionally ignoring errors
			});
		return;
	}

	try {
		await command.execute(ctx);
	} catch (error) {
		logger.error(
			"InteractionCreate",
			`Error executing /${interaction.commandName}`,
			error as Error,
		);
		const container = errorContainer(
			"Command Error",
			"An unexpected error occurred while running this command.",
		);
		await interaction
			.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 })
			.catch(() => {
				// empty because errors are intentionally ignored
			});
	}
}

async function handleAutocomplete(
	client: BotClient,
	interaction: AutocompleteInteraction,
): Promise<void> {
	const subCommandGroup = interaction.options.getSubcommandGroup(false);
	const subCommand = interaction.options.getSubcommand(false);
	const command = client.commands.getSlashCommandFile(
		interaction.commandName,
		subCommandGroup,
		subCommand,
	);
	if (!command?.autocomplete) return;
	try {
		await command.autocomplete(interaction, client);
	} catch (error) {
		logger.error(
			"InteractionCreate",
			`Autocomplete error for /${interaction.commandName}`,
			error as Error,
		);
	}
}

export default defineEvent({
	name: "interactionCreate",
	async execute(client, interaction) {
		if (interaction.isChatInputCommand()) {
			await handleChatInput(client, interaction);
		} else if (interaction.isAutocomplete()) {
			await handleAutocomplete(client, interaction);
		}
	},
});
