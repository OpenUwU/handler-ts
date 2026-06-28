import { fail, ok } from "../types/index.js";
import type { MiddlewareFn } from "../types/index.js";
import { permissionName } from "../utils/permissions.js";

export function userPermissions(...permissions: bigint[]): MiddlewareFn {
	return (ctx) => {
		const missing = permissions.filter((permission) => !ctx.member.permissions.has(permission));

		if (missing.length) {
			return fail(
				"Insufficient Permissions",
				`You need the following permission(s): \`${missing.map(permissionName).join(", ")}\``,
			);
		}

		return ok();
	};
}
