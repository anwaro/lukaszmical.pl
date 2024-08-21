import type {serialize} from 'next-mdx-remote/serialize';

import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightCodeLines from 'rehype-highlight-code-lines';

type SerializeOptions = Exclude<Parameters<typeof serialize>[1], undefined>;

export const mdxSerializeOptions: SerializeOptions = {
    mdxOptions: {
        rehypePlugins: [
            rehypeHighlight,
            [
                rehypeHighlightCodeLines,
                {showLineNumbers: true, lineContainerTagName: 'div'},
            ],
        ],
    },
};
