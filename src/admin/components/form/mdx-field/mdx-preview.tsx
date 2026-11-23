import {useEffect, useState, useTransition} from 'react';

import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';
import {serialize} from 'next-mdx-remote/serialize';
import {clsx} from 'clsx';

import '@/admin/css/github-dark.css';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';
import {contentProseClass} from '@/ui/site/content-mdx-components';
import {projectMdxComponents} from '@/ui/components/project/projet-mdx/project-mdx-components';

type Props = {
    mdx: string;
};

export function MdxPreview({mdx}: Props) {
    const [source, setSource] = useState<MDXRemoteSerializeResult>();
    const [, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const source = await serialize(mdx, mdxSerializeOptions);
            setSource(source);
        });
    }, [mdx]);

    return (
        <div className={clsx('rounded-lg bg-ink p-6 text-fg', contentProseClass)}>
            {!source ? (
                <MdxFieldLoader />
            ) : (
                <MDXRemote {...source} components={projectMdxComponents} />
            )}
        </div>
    );
}
