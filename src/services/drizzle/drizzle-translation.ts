import {sql} from 'drizzle-orm';

import {db} from './drizzle-client';
import {Translation, TranslationInsert, translations} from './schema';

export class DrizzleTranslation {
    async getAll(): Promise<Translation[]> {
        return db.select().from(translations);
    }

    async upsertMany(rows: TranslationInsert[]): Promise<void> {
        if (!rows.length) {
            return;
        }
        await db
            .insert(translations)
            .values(rows)
            .onConflictDoUpdate({
                target: [
                    translations.namespace,
                    translations.key,
                    translations.locale,
                ],
                set: {value: sql`excluded.value`},
            });
    }
}
