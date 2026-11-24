import {existsSync} from 'node:fs';

import {defineConfig} from 'drizzle-kit';

// Local by default (.env.local → Docker Postgres); ENV_FILE points at another
// env file. Schema changes need a direct connection, so the unpooled URL wins.
const envFile = process.env.ENV_FILE ?? '.env.local';
if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
}

export default defineConfig({
    schema: './src/services/db/schema/index.ts',
    out: './drizzle',
    dialect: 'postgresql',
    schemaFilter: ['public'],
    dbCredentials: {
        url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '',
    },
});
