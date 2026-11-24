import {Locale} from '@/types/locale';

export type MessageTree = {[key: string]: string | MessageTree};
export type FlatMessages = Record<string, string>;

export const messageNamespaces = [
    'common',
    'caseStudies',
    'projects',
] as const;

// Default messages shipped with the code. The CMS (`translations` table)
// overrides them key by key, so a new key works before anyone edits it.
export async function loadFileMessages(locale: Locale): Promise<MessageTree> {
    const entries = await Promise.all(
        messageNamespaces.map(async (name) => [
            name,
            (await import(`../../../messages/${locale}/${name}.json`)).default,
        ]),
    );
    return Object.fromEntries(entries);
}

// {a: {b: 'x'}} -> {'a.b': 'x'}
export function flattenMessages(tree: MessageTree, prefix = ''): FlatMessages {
    const flat: FlatMessages = {};
    for (const [key, value] of Object.entries(tree)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'string') {
            flat[path] = value;
        } else {
            Object.assign(flat, flattenMessages(value, path));
        }
    }
    return flat;
}

// Writes `value` at a dotted `path`, replacing any conflicting leaf on the way.
export function setMessage(tree: MessageTree, path: string, value: string): void {
    const parts = path.split('.');
    let node = tree;
    for (const part of parts.slice(0, -1)) {
        const next = node[part];
        if (typeof next !== 'object') {
            node[part] = {};
        }
        node = node[part] as MessageTree;
    }
    node[parts[parts.length - 1]] = value;
}
