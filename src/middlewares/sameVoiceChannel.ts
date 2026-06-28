/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { fail, ok } from "../types/index.js";
import type { MiddlewareFn } from "../types/index.js";
import { isSameVoiceChannel } from "../utils/permissions.js";

export function sameVoiceChannel(): MiddlewareFn {
	return (ctx) => {
		if (!isSameVoiceChannel(ctx.member, ctx.guild)) {
			return fail(
				"Same Voice Channel Required",
				"You must be in the same voice channel as the bot to use this command.",
			);
		}
		return ok();
	};
}
