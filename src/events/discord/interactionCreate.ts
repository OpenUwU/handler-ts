import {
	MessageFlags,
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
} from "discord.js";
import type { BotClient } from "../../core/BotClient.js";
import { SlashCommandContext } from "../../structures/context/index.js";
import { defineEvent } from "../../types/index.js";
import { logger } from "../../utils/logger.js";
import { canBotSendMessages } from "../../utils/permissions.js";
import { runMiddlewares } from "../../utils/runMiddlewares.js";
import { errorContainer } from "../../utils/components.js";

async function handleChatInput(
	client: BotClient,
	interaction: ChatInputCommandInteraction,
): Promise<void> {
	if (!interaction.inCachedGuild()) {
		await interaction
			.reply({
				content: "This command can only be used in a server.",
				flags: MessageFlags.Ephemeral,
			})
			.catch(() => {});
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
			.reply({
				content: "This command is outdated or improperly configured.",
				flags: MessageFlags.Ephemeral,
			})
			.catch(() => {});
		return;
	}

	if (!canBotSendMessages(interaction.channel)) {
		await interaction
			.reply({
				content: "I don't have permission to send messages in this channel.",
				flags: MessageFlags.Ephemeral,
			})
			.catch(() => {});
		return;
	}

	const ctx = new SlashCommandContext(client, interaction);
	const result = await runMiddlewares(ctx, command);

	if (!result.ok) {
		const container = errorContainer(result.error.title, result.error.description);
		await interaction
			.reply({ components: [container], flags: MessageFlags.IsComponentsV2 })
			.catch(() => {});
		return;
	}

	try {
		if (!command.shouldNotDefer) {
			await interaction.deferReply();
		}
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

		if (interaction.deferred || interaction.replied) {
			await interaction
				.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 })
				.catch(() => {});
		} else {
			await interaction
				.reply({ components: [container], flags: MessageFlags.IsComponentsV2 })
				.catch(() => {});
		}
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
