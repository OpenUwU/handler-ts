/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { config } from "../config/config.js";
import { fail, ok } from "../types/index.js";
import type { MiddlewareFn } from "../types/index.js";

export function ownerOnly(): MiddlewareFn {
	return (ctx) => {
		if (!config.ownerIds.includes(ctx.user.id)) {
			return fail("Permission Denied", "This is an owner-only command.");
		}
		return ok();
	};
}
