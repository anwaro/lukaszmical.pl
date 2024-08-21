'use client';

import React, {useActionState} from 'react';

import {ProjectEntity} from '@/types/supabase/projects';
import {updateProjectAction} from '@/admin/actions/update-project-action';
import {ProjectForm} from '@/admin/components/form/forms/project-form';

type Props = {
    project: ProjectEntity;
};

export function EditProjectForm({project}: Props) {
    const [state, formAction, isPending] = useActionState(updateProjectAction, {
        status: undefined,
        data: project,
    });

    return (
        <ProjectForm
            initialState={project}
            onSubmit={(form) => formAction({id: project.id, ...form})}
            error={state.status === 'error' ? state.error : undefined}
            isPending={isPending}
        />
    );
}
