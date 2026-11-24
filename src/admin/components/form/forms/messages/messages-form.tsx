'use client';

import React, {useMemo, useState, useTransition} from 'react';

import {mdiSend} from '@mdi/js';

import {
    ContentChanges,
    saveContentAction,
    SaveContentResult,
} from '@/admin/actions/save-content-action';
import {Button} from '@/admin/components/button/button';
import CardBox from '@/admin/components/CardBox';
import {Locale} from '@/types/locale';

type Props = {
    // Effective values (CMS over file defaults), keyed by `namespace.key`.
    messages: Record<Locale, Record<string, string>>;
};

// Column order of the editor.
const locales: Locale[] = ['pl', 'en'];

const namespaceTitles: Record<string, string> = {
    common: 'Common — navigation and footer',
    caseStudies: 'Case studies',
    projects: 'Projects',
};

// Values longer than this get a textarea.
const LONG_TEXT = 60;

const controlClass =
    'w-full max-w-full rounded border border-gray-700 bg-slate-800 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-600 focus:outline-none';

type Row = {id: string; namespace: string; key: string};

// Every message of the site: one card per namespace, one row per key, both
// languages next to each other.
export function MessagesForm({messages}: Props) {
    const [saved, setSaved] = useState(messages);
    const [draft, setDraft] = useState(messages);
    const [filter, setFilter] = useState('');

    const [state, setState] = useState<SaveContentResult>({status: undefined});
    const [isPending, startTransition] = useTransition();

    // The files define the keys, so both languages list the same ones.
    const rows = useMemo((): Row[] => {
        const ids = new Set(locales.flatMap((locale) => Object.keys(messages[locale])));
        return [...ids].sort().map((id) => {
            const [namespace, ...rest] = id.split('.');
            return {id, namespace, key: rest.join('.')};
        });
    }, [messages]);

    const changes = useMemo((): ContentChanges => {
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
    }, [rows, draft, saved]);

    const changeCount = changes.messages.length;

    const groups = useMemo(() => {
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
        const byNamespace = new Map<string, Row[]>();
        for (const row of visible) {
            byNamespace.set(row.namespace, [
                ...(byNamespace.get(row.namespace) ?? []),
                row,
            ]);
        }
        return [...byNamespace];
    }, [rows, filter, saved]);

    const setValue = (locale: Locale, id: string, value: string) =>
        setDraft((current) => ({
            ...current,
            [locale]: {...current[locale], [id]: value},
        }));

    return (
        <form
            action={() =>
                startTransition(async () => {
                    const result = await saveContentAction(state, changes);
                    setState(result);
                    // Keep the edits marked as unsaved when the save failed.
                    if (result.status === 'success') {
                        setSaved(draft);
                    }
                })
            }
        >
            <div className="sticky top-14 z-20 -mx-6 mb-6 flex items-center justify-between gap-4 border-b border-gray-700 bg-slate-800 px-6 py-3">
                <input
                    type="search"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    placeholder="Filter by key or text"
                    aria-label="Filter by key or text"
                    className={`${controlClass} h-10 max-w-sm`}
                />
                <div className="flex items-center gap-4">
                    {state.status === 'error' && (
                        <span className="text-sm text-red-400">{state.error}</span>
                    )}
                    {state.status === 'success' && changeCount === 0 && (
                        <span className="text-sm text-emerald-400">Saved</span>
                    )}
                    <Button
                        type="submit"
                        color="info"
                        label={changeCount ? `Save (${changeCount})` : 'Save'}
                        icon={mdiSend}
                        loading={isPending}
                        disabled={!changeCount || isPending}
                    />
                </div>
            </div>

            {groups.length === 0 && (
                <p className="text-slate-400">No message matches the filter.</p>
            )}

            {groups.map(([namespace, items]) => (
                <CardBox key={namespace} className="mb-6">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4">
                        <h2 className="text-xl font-bold">
                            {namespaceTitles[namespace] ?? namespace}
                        </h2>
                        <span className="font-mono text-xs text-slate-400">
                            {namespace} · {items.length}
                        </span>
                    </div>
                    <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)] gap-3 border-b border-gray-700 pb-2 text-xs font-bold text-slate-400 uppercase lg:grid">
                        <span>Key</span>
                        {locales.map((locale) => (
                            <span key={locale}>{locale}</span>
                        ))}
                    </div>
                    {items.map((row) => {
                        const multiline = locales.some(
                            (locale) =>
                                (saved[locale][row.id] ?? '').length > LONG_TEXT,
                        );
                        return (
                            <div
                                key={row.id}
                                className="grid grid-cols-1 gap-x-3 gap-y-2 border-b border-gray-700/60 py-3 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)]"
                            >
                                <span className="pt-2 font-mono text-sm break-all text-slate-300">
                                    {row.key}
                                </span>
                                {locales.map((locale) => {
                                    const value = draft[locale][row.id] ?? '';
                                    const props = {
                                        value,
                                        'aria-label': `${row.id} (${locale.toUpperCase()})`,
                                        placeholder: locale.toUpperCase(),
                                        className: `${controlClass} ${
                                            value !== (saved[locale][row.id] ?? '')
                                                ? 'border-amber-500'
                                                : ''
                                        }`,
                                        onChange: (
                                            event: React.ChangeEvent<
                                                HTMLInputElement | HTMLTextAreaElement
                                            >,
                                        ) => setValue(locale, row.id, event.target.value),
                                    };
                                    return multiline ? (
                                        <textarea key={locale} rows={3} {...props} />
                                    ) : (
                                        <input key={locale} {...props} />
                                    );
                                })}
                            </div>
                        );
                    })}
                </CardBox>
            ))}
        </form>
    );
}
