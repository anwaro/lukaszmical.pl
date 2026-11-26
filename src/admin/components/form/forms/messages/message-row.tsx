import React from 'react';

import {fieldInputClassName} from '@/admin/components/form/field-input-class-name';
import {Locale} from '@/types/locale';

import {
    isMessageRowMultiline,
    locales,
    MessageRow as MessageRowData,
    MessageValues,
} from './messages-form-model';

type Props = {
    row: MessageRowData;
    draft: MessageValues;
    saved: MessageValues;
    onChange: (locale: Locale, id: string, value: string) => void;
};

// One message key: its name, then its value in every locale, side by side.
export function MessageRow({row, draft, saved, onChange}: Props) {
    const multiline = isMessageRowMultiline(row, saved);

    return (
        <div className="grid grid-cols-1 gap-x-3 gap-y-2 border-b border-slate-100 py-3 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)] dark:border-slate-800">
            <span className="pt-2.5 font-mono text-xs break-all text-slate-700 dark:text-slate-300">
                {row.key}
            </span>
            {locales.map((locale) => {
                const value = draft[locale][row.id] ?? '';
                const changed = value !== (saved[locale][row.id] ?? '');
                const props = {
                    value,
                    'aria-label': `${row.id} (${locale.toUpperCase()})`,
                    placeholder: locale.toUpperCase(),
                    className: fieldInputClassName(changed && 'border-amber-500'),
                    onChange: (
                        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                    ) => onChange(locale, row.id, event.target.value),
                };
                return multiline ? (
                    <textarea key={locale} rows={3} {...props} />
                ) : (
                    <input key={locale} {...props} />
                );
            })}
        </div>
    );
}
