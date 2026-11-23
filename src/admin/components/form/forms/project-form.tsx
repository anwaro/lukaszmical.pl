'use client';

import React, {useMemo, useState} from 'react';

import {Field, Form, Formik, useField, useFormikContext} from 'formik';
import dynamic from 'next/dynamic';
import {clsx} from 'clsx';
import {mdiImage, mdiSend, mdiWeb} from '@mdi/js';

import {ProjectLocale, ProjectTypeList} from '@/types/project';
import CardBox from '@/admin/components/CardBox';
import {FormField} from '@/admin/components/form/form-field/form-field';
import Divider from '@/admin/components/divider';
import ButtonsGroup from '@/admin/components/button/buttons-group';
import {Button} from '@/admin/components/button/button';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {ImageField} from '@/admin/components/form/image-field/image-field';
import {CheckboxFieldGroup} from '@/admin/components/form/checkbox-field/checkbox-field-group';
import {CheckboxField} from '@/admin/components/form/checkbox-field/checkbox-field';
import {CreateProjectEntity} from '@/admin/actions/create-project-action';
import {contentMdxComponentNames} from '@/ui/site/content-mdx-components';

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
    initialState: CreateProjectEntity;
    onSubmit: (values: CreateProjectEntity) => void;
    isPending?: boolean;
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

type FieldsProps = {
    locale: ProjectLocale;
    placeholder: string;
};

const contentHelp = `MDX. Available blocks: ${contentMdxComponentNames
    .map((name) => `<${name}>`)
    .join(' ')}`;

function ProjectFields({locale, placeholder}: FieldsProps) {
    const {values} = useFormikContext<CreateProjectEntity>();
    const isCaseStudy = values.type === 'case-study';

    return (
        <>
            <FormField
                label="Url or slug"
                help={
                    isCaseStudy
                        ? 'Slug of the page: /case-studies/<slug>'
                        : 'Slug of the page (/projects/<slug>) or a full url for an external project'
                }
            >
                <Field name="url" placeholder="Project url or slug" />
            </FormField>
            <FormField
                label={isCaseStudy ? 'Icon (square)' : 'Cover'}
                icons={[mdiImage]}
            >
                <ImageField name="cover" placeholder={placeholder} />
            </FormField>
            <FormField label="Order, created at, type">
                <Field name="order" type="number" placeholder="Order" />
                <Field
                    step="1"
                    type="datetime-local"
                    name="createdAt"
                    placeholder="Created at"
                />
                <Field name="type" component="select">
                    {ProjectTypeList.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </Field>
            </FormField>

            <CheckboxFieldGroup>
                <CheckboxField type="switch" label="Published">
                    <Field type="checkbox" name="published" />
                </CheckboxField>
                {!isCaseStudy && (
                    <CheckboxField type="switch" label="Featured on homepage">
                        <Field type="checkbox" name="featured" />
                    </CheckboxField>
                )}
                {values.type === 'project' && (
                    <CheckboxField type="switch" label="Uses myQuery">
                        <Field type="checkbox" name="myQuery" />
                    </CheckboxField>
                )}
                {values.type === 'project' && (
                    <CheckboxField type="switch" label="Uses theme css">
                        <Field type="checkbox" name="themeCss" />
                    </CheckboxField>
                )}
            </CheckboxFieldGroup>

            <Divider />

            <FormField label="Stack" help="Comma-separated, e.g. Next.js, Drizzle">
                <ListField name="stack" placeholder="Next.js, Drizzle, PostgreSQL" />
            </FormField>
            {isCaseStudy ? (
                <FormField label="Period, site address">
                    <Field name="period" placeholder="2023–2025" />
                    <Field name="siteUrl" placeholder="https://example.com" />
                </FormField>
            ) : (
                <FormField label="Year, demo url, repository url">
                    <Field name="period" placeholder="2024" />
                    <Field name="siteUrl" placeholder="Demo url" />
                    <Field name="repoUrl" placeholder="https://github.com/..." />
                </FormField>
            )}

            <Divider />

            <FormField label="Name" locale={locale}>
                <Field
                    key={locale}
                    name={`name.${locale}`}
                    placeholder="Project name"
                />
            </FormField>

            <FormField
                label="Description"
                help="One or two sentences shown on lists and in search results"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={`description.${locale}`} as="textarea" />
            </FormField>

            <FormField
                label="Lead"
                help="Intro under the title of the page; falls back to the description"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={`lead.${locale}`} as="textarea" />
            </FormField>

            {isCaseStudy && (
                <>
                    <FormField
                        label="Headline"
                        help="Title of the card on the homepage, e.g. “itmbw.pl — serwis biegowy z aplikacją dla biegaczy”"
                        locale={locale}
                    >
                        <Field key={locale} name={`headline.${locale}`} />
                    </FormField>
                    <FormField label="Role" locale={locale}>
                        <Field key={locale} name={`role.${locale}`} />
                    </FormField>
                    <FormField
                        label="Problem (homepage card)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={`problem.${locale}`} as="textarea" />
                    </FormField>
                    <FormField
                        label="Approach (homepage card)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={`approach.${locale}`} as="textarea" />
                    </FormField>
                    <FormField
                        label="Result (homepage card)"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={`result.${locale}`} as="textarea" />
                    </FormField>
                    <FormField
                        label="Extra facts"
                        help="One “label: value” per line, shown next to role, period and stack — e.g. “platformy: iOS · Android”"
                        locale={locale}
                        hasTextareaHeight
                    >
                        <Field key={locale} name={`meta.${locale}`} as="textarea" />
                    </FormField>
                </>
            )}

            {values.type !== 'external' && values.type !== 'project' && (
                <FormField
                    label="Content"
                    help={contentHelp}
                    locale={locale}
                    hasTextareaHeight
                >
                    <MdxField key={locale} name={`content.${locale}`} />
                </FormField>
            )}
        </>
    );
}

export function ProjectForm({initialState, onSubmit, isPending, error}: Props) {
    const [locale, setLocale] = useState<ProjectLocale>('pl');

    const placeholder = useMemo(() => {
        if (initialState.type === 'project' && initialState.url) {
            return `/projects/${initialState.url}/images/cover.jpg`;
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
                    createdAt: initialState.createdAt.replace('+00:00', ''),
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
                    <ProjectFields locale={locale} placeholder={placeholder} />

                    <Divider />

                    {error && <p className="mb-4 text-red-400">{error}</p>}

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
