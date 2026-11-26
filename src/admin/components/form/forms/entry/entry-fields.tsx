import React from 'react';

import {Field, useFormikContext} from 'formik';
import dynamic from 'next/dynamic';
import {Image} from 'lucide-react';

import {EntryInput, EntryPresentationList, HOMEPAGE_SLUG} from '@/types/entry';
import {Locale} from '@/types/locale';
import {FormField} from '@/admin/components/form/form-field/form-field';
import Divider from '@/admin/components/divider';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {ImageField} from '@/admin/components/form/image-field/image-field';
import {CheckboxFieldGroup} from '@/admin/components/form/checkbox-field/checkbox-field-group';
import {CheckboxField} from '@/admin/components/form/checkbox-field/checkbox-field';

import {contentHelp, entryKindFlags, presentationLabels, textFieldName} from './entry-fields-model';
import {CaseStudyFields} from './case-study-fields';
import {ListField} from './list-field';

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
    locale: Locale;
    placeholder: string;
};

export function EntryFields({locale, placeholder}: Props) {
    const {values} = useFormikContext<EntryInput>();
    const {isPage, isCaseStudy, isProject, isArticle} = entryKindFlags(values);
    const text = (field: string) => textFieldName(locale, field);

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

            {isCaseStudy && <CaseStudyFields locale={locale} />}

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
