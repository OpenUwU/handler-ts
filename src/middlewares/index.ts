/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777
 * github.com/openUwU/
 */

import { botPermissions } from "./botPermissions.js";
import { cooldown } from "./cooldown.js";
import { guildOnly } from "./guildOnly.js";
import { ownerOnly } from "./ownerOnly.js";
import { premiumRequired } from "./premium.js";
import { sameVoiceChannel } from "./sameVoiceChannel.js";
import { userPermissions } from "./userPermissions.js";
import { voiceRequired } from "./voiceRequired.js";

export const Middleware = {
	OwnerOnly: ownerOnly,
	GuildOnly: guildOnly,
	UserPermissions: userPermissions,
	BotPermissions: botPermissions,
	VoiceRequired: voiceRequired,
	SameVoiceChannel: sameVoiceChannel,
	Cooldown: cooldown,
	Premium: premiumRequired,
} as const;
