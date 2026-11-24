import {and, eq, or, sql} from 'drizzle-orm';

import {db} from '@/services/db/db-client';
import {messages} from '@/services/db/schema';
import {Locale} from '@/types/locale';

export type MessageId = {
    namespace: string;
    key: string;
    locale: Locale;
};

export type StoredMessage = MessageId & {value: string};

// Access to the UI strings changed in the admin.
export class MessageRepository {
    async getAll(): Promise<StoredMessage[]> {
        return db.select().from(messages);
    }

    // Adds rows that are not stored yet; stored values are left as they are.
    async insertMissing(rows: StoredMessage[]): Promise<void> {
        if (!rows.length) {
            return;
        }
        await db.insert(messages).values(rows).onConflictDoNothing();
    }

    async deleteMany(ids: MessageId[]): Promise<void> {
        if (!ids.length) {
            return;
        }
        await db.delete(messages).where(
            or(
                ...ids.map((id) =>
                    and(
                        eq(messages.namespace, id.namespace),
                        eq(messages.key, id.key),
                        eq(messages.locale, id.locale),
                    ),
                ),
            ),
        );
    }

    async upsertMany(rows: StoredMessage[]): Promise<void> {
        if (!rows.length) {
            return;
        }
        await db
            .insert(messages)
            .values(rows)
            .onConflictDoUpdate({
                target: [messages.namespace, messages.key, messages.locale],
                set: {value: sql`excluded.value`},
            });
    }
}
