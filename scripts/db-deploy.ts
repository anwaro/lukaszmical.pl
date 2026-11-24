// Brings the database in line with the code. Runs before `next build` on
// Vercel (see vercel.json) and locally via `pnpm db:deploy`.
//
//   1. migrations — applies the SQL files from `drizzle/` that are not applied yet
//   2. messages   — the message files say which keys exist: missing ones are
//                   added with the file value, obsolete ones are removed and
//                   values already stored are left alone
//
// Usage:
//   pnpm db:deploy             # both steps
//   pnpm db:sync-messages      # messages only
//
// On Vercel only production deployments touch the database — a preview build
// of a branch must not migrate or prune the database the live site reads.

import {drizzle} from 'drizzle-orm/postgres-js';
import {migrate} from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import {loadFileMessages} from '@/services/content/content-messages';
import {messageRows, planMessageSync} from '@/services/content/message-sync';
import {MessageRepository} from '@/services/content/repository-message';
import {LocaleList} from '@/types/locale';

async function runMigrations() {
    // DDL needs a direct connection; the pooled URL is the fallback for local use.
    const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
    if (!url) {
        throw new Error('DATABASE_URL is not set');
    }

    const client = postgres(url, {max: 1, onnotice: () => {}});
    try {
        await migrate(drizzle(client), {migrationsFolder: 'drizzle'});
    } finally {
        await client.end();
    }
    console.log('migrations: up to date');
}

async function syncMessages() {
    const repository = new MessageRepository();
    const required = (
        await Promise.all(
            LocaleList.map(async (locale) =>
                messageRows(locale, await loadFileMessages(locale)),
            ),
        )
    ).flat();

    const {missing, obsolete} = planMessageSync(required, await repository.getAll());
    await repository.deleteMany(obsolete);
    await repository.insertMissing(missing);

    console.log(
        `messages: ${required.length} required, ${missing.length} added, ${obsolete.length} removed`,
    );
}

async function main() {
    if (process.env.VERCEL && process.env.VERCEL_ENV !== 'production') {
        console.log(`db-deploy: skipped on a ${process.env.VERCEL_ENV} deployment`);
        return;
    }

    const messagesOnly = process.argv.includes('--only=messages');
    if (!messagesOnly) {
        await runMigrations();
    }
    await syncMessages();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
