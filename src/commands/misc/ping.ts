import { Middleware } from "../../middlewares/index.js";
import { defineCommand } from "../../types/index.js";

export default defineCommand({
	name: "ping",
	aliases: ["latency", "pong"],
	description: "Check the bot latency",
	category: "misc",
	enabledSlash: true,
	slashData: {
		name: "ping",
		description: "Check the bot latency",
	},
	middleware: [Middleware.Cooldown(5)],
	async execute(ctx) {
		const start = Date.now();
		await ctx.reply({ content: "Pinging..." });

		const latency = Date.now() - start;
		const wsPing = Math.round(ctx.client.ws.ping);

		await ctx.editReply({
			content: `Latency: ${latency}ms\nWebSocket: ${wsPing}ms`,
		});
	},
});
