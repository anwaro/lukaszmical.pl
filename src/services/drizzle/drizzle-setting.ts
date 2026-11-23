import {sql} from 'drizzle-orm';

import {db} from './drizzle-client';
import {Setting, settings} from './schema';

export class DrizzleSetting {
    async getAll(): Promise<Setting[]> {
        return db.select().from(settings);
    }

    async upsertMany(rows: Setting[]): Promise<void> {
        if (!rows.length) {
            return;
        }
        await db
            .insert(settings)
            .values(rows)
            .onConflictDoUpdate({
                target: settings.key,
                set: {value: sql`excluded.value`},
            });
    }
}
