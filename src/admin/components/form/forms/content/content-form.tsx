'use client';

import React, {useMemo, useState, useTransition} from 'react';

import {clsx} from 'clsx';
import {mdiSend, mdiWeb} from '@mdi/js';

import {
    ContentChanges,
    saveContentAction,
    SaveContentResult,
} from '@/admin/actions/save-content-action';
import {Button} from '@/admin/components/button/button';
import ButtonsGroup from '@/admin/components/button/buttons-group';
import CardBox from '@/admin/components/CardBox';
import {FormField} from '@/admin/components/form/form-field/form-field';
import {ProjectLocale, ProjectLocalesList} from '@/types/project';

export type ContentField = {
    label: string;
    help?: string;
    multiline?: boolean;
} & (
    | {kind: 'message'; namespace: string; key: string}
    | {kind: 'setting'; key: string}
);

export type ContentGroup = {
    title: string;
    fields: ContentField[];
};

type Props = {
    groups: ContentGroup[];
    // Effective values (CMS over file defaults), keyed by `namespace.key`.
    messages: Record<ProjectLocale, Record<string, string>>;
    settings: Record<string, string>;
};

const messageId = (field: {namespace: string; key: string}) =>
    `${field.namespace}.${field.key}`;

export function ContentForm({groups, messages, settings}: Props) {
    const [locale, setLocale] = useState<ProjectLocale>('pl');
    const [saved, setSaved] = useState({messages, settings});
    const [draft, setDraft] = useState({messages, settings});

    const [state, setState] = useState<SaveContentResult>({status: undefined});
    const [isPending, startTransition] = useTransition();

    const changes = useMemo((): ContentChanges => {
        const result: ContentChanges = {messages: [], settings: []};
        for (const group of groups) {
            for (const field of group.fields) {
                if (field.kind === 'setting') {
                    const value = draft.settings[field.key] ?? '';
                    if (value !== (saved.settings[field.key] ?? '')) {
                        result.settings.push({key: field.key, value});
                    }
                    continue;
                }
                const id = messageId(field);
                for (const item of ProjectLocalesList) {
                    const value = draft.messages[item][id] ?? '';
                    if (value !== (saved.messages[item][id] ?? '')) {
                        result.messages.push({
                            namespace: field.namespace,
                            key: field.key,
                            locale: item,
                            value,
                        });
                    }
                }
            }
        }
        return result;
    }, [groups, draft, saved]);

    const changeCount = changes.messages.length + changes.settings.length;

    const setMessage = (id: string, value: string) =>
        setDraft((current) => ({
            ...current,
            messages: {
                ...current.messages,
                [locale]: {...current.messages[locale], [id]: value},
            },
        }));

    const setSetting = (key: string, value: string) =>
        setDraft((current) => ({
            ...current,
            settings: {...current.settings, [key]: value},
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
                <ButtonsGroup noWrap>
                    {(['pl', 'en'] as const).map((item) => (
                        <Button
                            key={item}
                            color="white"
                            className={clsx(locale !== item && 'opacity-50')}
                            onClick={() => setLocale(item)}
                            icon={mdiWeb}
                            title={`Edit ${item.toUpperCase()} texts`}
                            type={'button'}
                            label={item.toUpperCase()}
                            small
                        />
                    ))}
                </ButtonsGroup>
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

            {groups.map((group) => (
                <CardBox key={group.title} className="mb-6">
                    <h2 className="mb-6 text-xl font-bold">{group.title}</h2>
                    {group.fields.map((field) => {
                        const isMessage = field.kind === 'message';
                        const id = isMessage ? messageId(field) : field.key;
                        const value = isMessage
                            ? (draft.messages[locale][id] ?? '')
                            : (draft.settings[field.key] ?? '');
                        const onChange = (
                            event: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                            >,
                        ) =>
                            isMessage
                                ? setMessage(id, event.target.value)
                                : setSetting(field.key, event.target.value);

                        return (
                            <FormField
                                key={`${field.kind}:${id}`}
                                label={field.label}
                                labelFor={`${field.kind}:${id}`}
                                help={field.help}
                                locale={isMessage ? locale : undefined}
                                hasTextareaHeight={field.multiline}
                            >
                                {field.multiline ? (
                                    <textarea
                                        id={`${field.kind}:${id}`}
                                        value={value}
                                        onChange={onChange}
                                    />
                                ) : (
                                    <input
                                        id={`${field.kind}:${id}`}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            </FormField>
                        );
                    })}
                </CardBox>
            ))}
        </form>
    );
}
