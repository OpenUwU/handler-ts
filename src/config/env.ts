/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { z } from "zod";

const envSchema = z.object({
	DISCORD_TOKEN: z.string().min(1),
	DISCORD_CLIENT_ID: z.string().min(1),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PREFIX: z.string().min(1).default("11"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
	const parsed = envSchema.safeParse(process.env);

	if (!parsed.success) {
		console.error("Invalid environment variables");
		console.error(z.flattenError(parsed.error));
		process.exit(1);
	}

	return parsed.data;
}

export const env = loadEnv();
