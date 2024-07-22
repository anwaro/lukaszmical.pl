'use client';

import {ProjectRow} from '@/types/supabase/projects';
import React, {useActionState, useEffect} from 'react';
import Button from '@/admin/components/Button';
import {mdiEye, mdiEyeOff} from '@mdi/js';
import {updateProject} from '@/admin/actions/update-project';

type Props = {
    project: ProjectRow;
    onUpdate: (id: number, data: Partial<ProjectRow>) => void;
    className?: string;
};

const FormBoolean = {
    toBoolean: (value: string | boolean | undefined) => {
        if (typeof value === 'string') {
            return value === '1';
        }
        return Boolean(value);
    },
    toFormValue: (value: string | boolean | undefined) => {
        if (typeof value !== 'string') {
            return value ? '1' : '0';
        }
        return value;
    },
};

export const EditVisibility = ({project, className, onUpdate}: Props) => {
    const [state, formAction, isPending] = useActionState(updateProject, {
        id: project.id,
        published: project.published,
    });

    useEffect(() => {
        onUpdate(project.id, {
            published: FormBoolean.toBoolean(state.published),
        });
    }, [state.published]);

    return (
        <form action={formAction}>
            <input type={'hidden'} name={'id'} value={project.id} />
            <input type={'hidden'} name={'name'} value={'published'} />
            <input
                type={'hidden'}
                name={'value'}
                value={FormBoolean.toFormValue(!project.published)}
            />

            <Button
                color={project.published ? 'danger' : 'success'}
                title={project.published ? 'Unpublish project' : 'Publish project'}
                icon={project.published ? mdiEyeOff : mdiEye}
                disabled={isPending}
                loading={isPending}
                className={className}
                type={'submit'}
                small
            />
        </form>
    );
};
