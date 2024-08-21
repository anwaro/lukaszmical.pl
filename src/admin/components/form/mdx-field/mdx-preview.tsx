import {useEffect, useState, useTransition} from 'react';

import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';
import {serialize} from 'next-mdx-remote/serialize';

import '@/admin/css/github-dark.css';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';
import {projectMdxComponents} from '@/ui/components/project/projet-mdx/project-mdx-components';

type Props = {
    mdx: string;
};

export function MdxPreview({mdx}: Props) {
    const [source, setSource] = useState<MDXRemoteSerializeResult>();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const source = await serialize(mdx, mdxSerializeOptions);
            setSource(source);
        });
    }, [mdx]);

    return (
        <div className="wrapper prose prose-invert prose-a:text-blue-600">
            {!source ? (
                <MdxFieldLoader />
            ) : (
                <MDXRemote {...source} components={projectMdxComponents} />
            )}
        </div>
    );
}
