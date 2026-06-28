/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import type {
	EmbedBuilder,
	ActionRowBuilder,
	MessageActionRowComponentBuilder,
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SectionBuilder,
	MediaGalleryBuilder,
	FileBuilder,
	MessageFlagsResolvable,
	MessageMentionOptions,
} from "discord.js";

type TopLevelComponentBuilder =
	| ActionRowBuilder<MessageActionRowComponentBuilder>
	| ContainerBuilder
	| TextDisplayBuilder
	| SeparatorBuilder
	| SectionBuilder
	| MediaGalleryBuilder
	| FileBuilder;

export interface ContextReplyOptions {
	content?: string;
	embeds?: EmbedBuilder[];
	components?: TopLevelComponentBuilder[];
	allowedMentions?: MessageMentionOptions;
	flags?: MessageFlagsResolvable;
}
