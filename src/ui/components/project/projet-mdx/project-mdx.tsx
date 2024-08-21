'use client';
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';

import '@/admin/css/github-dark.css';

import {projectMdxComponents} from './project-mdx-components';

type Props = {
    source: MDXRemoteSerializeResult;
};

export function ProjectMdx({source}: Props) {
    return <MDXRemote {...source} components={projectMdxComponents} />;
}
