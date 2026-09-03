import {existsSync} from 'node:fs';

import {defineConfig} from 'drizzle-kit';

// Local by default (.env.local → Docker Postgres). `db:push:prod` sets
// ENV_FILE=.env.prod to target the production database instead.
const envFile = process.env.ENV_FILE ?? '.env.local';
if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
}

export default defineConfig({
    schema: './src/services/drizzle/schema/index.ts',
    out: './drizzle',
    dialect: 'postgresql',
    schemaFilter: ['public'],
    dbCredentials: {
        url: process.env.DATABASE_URL ?? '',
    },
});
