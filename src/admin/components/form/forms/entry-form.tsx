'use client';

import React, {useMemo, useState} from 'react';

import {Field, Form, Formik, useField, useFormikContext} from 'formik';
import dynamic from 'next/dynamic';
import {Image, Save} from 'lucide-react';

import {EntryInput, EntryPresentationList, HOMEPAGE_SLUG} from '@/types/entry';
import {Locale} from '@/types/locale';
import {Card} from '@/admin/components/card/card';
import {FormField} from '@/admin/components/form/form-field/form-field';
import Divider from '@/admin/components/divider';
import {Button} from '@/admin/components/button/button';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {ImageField} from '@/admin/components/form/image-field/image-field';
import {CheckboxFieldGroup} from '@/admin/components/form/checkbox-field/checkbox-field-group';
import {CheckboxField} from '@/admin/components/form/checkbox-field/checkbox-field';
import {SegmentedControl} from '@/admin/components/segmented-control/segmented-control';
import {Badge} from '@/admin/components/badge/badge';
import {noticeDangerClassName} from '@/admin/components/notice-class-name';

const MdxField = dynamic(
    () =>
        import('@/admin/components/form/mdx-field/mdx-field').then(
            (m) => m.MdxField,
        ),
    {
        ssr: false,
        loading: () => <MdxFieldLoader />,
    },
);

type Props = {
    initialState: EntryInput;
    onSubmit: (values: EntryInput) => void;
    isPending?: boolean;
    // The last submit was stored.
    saved?: boolean;
    error?: string;
};

// Edits a string[] field as a comma-separated list.
function ListField({name, ...props}: {name: string; placeholder?: string}) {
    const [field, , helpers] = useField<string[]>(name);
    const [text, setText] = useState((field.value ?? []).join(', '));

    return (
        <input
            {...props}
            value={text}
            onChange={(event) => {
                setText(event.target.value);
                helpers.setValue(
                    event.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                );
            }}
        />
    );
}

// "2026-11-24 13:00:00+00" (database) -> "2026-11-24T13:00:00" (input value).
function toDateTimeLocal(value = ''): string {
    return value.replace(' ', 'T').replace(/(\.\d+)?([+-]\d{2}(:?\d{2})?|Z)$/, '');
}

type FieldsProps = {
    locale: Locale;
    placeholder: string;
};

const contentHelp =
    'MDX z bloków. W trybie edycji biblioteka bloków po prawej wstawia blok w miejscu kursora.';

const presentationLabels: Record<string, string> = {
    article: 'Artykuł',
    app: 'Aplikacja',
    link: 'Link',
};

function EntryFields({locale, placeholder}: FieldsProps) {
    const {values} = useFormikContext<EntryInput>();
    const isPage = values.kind === 'page';
    const isCaseStudy = values.kind === 'case_study';
    const isProject = values.kind === 'project';
    const isArticle = !isProject || values.presentation === 'article';
    const text = (field: string) => `texts.${locale}.${field}`;

    return (
        <>
            <FormField
                label="Slug"
                help={
                    isPage
                        ? `Adres strony: /<slug>. „${HOMEPAGE_SLUG}” to strona główna.`
                        : isCaseStudy
                          ? 'Adres strony: /case-studies/<slug>'
                          : 'Adres strony: /projects/<slug>; dla aplikacji także jej folder w public/projects'
                }
            >
                <Field name="slug" placeholder="slug" />
            </FormField>
            <FormField
                label={
                    isPage
                        ? 'Obraz do udostępniania'
                        : isCaseStudy
                          ? 'Ikona (kwadrat)'
                          : 'Okładka'
                }
                help="Kliknij pole, aby wybrać z biblioteki lub wgrać nowy plik"
                icons={[Image]}
            >
                <ImageField name="cover" placeholder={placeholder} />
            </FormField>
            <FormField label="Pozycja, data utworzenia">
                <Field name="position" type="number" placeholder="Pozycja" />
                <Field
                    step="1"
                    type="datetime-local"
                    name="createdAt"
                    placeholder="Data utworzenia"
                />
            </FormField>
            {isProject && (
                <FormField
                    label="Prezentacja"
                    help="Artykuł — opis z bloków; aplikacja — serwowana z public/projects/<slug>; link — otwiera inny adres"
                >
                    <Field name="presentation" component="select">
                        {EntryPresentationList.map((item) => (
                            <option key={item} value={item}>
                                {presentationLabels[item]}
                            </option>
                        ))}
                    </Field>
                </FormField>
            )}
            {isProject && values.presentation === 'link' && (
                <FormField
                    label="Adres linku"
                    help="Ścieżka w tym serwisie lub pełny adres"
                >
                    <Field name="linkUrl" placeholder="https://example.com" />
                </FormField>
            )}

            <CheckboxFieldGroup>
                <CheckboxField label="Opublikowane">
                    <Field type="checkbox" name="published" />
                </CheckboxField>
                {isProject && (
                    <CheckboxField label="Wyróżnione na stronie głównej">
                        <Field type="checkbox" name="featured" />
                    </CheckboxField>
                )}
                {isProject && values.presentation === 'app' && (
                    <CheckboxField label="Używa myQuery">
                        <Field type="checkbox" name="options.myQuery" />
                    </CheckboxField>
                )}
                {isProject && values.presentation === 'app' && (
                    <CheckboxField label="Używa CSS motywu">
                        <Field type="checkbox" name="options.themeCss" />
                    </CheckboxField>
                )}
            </CheckboxFieldGroup>

            <Divider />

            {!isPage && (
                <FormField label="Stack" help="Po przecinku, np. Next.js, Drizzle">
                    <ListField
                        name="stack"
                        placeholder="Next.js, Drizzle, PostgreSQL"
                    />
                </FormField>
            )}
            {isCaseStudy && (
                <FormField label="Okres, adres serwisu">
                    <Field name="period" placeholder="2023–2025" />
                    <Field name="siteUrl" placeholder="https://example.com" />
                </FormField>
            )}
            {isProject && (
                <FormField label="Rok, adres demo, adres repozytorium">
                    <Field name="period" placeholder="2024" />
                    <Field name="siteUrl" placeholder="Adres demo" />
                    <Field name="repoUrl" placeholder="https://github.com/..." />
                </FormField>
            )}

            {!isPage && <Divider />}

            <FormField
                label={isPage ? 'Tytuł strony' : 'Tytuł'}
                help={
                    isPage
                        ? 'Tytuł karty przeglądarki i wyników wyszukiwania'
                        : undefined
                }
                locale={locale}
            >
                <Field key={locale} name={text('title')} placeholder="Tytuł" />
            </FormField>

            <FormField
                label={isPage ? 'Opis meta' : 'Opis'}
                help="Jedno lub dwa zdania widoczne na listach i w wynikach wyszukiwania"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={text('description')} as="textarea" />
            </FormField>

            {!isPage && (
                <FormField
                    label="Lead"
                    help="Wstęp pod tytułem strony; bez niego użyty jest opis"
                    locale={locale}
                    hasTextareaHeight
                >
                    <Field key={locale} name={text('lead')} as="textarea" />
                </FormField>
            )}

            {isCaseStudy && (
                <>
                    <FormField
                        label="Nagłówek"
                        help="Tytuł karty na stronie głównej, np. „itmbw.pl — serwis biegowy z aplikacją dla biegaczy”"
                        locale={locale}
                    >
                        <Field key={locale} name={text('headline')} />
                    </FormField>
                    <FormField label="Rola" locale={locale}>
                        <Field key={locale} name={text('role')} />
                    </FormField>
                    <FormField
                        label="Problem (karta na stronie głównej)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('problem')} as="textarea" />
                    </FormField>
                    <FormField
                        label="Podejście (karta na stronie głównej)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('approach')} as="textarea" />
                    </FormField>
                    <FormField
                        label="Rezultat (karta na stronie głównej)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('result')} as="textarea" />
                    </FormField>
                    <FormField
                        label="Dodatkowe fakty"
                        help="Jedno „etykieta: wartość” w linii, obok roli, okresu i stacku — np. „platformy: iOS · Android”"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('facts')} as="textarea" />
                    </FormField>
                </>
            )}

            {isArticle && (
                <FormField
                    label={`Treść (${locale.toUpperCase()})`}
                    help={contentHelp}
                    hasTextareaHeight
                >
                    <MdxField key={locale} name={text('content')} locale={locale} />
                </FormField>
            )}
        </>
    );
}

export function EntryForm({initialState, onSubmit, isPending, error, saved}: Props) {
    const [locale, setLocale] = useState<Locale>('pl');

    const placeholder = useMemo(() => {
        if (initialState.presentation === 'app' && initialState.slug) {
            return `/projects/${initialState.slug}/images/cover.jpg`;
        }
        return '';
    }, [initialState]);

    return (
        <Formik
            initialValues={{
                ...initialState,
                cover: initialState.cover ?? '',
                period: initialState.period ?? '',
                siteUrl: initialState.siteUrl ?? '',
                repoUrl: initialState.repoUrl ?? '',
                linkUrl: initialState.linkUrl ?? '',
                createdAt: toDateTimeLocal(initialState.createdAt),
            }}
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
