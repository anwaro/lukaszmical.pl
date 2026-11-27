'use server';

import React from 'react';

import {compileMDX} from 'next-mdx-remote/rsc';
import {z} from 'zod';

import {Locale, LocaleList} from '@/types/locale';
import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';
import {contentComponents} from '@/ui/site/content-mdx';
import {auth} from '@/utils/auth/auth';

export type PreviewMdxResult = {node: React.ReactNode} | {error: string};

const previewMdxSchema = z.object({
    source: z.string(),
    locale: z.enum(LocaleList as [Locale, ...Locale[]]),
});

// Renders content on the server, with the same blocks as the public site —
// dynamic ones included, so lists show their real data.
export async function previewMdxAction(
    source: string,
    locale: Locale,
): Promise<PreviewMdxResult> {
    await auth();

    const parsed = previewMdxSchema.safeParse({source, locale});
    if (!parsed.success) {
        return {error: `Unknown locale: ${locale}`};
    }

    try {
        const {content} = await compileMDX({
            source: parsed.data.source,
            options: mdxSerializeOptions,
            components: contentComponents(locale),
        });
        return {node: content};
    } catch (error) {
        return {error: error instanceof Error ? error.message : String(error)};
    }
}
