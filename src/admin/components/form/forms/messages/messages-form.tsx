'use client';

import React, {useMemo, useState, useTransition} from 'react';

import {Save} from 'lucide-react';

import {saveContentAction, SaveContentResult} from '@/admin/actions/save-content-action';
import {Button} from '@/admin/components/button/button';
import {Badge} from '@/admin/components/badge/badge';
import {Card} from '@/admin/components/card/card';
import {fieldInputClassName} from '@/admin/components/form/field-input-class-name';
import {Locale} from '@/types/locale';

import {MessageNamespaceCard} from './message-namespace-card';
import {
    buildMessageChanges,
    buildMessageGroups,
    buildMessageRows,
    MessageValues,
    setMessageValue,
} from './messages-form-model';

type Props = {
    // Effective values (CMS over file defaults), keyed by `namespace.key`.
    messages: MessageValues;
};

// Every message of the site: one card per namespace, one row per key, both
// languages next to each other.
export function MessagesForm({messages}: Props) {
    const [saved, setSaved] = useState(messages);
    const [draft, setDraft] = useState(messages);
    const [filter, setFilter] = useState('');

    const [state, setState] = useState<SaveContentResult>({status: undefined});
    const [isPending, startTransition] = useTransition();

    const rows = useMemo(() => buildMessageRows(messages), [messages]);
    const changes = useMemo(
        () => buildMessageChanges(rows, draft, saved),
        [rows, draft, saved],
    );
    const changeCount = changes.messages.length;
    const groups = useMemo(
        () => buildMessageGroups(rows, filter, saved),
        [rows, filter, saved],
    );

    const setValue = (locale: Locale, id: string, value: string) =>
        setDraft((current) => setMessageValue(current, locale, id, value));

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
            <div className="sticky top-14 z-20 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
                <input
                    type="search"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    placeholder="np. footer"
                    aria-label="Filtruj po kluczu lub tekście"
                    className={fieldInputClassName('max-w-sm')}
                />
                <div className="flex items-center gap-3">
                    {state.status === 'error' && (
                        <Badge tone="danger">{state.error}</Badge>
                    )}
                    {state.status === 'success' && changeCount === 0 && (
                        <Badge tone="success">Zapisano</Badge>
                    )}
                    {changeCount > 0 && (
                        <Badge tone="warning">
                            <span className="tabular-nums">{changeCount}</span>{' '}
                            niezapisanych
                        </Badge>
                    )}
                    <Button
                        type="submit"
                        icon={Save}
                        loading={isPending}
                        disabled={!changeCount || isPending}
                    >
                        {isPending ? 'Zapisywanie…' : 'Zapisz zmiany'}
                    </Button>
                </div>
            </div>

            {groups.length === 0 && (
                <Card className="py-10 text-center text-slate-500 dark:text-slate-400">
                    Żaden tekst nie pasuje do filtra.
                </Card>
            )}

            {groups.map(([namespace, items]) => (
                <MessageNamespaceCard
                    key={namespace}
                    namespace={namespace}
                    rows={items}
                    draft={draft}
                    saved={saved}
                    onChange={setValue}
                />
            ))}
        </form>
    );
}
