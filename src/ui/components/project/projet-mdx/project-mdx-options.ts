import type {serialize} from 'next-mdx-remote/serialize';

import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightCodeLines from 'rehype-highlight-code-lines';

type SerializeOptions = Exclude<Parameters<typeof serialize>[1], undefined>;

export const mdxSerializeOptions: SerializeOptions = {
    mdxOptions: {
        // GitHub-flavoured markdown: tables, strikethrough, task lists, autolinks.
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            rehypeHighlight,
            [
                rehypeHighlightCodeLines,
                {showLineNumbers: true, lineContainerTagName: 'div'},
            ],
        ],
    },
};
