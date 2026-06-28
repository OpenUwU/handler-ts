/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { fail, ok } from "../types/index.js";
import type { MiddlewareFn } from "../types/index.js";

const activeCooldowns = new Map<string, number>();

function commandKey(name: string | string[]): string {
	return Array.isArray(name) ? name.join(":") : name;
}

export function cooldown(seconds: number): MiddlewareFn {
	return (ctx, command) => {
		const key = `${commandKey(command.name)}:${ctx.user.id}:${ctx.guild?.id ?? "dm"}`;
		const now = Date.now();
		const expiresAt = activeCooldowns.get(key);

		if (expiresAt && expiresAt > now) {
			const timestamp = Math.floor(expiresAt / 1000);
			return fail("Cooldown", `You can use this command again <t:${timestamp}:R>.`);
		}

		activeCooldowns.set(key, now + seconds * 1000);
		return ok();
	};
}
