import {drizzle, PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export type DrizzleDatabase = PostgresJsDatabase<typeof schema>;

const globalForDrizzle = globalThis as unknown as {
    drizzleClient?: postgres.Sql;
};

function createConnection(): postgres.Sql {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            'DATABASE_URL is not set — add the Supabase Postgres connection string to .env.local',
        );
    }

    // prepare:false is required for Supabase transaction-mode poolers (pgbouncer).
    return postgres(connectionString, {prepare: false});
}

const client = globalForDrizzle.drizzleClient ?? createConnection();

if (process.env.NODE_ENV !== 'production') {
    globalForDrizzle.drizzleClient = client;
}

export const db: DrizzleDatabase = drizzle(client, {schema});
