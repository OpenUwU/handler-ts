/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777
 * github.com/openUwU/
 */

import { BaseStore } from "../store.js";

export interface GuildRow {
	id: string;
	created_at: Date;
	updated_at: Date;
}

export interface Guild {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

function fromRow(row: GuildRow): Guild {
	return {
		id: row.id,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

function defaults(id: string): Guild {
	return {
		id,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

function buildUpsert(entity: Guild): [string, unknown[]] {
	const sql = `
		INSERT INTO guilds (
			id, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
		ON CONFLICT (id) DO UPDATE SET
			updated_at = NOW()
		RETURNING *
	`;

	const values = [entity.id];

	return [sql, values];
}

export const guildStore = new BaseStore<GuildRow, Guild, "id">({
	table: "guilds",
	keyPrefix: "guild",
	primaryKey: "id",
	fromRow,
	buildUpsert,
});

export async function ensureGuild(id: string): Promise<Guild> {
	return guildStore.getOrCreate(id, () => defaults(id));
}
