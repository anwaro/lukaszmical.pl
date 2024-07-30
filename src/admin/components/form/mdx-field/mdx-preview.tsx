import {useEffect, useState, useTransition} from 'react';

import {serialize} from 'next-mdx-remote/serialize';
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightCodeLines from 'rehype-highlight-code-lines';

import '@/admin/css/github-dark.css';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';

// import Test from '../components/test'

const components = {};

type Props = {
    mdx: string;
};

export function MdxPreview({mdx}: Props) {
    const [source, setSource] = useState<MDXRemoteSerializeResult>();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const source = await serialize(mdx, {
                mdxOptions: {
                    rehypePlugins: [
                        rehypeHighlight,
                        [
                            rehypeHighlightCodeLines,
                            {showLineNumbers: true, lineContainerTagName: 'div'},
                        ],
                    ],
                },
            });
            setSource(source);
        });
    }, [mdx]);

    return (
        <div className="wrapper">
            {isPending || !source ? (
                <MdxFieldLoader />
            ) : (
                <MDXRemote {...source} components={components} />
            )}
        </div>
    );
}
