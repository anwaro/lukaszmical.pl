'use client';

import React, {useActionState, useState} from 'react';

import {Field, Form, Formik} from 'formik';
import dynamic from 'next/dynamic';
import {clsx} from 'clsx';
import {mdiWeb} from '@mdi/js';

import {
    ProjectEntity,
    ProjectLocale,
    ProjectTypeList,
} from '@/types/supabase/projects';
import CardBox from '@/admin/components/CardBox';
import {FormField} from '@/admin/components/form/form-field';
import Divider from '@/admin/components/Divider';
import Buttons from '@/admin/components/Buttons';
import Button from '@/admin/components/Button';
import FormCheckRadioGroup from '@/admin/components/form/check-radio-group';
import {FormCheckRadio} from '@/admin/components/form/check-radio';
import {updateProject} from '@/admin/actions/update-project';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';

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
    project: ProjectEntity;
};

export function EditProjectForm({project}: Props) {
    const [state, formAction, isPending] = useActionState(updateProject, project);
    const [locale, setLocale] = useState<ProjectLocale>('en');

    return (
        <CardBox>
            <Formik
                initialValues={{
                    ...project,
                    createdAt: project.createdAt.replace('+00:00', ''),
                }}
                onSubmit={formAction}
            >
                <Form>
                    <div className="width-full flex justify-end">
                        <Buttons noWrap>
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
                        </Buttons>
                    </div>

                    <FormField label="Url or slug">
                        <Field name="url" placeholder="Project url or slug" />
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

                    <FormCheckRadioGroup>
                        <FormCheckRadio type="checkbox" label="Published">
                            <Field type="checkbox" name="published" />
                        </FormCheckRadio>
                        <FormCheckRadio type="checkbox" label="Uses myQuery">
                            <Field type="checkbox" name="myQuery" />
                        </FormCheckRadio>
                        <FormCheckRadio type="checkbox" label="Uses theme css">
                            <Field type="checkbox" name="themeCss" />
                        </FormCheckRadio>
                    </FormCheckRadioGroup>

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

                    <Buttons type="justify-end">
                        <Button type="reset" color="info" outline label="Reset" />
                        <Button
                            type="submit"
                            color="info"
                            label="Submit"
                            loading={isPending}
                        />
                    </Buttons>
                </Form>
            </Formik>
        </CardBox>
    );
}
