import React from 'react';

import {Card} from '@/admin/components/card/card';
import {CardHeader} from '@/admin/components/card/card-header';
import {Locale} from '@/types/locale';

import {MessageRow} from './message-row';
import {locales, MessageRow as MessageRowData, MessageValues, namespaceTitles} from './messages-form-model';

type Props = {
    namespace: string;
    rows: MessageRowData[];
    draft: MessageValues;
    saved: MessageValues;
    onChange: (locale: Locale, id: string, value: string) => void;
};

// One card per translation namespace, with every one of its keys as a row.
export function MessageNamespaceCard({namespace, rows, draft, saved, onChange}: Props) {
    return (
        <Card padding="lg" className="mb-6">
            <CardHeader
                title={namespaceTitles[namespace] ?? namespace}
                description={`${namespace} · ${rows.length}`}
            />
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)] gap-3 border-b border-slate-100 pb-2 text-[11px]/4 font-medium tracking-wide text-slate-400 uppercase lg:grid dark:border-slate-800">
                <span>Klucz</span>
                {locales.map((locale) => (
                    <span key={locale}>{locale}</span>
                ))}
            </div>
            {rows.map((row) => (
                <MessageRow
                    key={row.id}
                    row={row}
                    draft={draft}
                    saved={saved}
                    onChange={onChange}
                />
            ))}
        </Card>
    );
}
