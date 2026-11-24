import {drizzle, PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
    dbClient?: postgres.Sql;
};

function createConnection(): postgres.Sql {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            'DATABASE_URL is not set — add the Postgres connection string to .env.local',
        );
    }

    // prepare:false is required for transaction-mode poolers (pgbouncer),
    // e.g. the pooled Vercel Postgres (Neon) connection.
    return postgres(connectionString, {prepare: false});
}

const client = globalForDb.dbClient ?? createConnection();

if (process.env.NODE_ENV !== 'production') {
    globalForDb.dbClient = client;
}

export const db: Database = drizzle(client, {schema});
