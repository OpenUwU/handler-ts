/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { env } from "./env.js";

export const config = {
	token: env.DISCORD_TOKEN,
	clientId: env.DISCORD_CLIENT_ID,
	environment: env.NODE_ENV,
	isProduction: env.NODE_ENV === "production",
	prefix: env.PREFIX,
	ownerIds: ["931059762173464597"] as string[],
	colors: {
		default: 0x5865f2,
		success: 0x2ecc71,
		error: 0xed4245,
		warn: 0xfee75c,
	},
	logging: {
		level: env.NODE_ENV === "production" ? ("info" as const) : ("debug" as const),
		dir: "logs",
		maxFiles: 10,
		timezone: "Asia/Kolkata",
	},
} as const;

export type Config = typeof config;
