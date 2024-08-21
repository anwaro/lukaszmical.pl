'use client';

import React, {useActionState, useEffect} from 'react';

import {useRouter} from 'next/navigation';

import {ProjectForm} from '@/admin/components/form/forms/project-form';
import {
    createProjectAction,
    CreateProjectEntity,
} from '@/admin/actions/create-project-action';

const initialState: CreateProjectEntity = {
    cover: '',
    createdAt: '',
    myQuery: false,
    order: 100,
    published: false,
    themeCss: false,
    type: 'project',
    url: '',
    name: {
        pl: '',
        en: '',
    },
    content: {
        pl: '',
        en: '',
    },
    description: {
        pl: '',
        en: '',
    },
};

export function CreateProjectForm() {
    const [state, formAction, isPending] = useActionState(createProjectAction, {
        status: undefined,
    });

    const router = useRouter();

    useEffect(() => {
        if (state.status === 'success') {
            router.push(`/admin/projects/${state.id}`);
        }
    }, [state]);

    return (
        <ProjectForm
            initialState={initialState}
            onSubmit={formAction}
            isPending={isPending}
            error={state.status === 'error' ? state.error : undefined}
        />
    );
}
