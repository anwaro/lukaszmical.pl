'use client';

import {ProjectRow} from '@/types/supabase/projects';
import React, {useActionState, useEffect, useState} from 'react';
import Buttons from '@/admin/components/Buttons';
import Button from '@/admin/components/Button';
import {mdiCheck, mdiClose} from '@mdi/js';
import {updateProject} from '@/admin/actions/update-project';

type Props = {
    project: ProjectRow;
    onUpdate: (id: number, data: Partial<ProjectRow>) => void;
};

export const EditOrder = ({project, onUpdate}: Props) => {
    const [value, setValue] = useState(project.order);
    const [isEditing, setIsEditing] = useState(false);
    const [state, formAction, isPending] = useActionState(updateProject, {
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
        <form className={'flex items-center w-[200px]'} action={formAction}>
            <input type={'hidden'} name={'id'} value={project.id} />
            <input type={'hidden'} name={'name'} value={'order'} />
            {isEditing ? (
                <>
                    <input
                        className="px-3 py-1 max-w-full border-gray-700 rounded w-full dark:placeholder-gray-400 focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none h-10 border bg-white dark:bg-slate-800 "
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        type={'number'}
                        name={'value'}
                        value={value}
                    />

                    <Buttons className={'ml-2'} noWrap>
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
                    </Buttons>
                </>
            ) : (
                <div
                    className={'flex items-center w-[200px]'}
                    onClick={() => setIsEditing(true)}
                >
                    {project.order}
                </div>
            )}
        </form>
    );
};
