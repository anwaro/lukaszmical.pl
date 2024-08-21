'use client';

import React, {useMemo, useState} from 'react';

import {Field, Form, Formik} from 'formik';
import dynamic from 'next/dynamic';
import {clsx} from 'clsx';
import {mdiImage, mdiSend, mdiWeb} from '@mdi/js';

import {ProjectLocale, ProjectTypeList} from '@/types/supabase/projects';
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

export function ProjectForm({initialState, onSubmit, isPending}: Props) {
    const [locale, setLocale] = useState<ProjectLocale>('en');

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
                    createdAt: initialState.createdAt.replace('+00:00', ''),
                }}
                onSubmit={onSubmit}
            >
                <Form>
                    <div className="width-full flex justify-end">
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
                                title={'Preview mode'}
                                type={'button'}
                                label={'PL'}
                                small
                            />
                        </ButtonsGroup>
                    </div>
                    <FormField label="Url or slug">
                        <Field name="url" placeholder="Project url or slug" />
                    </FormField>
                    <FormField label="Cover" icons={[mdiImage]}>
                        <ImageField name="cover" placeholder={placeholder} />
                    </FormField>
                    <FormField label="Order, ">
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
                        <CheckboxField type="switch" label="Uses myQuery">
                            <Field type="checkbox" name="myQuery" />
                        </CheckboxField>
                        <CheckboxField type="switch" label="Uses theme css">
                            <Field type="checkbox" name="themeCss" />
                        </CheckboxField>
                    </CheckboxFieldGroup>

                    <Divider />
                    <FormField label="Name" locale={locale}>
                        <Field name={`name.${locale}`} placeholder="Project name" />
                    </FormField>

                    <FormField label="Description" locale={locale} hasTextareaHeight>
                        <Field name={`description.${locale}`} as="textarea" />
                    </FormField>

                    <FormField label="Content" locale={locale} hasTextareaHeight>
                        <MdxField name={`content.${locale}`} />
                    </FormField>

                    <Divider />

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
