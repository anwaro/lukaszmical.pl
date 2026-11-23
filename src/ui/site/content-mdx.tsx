import React from 'react';

import {MDXRemote} from 'next-mdx-remote/rsc';

import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';

import {contentMdxComponents, contentProseClass} from './content-mdx-components';

export function ContentMdx({source}: {source: string}) {
    return (
        <div className={contentProseClass}>
            <MDXRemote
                source={source}
                options={mdxSerializeOptions}
                components={contentMdxComponents}
            />
        </div>
    );
}
