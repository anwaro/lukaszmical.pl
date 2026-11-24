import {pgTable, primaryKey, text} from 'drizzle-orm/pg-core';

import {locale} from './enums';

// UI strings of the public site (next-intl messages) changed in the admin.
// `key` is a dotted path inside the namespace, e.g. `footer.cv`.
export const messages = pgTable(
    'messages',
    {
        namespace: text('namespace').notNull(),
        key: text('key').notNull(),
        locale: locale('locale').notNull(),
        value: text('value').notNull(),
    },
    (table) => [primaryKey({columns: [table.namespace, table.key, table.locale]})],
);
