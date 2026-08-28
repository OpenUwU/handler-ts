/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777
 * github.com/openUwU/
 */

export { closePool, getPool, query, queryOne } from "./pg.js";
export { closeRedis, getRedis } from "./redis.js";
export type { StoreConfig } from "./store.js";
export { BaseStore } from "./store.js";

import { logger } from "../utils/logger.js";
import { closePool } from "./pg.js";
import { closeRedis } from "./redis.js";
import { guildStore } from "./stores/guild.js";
import { serverPremiumStore } from "./stores/serverPremium.js";
import { userPremiumStore } from "./stores/userPremium.js";

export async function hydrateAll(): Promise<void> {
	logger.info("DBMS", "hydrating all stores");
	const start = Date.now();

	await Promise.all([
		guildStore.hydrate(),
		userPremiumStore.hydrate(),
		serverPremiumStore.hydrate(),
	]);
	logger.info("DBMS", `hydrated all stores in ${Date.now() - start}ms`);
}

export async function teardown(): Promise<void> {
	await Promise.allSettled([closePool(), closeRedis()]);
	logger.info("DBMS", "connection teardown complete");
}
