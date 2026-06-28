/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777 and @mooncarli
 * github.com/openUwU/
 */

import { fail, ok } from "../types/index.js";
import type { MiddlewareFn } from "../types/index.js";
import { getMissingBotPermissions } from "../utils/permissions.js";

export function botPermissions(...permissions: bigint[]): MiddlewareFn {
	return (ctx) => {
		const missing = getMissingBotPermissions(ctx.channel, permissions);

		if (missing.length) {
			return fail(
				"Missing Bot Permissions",
				`I need the following permission(s): \`${missing.join(", ")}\``,
			);
		}

		return ok();
	};
}
