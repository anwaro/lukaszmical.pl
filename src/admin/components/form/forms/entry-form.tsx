'use client';

import React, {useMemo, useState} from 'react';

import {Field, Form, Formik, useField, useFormikContext} from 'formik';
import dynamic from 'next/dynamic';
import {clsx} from 'clsx';
import {mdiImage, mdiSend, mdiWeb} from '@mdi/js';

import {
    EntryInput,
    EntryPresentationList,
    HOMEPAGE_SLUG,
} from '@/types/entry';
import {Locale} from '@/types/locale';
import CardBox from '@/admin/components/CardBox';
import {FormField} from '@/admin/components/form/form-field/form-field';
import Divider from '@/admin/components/divider';
import ButtonsGroup from '@/admin/components/button/buttons-group';
import {Button} from '@/admin/components/button/button';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {ImageField} from '@/admin/components/form/image-field/image-field';
import {CheckboxFieldGroup} from '@/admin/components/form/checkbox-field/checkbox-field-group';
import {CheckboxField} from '@/admin/components/form/checkbox-field/checkbox-field';

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
    'MDX built from blocks. In edit mode, the block library on the right inserts a block at the cursor.';

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
                        ? `Address of the page: /<slug>. “${HOMEPAGE_SLUG}” is the homepage.`
                        : isCaseStudy
                          ? 'Address of the page: /case-studies/<slug>'
                          : 'Address of the page: /projects/<slug>; for an app also its folder in public/projects'
                }
            >
                <Field name="slug" placeholder="slug" />
            </FormField>
            <FormField
                label={
                    isPage ? 'Social share image' : isCaseStudy ? 'Icon (square)' : 'Cover'
                }
                icons={[mdiImage]}
            >
                <ImageField name="cover" placeholder={placeholder} />
            </FormField>
            <FormField label="Position, created at">
                <Field name="position" type="number" placeholder="Position" />
                <Field
                    step="1"
                    type="datetime-local"
                    name="createdAt"
                    placeholder="Created at"
                />
            </FormField>
            {isProject && (
                <FormField
                    label="Presentation"
                    help="article — a write-up built from blocks; app — served from public/projects/<slug>; link — opens another address"
                >
                    <Field name="presentation" component="select">
                        {EntryPresentationList.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </Field>
                </FormField>
            )}
            {isProject && values.presentation === 'link' && (
                <FormField label="Link url" help="A path on this site or a full url">
                    <Field name="linkUrl" placeholder="https://example.com" />
                </FormField>
            )}

            <CheckboxFieldGroup>
                <CheckboxField type="switch" label="Published">
                    <Field type="checkbox" name="published" />
                </CheckboxField>
                {isProject && (
                    <CheckboxField type="switch" label="Featured on homepage">
                        <Field type="checkbox" name="featured" />
                    </CheckboxField>
                )}
                {isProject && values.presentation === 'app' && (
                    <CheckboxField type="switch" label="Uses myQuery">
                        <Field type="checkbox" name="options.myQuery" />
                    </CheckboxField>
                )}
                {isProject && values.presentation === 'app' && (
                    <CheckboxField type="switch" label="Uses theme css">
                        <Field type="checkbox" name="options.themeCss" />
                    </CheckboxField>
                )}
            </CheckboxFieldGroup>

            <Divider />

            {!isPage && (
                <FormField label="Stack" help="Comma-separated, e.g. Next.js, Drizzle">
                    <ListField name="stack" placeholder="Next.js, Drizzle, PostgreSQL" />
                </FormField>
            )}
            {isCaseStudy && (
                <FormField label="Period, site address">
                    <Field name="period" placeholder="2023–2025" />
                    <Field name="siteUrl" placeholder="https://example.com" />
                </FormField>
            )}
            {isProject && (
                <FormField label="Year, demo url, repository url">
                    <Field name="period" placeholder="2024" />
                    <Field name="siteUrl" placeholder="Demo url" />
                    <Field name="repoUrl" placeholder="https://github.com/..." />
                </FormField>
            )}

            {!isPage && <Divider />}

            <FormField
                label={isPage ? 'Page title' : 'Title'}
                help={isPage ? 'Title of the browser tab and of search results' : undefined}
                locale={locale}
            >
                <Field key={locale} name={text('title')} placeholder="Title" />
            </FormField>

            <FormField
                label={isPage ? 'Meta description' : 'Description'}
                help="One or two sentences shown on lists and in search results"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={text('description')} as="textarea" />
            </FormField>

            {!isPage && (
                <FormField
                    label="Lead"
                    help="Intro under the title of the page; falls back to the description"
                    locale={locale}
                    hasTextareaHeight
                >
                    <Field key={locale} name={text('lead')} as="textarea" />
                </FormField>
            )}

            {isCaseStudy && (
                <>
                    <FormField
                        label="Headline"
                        help="Title of the card on the homepage, e.g. “itmbw.pl — serwis biegowy z aplikacją dla biegaczy”"
                        locale={locale}
                    >
                        <Field key={locale} name={text('headline')} />
                    </FormField>
                    <FormField label="Role" locale={locale}>
                        <Field key={locale} name={text('role')} />
                    </FormField>
                    <FormField
                        label="Problem (homepage card)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('problem')} as="textarea" />
                    </FormField>
                    <FormField
                        label="Approach (homepage card)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('approach')} as="textarea" />
                    </FormField>
                    <FormField
                        label="Result (homepage card)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('result')} as="textarea" />
                    </FormField>
                    <FormField
                        label="Extra facts"
                        help="One “label: value” per line, shown next to role, period and stack — e.g. “platformy: iOS · Android”"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={text('facts')} as="textarea" />
                    </FormField>
                </>
            )}

            {isArticle && (
                <FormField
                    label="Content"
                    help={contentHelp}
                    locale={locale}
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
        <CardBox>
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
                    <div className="flex justify-end">
                        <ButtonsGroup noWrap>
                            <Button
                                color="white"
                                className={clsx(locale !== 'en' && 'opacity-50')}
                                onClick={() => setLocale('en')}
                                icon={mdiWeb}
                                title={'Edit english strings'}
                                type={'button'}
                                label={'EN'}
                                small
                            />
                            <Button
                                color="white"
                                className={clsx(locale !== 'pl' && 'opacity-50')}
                                onClick={() => setLocale('pl')}
                                icon={mdiWeb}
                                title={'Edit polish strings'}
                                type={'button'}
                                label={'PL'}
                                small
                            />
                        </ButtonsGroup>
                    </div>
                    <EntryFields locale={locale} placeholder={placeholder} />

                    <Divider />

                    {error && <p className="mb-4 text-red-400">{error}</p>}
                    {saved && !error && !isPending && (
                        <p className="mb-4 text-right text-sm text-emerald-400">Saved</p>
                    )}

                    <ButtonsGroup type="justify-end">
                        <Button
                            type="submit"
                            color="info"
                            label="Submit"
                            icon={mdiSend}
                            loading={isPending}
                        />
                    </ButtonsGroup>
                </Form>
            </Formik>
        </CardBox>
    );
}
