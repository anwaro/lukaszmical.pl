'use server';
import React from 'react';

import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote/rsc';

import {LocalizedProjectEntity} from '@/types/supabase/projects';
import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';

type Props = {
    project: LocalizedProjectEntity;
    source: MDXRemoteSerializeResult;
};

export default async function ProjectPage({project, source}: Props) {
    return (
        <div className={'prose prose-invert prose-a:text-blue-600'}>
            {project.name}
            <MDXRemote source={project.content} options={mdxSerializeOptions} />
        </div>
    );
}
