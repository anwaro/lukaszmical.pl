'use client';

import React, {startTransition, useActionState, useEffect} from 'react';

import {useRouter} from 'next/navigation';

import {
    ProjectStringsEntity,
    ProjectStringTypeList,
    ProjectType,
} from '@/types/project';
import {ProjectForm} from '@/admin/components/form/forms/project-form';
import {
    createProjectAction,
    CreateProjectEntity,
} from '@/admin/actions/create-project-action';

const emptyStrings = Object.fromEntries(
    ProjectStringTypeList.map((type) => [type, {pl: '', en: ''}]),
) as ProjectStringsEntity;

const initialState = (type: ProjectType): CreateProjectEntity => ({
    cover: '',
    createdAt: '',
    myQuery: false,
    order: 100,
    published: false,
    themeCss: false,
    featured: false,
    stack: [],
    period: '',
    siteUrl: '',
    repoUrl: '',
    type,
    url: '',
    ...emptyStrings,
});

type Props = {
    type?: ProjectType;
};

export function CreateProjectForm({type = 'project'}: Props) {
    const [state, formAction, isPending] = useActionState(createProjectAction, {
        status: undefined,
    });

    const router = useRouter();

    useEffect(() => {
        if (state.status === 'success') {
            router.push(`/admin/projects/${state.id}`);
        }
    }, [state, router]);

    return (
        <ProjectForm
            initialState={initialState(type)}
            onSubmit={(form) => startTransition(() => formAction(form))}
            isPending={isPending}
            error={state.status === 'error' ? state.error : undefined}
        />
    );
}
