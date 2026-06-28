import path from "node:path";
import { fileURLToPath } from "node:url";
import { ClusterManager, HeartbeatManager } from "discord-hybrid-sharding";
import { config } from "./config/config.js";
import { logger } from "./utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manager = new ClusterManager(path.join(__dirname, "bot.js"), {
	totalShards: "auto",
	mode: "process",
	shardsPerClusters: 2,
	token: config.token,
	respawn: true,
});

manager.extend(
	new HeartbeatManager({
		interval: 2000,
		maxMissedHeartbeats: 5,
	}),
);

manager.on("clusterCreate", (cluster) => {
	logger.info("ClusterManager", `Launched Cluster ${cluster.id} [${cluster.shardList.join(", ")}]`);

	cluster.on("ready", () => logger.success("ClusterManager", `Cluster ${cluster.id} ready`));

	cluster.on("reconnecting", () =>
		logger.warn("ClusterManager", `Cluster ${cluster.id} reconnecting`),
	);

	cluster.on("death", (_childProcess, code) =>
		logger.error("ClusterManager", `Cluster ${cluster.id} died with exit code ${code}`),
	);

	cluster.on("error", (error) =>
		logger.error("ClusterManager", `Cluster ${cluster.id} error`, error),
	);
});

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

manager
	.spawn({ timeout: -1 })
	.then(() => logger.info("ClusterManager", "All clusters launched"))
	.catch((error: unknown) => logger.error("ClusterManager", "Spawn error", error as Error));
