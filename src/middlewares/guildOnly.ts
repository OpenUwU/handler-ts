import { fail, ok } from "../types/index.js";
import type { MiddlewareFn } from "../types/index.js";

export function guildOnly(): MiddlewareFn {
	return (ctx) => {
		if (!ctx.guild) {
			return fail("Server Only", "This command can only be used inside a server.");
		}
		return ok();
	};
}
