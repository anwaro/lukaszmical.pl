'use client';

import React, {useMemo, useState} from 'react';

import {Form, Formik} from 'formik';
import {Save} from 'lucide-react';

import {EntryInput} from '@/types/entry';
import {Locale} from '@/types/locale';
import {Card} from '@/admin/components/card/card';
import Divider from '@/admin/components/divider';
import {Button} from '@/admin/components/button/button';
import {SegmentedControl} from '@/admin/components/segmented-control/segmented-control';
import {Badge} from '@/admin/components/badge/badge';
import {noticeDangerClassName} from '@/admin/components/notice-class-name';

import {EntryFields} from './entry/entry-fields';
import {entryFormCoverPlaceholder, entryFormInitialValues} from './entry-form-model';

type Props = {
    initialState: EntryInput;
    onSubmit: (values: EntryInput) => void;
    isPending?: boolean;
    // The last submit was stored.
    saved?: boolean;
    error?: string;
};

export function EntryForm({initialState, onSubmit, isPending, error, saved}: Props) {
    const [locale, setLocale] = useState<Locale>('pl');
    const placeholder = useMemo(
        () => entryFormCoverPlaceholder(initialState),
        [initialState],
    );

    return (
        <Formik
            initialValues={entryFormInitialValues(initialState)}
            onSubmit={onSubmit}
        >
            <Form>
                <Card padding="lg">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Pola z oznaczeniem języka edytujesz osobno dla każdej
                            wersji.
                        </p>
                        <SegmentedControl
                            label="Język treści"
                            hideLabel
                            size="sm"
                            className="w-40"
                            value={locale}
                            onChange={setLocale}
                            options={[
                                {
                                    value: 'pl',
                                    label: 'PL',
                                    title: 'Edytuj teksty po polsku',
                                },
                                {
                                    value: 'en',
                                    label: 'EN',
                                    title: 'Edytuj teksty po angielsku',
                                },
                            ]}
                        />
                    </div>
                    <EntryFields locale={locale} placeholder={placeholder} />

                    <Divider />

                    {error && <p className={noticeDangerClassName('mb-4')}>{error}</p>}

                    <div className="flex items-center justify-end gap-3">
                        {saved && !error && !isPending && (
                            <Badge tone="success">Zapisano</Badge>
                        )}
                        <Button type="submit" icon={Save} loading={isPending}>
                            {isPending ? 'Zapisywanie…' : 'Zapisz'}
                        </Button>
                    </div>
                </Card>
            </Form>
        </Formik>
    );
}
