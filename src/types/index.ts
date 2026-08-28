/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777
 * github.com/openUwU/
 */

export type { Command, CommandName, SlashCommandData } from "./command.js";
export { defineCommand } from "./command.js";
export type { DiscordEvent } from "./event.js";
export { defineEvent } from "./event.js";
export type {
	MiddlewareCheck,
	MiddlewareError,
	MiddlewareFn,
	MiddlewareResult,
} from "./middleware.js";
export { fail, ok, withLabel } from "./middleware.js";
