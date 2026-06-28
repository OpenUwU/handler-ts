import {
	ChannelType,
	PermissionFlagsBits,
	type Guild,
	type GuildMember,
	type GuildTextBasedChannel,
	type VoiceBasedChannel,
} from "discord.js";

const permissionNames = new Map<bigint, string>();

for (const [name, value] of Object.entries(PermissionFlagsBits)) {
	if (permissionNames.has(value)) continue;
	permissionNames.set(value, name.replace(/(?=[A-Z])/g, " ").trim());
}

export function permissionName(flag: bigint): string {
	return permissionNames.get(flag) ?? flag.toString();
}

export function canBotSendMessages(channel: GuildTextBasedChannel | null | undefined): boolean {
	const me = channel?.guild.members.me;
	if (!channel || !me) return false;

	const perms = me.permissionsIn(channel);
	return perms.has(PermissionFlagsBits.SendMessages) && perms.has(PermissionFlagsBits.ViewChannel);
}

export function getMissingBotPermissions(
	channel: GuildTextBasedChannel | null | undefined,
	permissions: bigint[],
): string[] {
	const me = channel?.guild.members.me;
	if (!channel || !me) return permissions.map(permissionName);

	const perms = me.permissionsIn(channel);
	return permissions.filter((permission) => !perms.has(permission)).map(permissionName);
}

export function getVoiceChannelMissingPermissions(
	voiceChannel: VoiceBasedChannel | null | undefined,
): string[] {
	const me = voiceChannel?.guild.members.me;
	if (!voiceChannel || !me) return ["View Channel", "Connect", "Speak"];

	const perms = me.permissionsIn(voiceChannel);
	const isStage = voiceChannel.type === ChannelType.GuildStageVoice;
	const missing: string[] = [];

	if (!perms.has(PermissionFlagsBits.ViewChannel)) missing.push("View Channel");
	if (!perms.has(PermissionFlagsBits.Connect)) missing.push("Connect");

	if (isStage) {
		if (!perms.has(PermissionFlagsBits.MuteMembers)) missing.push("Mute Members");
	} else if (!perms.has(PermissionFlagsBits.Speak)) {
		missing.push("Speak");
	}

	return missing;
}

export function isSameVoiceChannel(member: GuildMember, guild: Guild): boolean {
	const botChannel = guild.members.me?.voice.channel;
	const memberChannel = member.voice.channel;

	if (!botChannel) return memberChannel !== null;
	if (!memberChannel) return false;

	return memberChannel.id === botChannel.id;
}
