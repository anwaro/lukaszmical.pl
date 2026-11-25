import React from 'react';

import {getLocale} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';

import {Locale} from '@/types/locale';
import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';

import {BlockName} from './blocks/block-library';
import {contentMdxComponents, contentProseClass} from './content-mdx-components';
import {contentMdxDynamicComponents} from './content-mdx-dynamic';

type Props = {
    source: string;
    // Defaults to the locale of the request.
    locale?: Locale;
};

function buildComponents(locale: Locale) {
    return {
        ...contentMdxComponents,
        ...contentMdxDynamicComponents(locale),
    } satisfies Record<BlockName, unknown>;
}

const componentsByLocale = new Map<Locale, ReturnType<typeof buildComponents>>();

// The whole block library, with the dynamic blocks bound to `locale`. Cached
// per locale: otherwise this is rebuilt (reallocating the dynamic blocks'
// closures) on every call, and previewMdxAction can call it dozens of times
// rendering a single admin page.
export function contentComponents(locale: Locale) {
    let components = componentsByLocale.get(locale);
    if (!components) {
        components = buildComponents(locale);
        componentsByLocale.set(locale, components);
    }
    return components;
}

// Renders CMS content: MDX with the blocks of the block library.
export async function ContentMdx({source, locale}: Props) {
    const components = contentComponents(locale ?? ((await getLocale()) as Locale));

    return (
        <div className={contentProseClass}>
            <MDXRemote
                source={source}
                options={mdxSerializeOptions}
                components={components}
            />
        </div>
    );
}
