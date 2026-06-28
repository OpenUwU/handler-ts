/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelSelectMenuBuilder,
	ContainerBuilder,
	type MessageActionRowComponentBuilder,
	RoleSelectMenuBuilder,
	SectionBuilder,
	type SelectMenuComponentOptionData,
	SeparatorBuilder,
	SeparatorSpacingSize,
	StringSelectMenuBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
	UserSelectMenuBuilder,
} from "discord.js";
import { config } from "../config/config.js";
export function errorContainer(title: string, description: string): ContainerBuilder {
	return new ContainerBuilder()
		.setAccentColor(config.colors.error)
		.addTextDisplayComponents(TextDisplay(title))
		.addSeparatorComponents(Separator())
		.addTextDisplayComponents(TextDisplay(`>>> ${description}`));
}

export function successContainer(): ContainerBuilder {
	return new ContainerBuilder().setAccentColor(config.colors.success);
}
export function clientContainer(): ContainerBuilder {
	return new ContainerBuilder().setAccentColor(config.colors.default);
}
export function baseContainer(): ContainerBuilder {
	return new ContainerBuilder();
}
export function baseSection(): SectionBuilder {
	return new SectionBuilder();
}

export function TextDisplay(content: string): TextDisplayBuilder {
	return new TextDisplayBuilder().setContent(content);
}

export function Thumbnail(description: string, url: string): ThumbnailBuilder {
	return new ThumbnailBuilder().setDescription(description).setURL(url);
}

export function Separator(
	divider = true,
	size: SeparatorSpacingSize = SeparatorSpacingSize.Small,
): SeparatorBuilder {
	return new SeparatorBuilder().setDivider(divider).setSpacing(size);
}

export function baseButton(): ButtonBuilder {
	return new ButtonBuilder();
}

export function linkButton(label: string, url: string): ButtonBuilder {
	return new ButtonBuilder().setLabel(label).setURL(url).setStyle(ButtonStyle.Link);
}

export function primaryButton(label: string, customId: string, disabled = false): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(label)
		.setStyle(ButtonStyle.Primary)
		.setCustomId(customId)
		.setDisabled(disabled);
}

export function secondaryButton(label: string, customId: string, disabled = false): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(label)
		.setStyle(ButtonStyle.Secondary)
		.setCustomId(customId)
		.setDisabled(disabled);
}

export function successButton(label: string, customId: string, disabled = false): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(label)
		.setStyle(ButtonStyle.Success)
		.setCustomId(customId)
		.setDisabled(disabled);
}

export function dangerButton(label: string, customId: string, disabled = false): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(label)
		.setStyle(ButtonStyle.Danger)
		.setCustomId(customId)
		.setDisabled(disabled);
}

export function ActionRow(): ActionRowBuilder<MessageActionRowComponentBuilder> {
	return new ActionRowBuilder<MessageActionRowComponentBuilder>();
}

export function SelectMenu(
	placeholder: string,
	options: SelectMenuComponentOptionData[],
	customId: string,
	min: number,
	max: number,
	disabled = false,
): StringSelectMenuBuilder {
	return new StringSelectMenuBuilder()
		.setPlaceholder(placeholder)
		.addOptions(options)
		.setDisabled(disabled)
		.setCustomId(customId)
		.setMinValues(min)
		.setMaxValues(max);
}

export function UserSelectMenu(
	placeholder: string,
	customId: string,
	min: number,
	max: number,
	defaultUsers: string[],
	disabled = false,
): UserSelectMenuBuilder {
	return new UserSelectMenuBuilder()
		.setDisabled(disabled)
		.setCustomId(customId)
		.setPlaceholder(placeholder)
		.setDefaultUsers(defaultUsers)
		.setMaxValues(max)
		.setMinValues(min);
}

export function RoleSelectMenu(
	placeholder: string,
	customId: string,
	min: number,
	max: number,
	defaultRoles: string[],
	disabled = false,
): RoleSelectMenuBuilder {
	return new RoleSelectMenuBuilder()
		.setDisabled(disabled)
		.setCustomId(customId)
		.setPlaceholder(placeholder)
		.setDefaultRoles(defaultRoles)
		.setMaxValues(max)
		.setMinValues(min);
}

export function ChannelSelectMenu(
	placeholder: string,
	customId: string,
	min: number,
	max: number,
	defaultChannels: string[],
	disabled = false,
): ChannelSelectMenuBuilder {
	return new ChannelSelectMenuBuilder()
		.setDisabled(disabled)
		.setCustomId(customId)
		.setPlaceholder(placeholder)
		.setDefaultChannels(defaultChannels)
		.setMaxValues(max)
		.setMinValues(min);
}
