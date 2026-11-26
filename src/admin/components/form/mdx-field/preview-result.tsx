import React from 'react';

import {NextIntlClientProvider} from 'next-intl';

import {noticeDangerClassName} from '@/admin/components/notice-class-name';
import {PreviewMdxResult} from '@/admin/actions/preview-mdx-action';
import {Locale} from '@/types/locale';

import {RenderErrorBoundary} from './render-error-boundary';

type Props = {
    result: PreviewMdxResult;
    locale: Locale;
};

// Renders a `previewMdxAction` result: the compile error if there is one,
// otherwise the compiled node wrapped the way CMS blocks need to render
// outside of a localized route (next-intl client context, a boundary against
// a block that compiles but fails at render). Shared by the full MDX preview,
// the block picker's live thumbnails, and the blocks gallery page — each owns
// its own layout around this, only the result-rendering is common.
export function PreviewResult({result, locale}: Props) {
    if ('error' in result) {
        return <pre className={noticeDangerClassName()}>{result.error}</pre>;
    }

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={{}}
            timeZone="Europe/Warsaw"
        >
            <RenderErrorBoundary>{result.node}</RenderErrorBoundary>
        </NextIntlClientProvider>
    );
}
