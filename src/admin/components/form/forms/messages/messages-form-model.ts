import {ContentChanges} from '@/admin/actions/save-content-action';
import {Locale} from '@/types/locale';

// Column order of the editor.
export const locales: Locale[] = ['pl', 'en'];

export const namespaceTitles: Record<string, string> = {
    common: 'Wspólne — nawigacja i stopka',
    caseStudies: 'Case studies',
    projects: 'Projekty',
};

// Values longer than this get a textarea.
const LONG_TEXT = 60;

export type MessageValues = Record<Locale, Record<string, string>>;

export type MessageRow = {id: string; namespace: string; key: string};

// The files define the keys, so both languages list the same ones.
export function buildMessageRows(messages: MessageValues): MessageRow[] {
    const ids = new Set(locales.flatMap((locale) => Object.keys(messages[locale])));
    return [...ids].sort().map((id) => {
        const [namespace, ...rest] = id.split('.');
        return {id, namespace, key: rest.join('.')};
    });
}

export function buildMessageChanges(
    rows: MessageRow[],
    draft: MessageValues,
    saved: MessageValues,
): ContentChanges {
    const result: ContentChanges = {messages: []};
    for (const row of rows) {
        for (const locale of locales) {
            const value = draft[locale][row.id] ?? '';
            if (value !== (saved[locale][row.id] ?? '')) {
                result.messages.push({
                    namespace: row.namespace,
                    key: row.key,
                    locale,
                    value,
                });
            }
        }
    }
    return result;
}

// Rows matching the filter, grouped by namespace in encounter order.
export function buildMessageGroups(
    rows: MessageRow[],
    filter: string,
    saved: MessageValues,
): [string, MessageRow[]][] {
    const query = filter.trim().toLowerCase();
    const visible = rows.filter(
        (row) =>
            !query ||
            row.id.toLowerCase().includes(query) ||
            locales.some((locale) =>
                // Saved texts, so a row does not vanish while it is edited.
                (saved[locale][row.id] ?? '').toLowerCase().includes(query),
            ),
    );
    const byNamespace = new Map<string, MessageRow[]>();
    for (const row of visible) {
        byNamespace.set(row.namespace, [...(byNamespace.get(row.namespace) ?? []), row]);
    }
    return [...byNamespace];
}

export function isMessageRowMultiline(row: MessageRow, saved: MessageValues): boolean {
    return locales.some((locale) => (saved[locale][row.id] ?? '').length > LONG_TEXT);
}

export function setMessageValue(
    draft: MessageValues,
    locale: Locale,
    id: string,
    value: string,
): MessageValues {
    return {...draft, [locale]: {...draft[locale], [id]: value}};
}
