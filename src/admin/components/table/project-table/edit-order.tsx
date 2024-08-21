'use client';

import React, {useActionState, useEffect, useState} from 'react';

import {mdiCheck, mdiClose} from '@mdi/js';

import {ProjectRow} from '@/types/supabase/projects';
import ButtonsGroup from '@/admin/components/button/buttons-group';
import {Button} from '@/admin/components/button/button';
import {updateProjectField} from '@/admin/actions/update-project-field';

type Props = {
    project: ProjectRow;
    onUpdate: (id: number, data: Partial<ProjectRow>) => void;
};

export const EditOrder = ({project, onUpdate}: Props) => {
    const [value, setValue] = useState(project.order);
    const [isEditing, setIsEditing] = useState(false);
    const [state, formAction, isPending] = useActionState(updateProjectField, {
        id: project.id,
        order: project.order,
    });

    useEffect(() => {
        if (!isPending) {
            onUpdate(project.id, {order: value});
            setIsEditing(false);
        }
    }, [isPending]);

    return (
        <form className={'flex w-[200px] items-center'} action={formAction}>
            <input type={'hidden'} name={'id'} value={project.id} />
            <input type={'hidden'} name={'name'} value={'order'} />
            {isEditing ? (
                <>
                    <input
                        className="h-10 w-full max-w-full rounded border border-gray-700 bg-slate-800 px-3 py-1 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring focus:ring-blue-600 "
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        type={'number'}
                        name={'value'}
                        value={value}
                    />

                    <ButtonsGroup className={'ml-2'} noWrap>
                        <Button
                            color="info"
                            icon={mdiCheck}
                            disabled={isPending}
                            loading={isPending}
                            title={'Edit project'}
                            type={'submit'}
                            small
                        />
                        <Button
                            onClick={() => setIsEditing(false)}
                            disabled={isPending}
                            color={'danger'}
                            title={'Cancel'}
                            icon={mdiClose}
                            small
                        />
                    </ButtonsGroup>
                </>
            ) : (
                <div
                    className={'flex w-[200px] items-center'}
                    onClick={() => setIsEditing(true)}
                >
                    {project.order}
                </div>
            )}
        </form>
    );
};
