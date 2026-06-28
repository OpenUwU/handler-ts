import type { Command } from "./command.js";
import type { CommandContext } from "../structures/context/index.js";

export interface MiddlewareError {
	title: string;
	description: string;
}

export type MiddlewareResult =
	| { ok: true }
	| { ok: false; error: MiddlewareError; ephemeral?: boolean };

export type MiddlewareFn = (
	ctx: CommandContext,
	command: Command,
) => MiddlewareResult | Promise<MiddlewareResult>;

export function ok(): MiddlewareResult {
	return { ok: true };
}

export function fail(title: string, description: string, ephemeral = true): MiddlewareResult {
	return { ok: false, error: { title, description }, ephemeral };
}
