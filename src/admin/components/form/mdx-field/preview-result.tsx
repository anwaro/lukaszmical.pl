import React from 'react';

import {NextIntlClientProvider} from 'next-intl';

import {PreviewMdxResult} from '@/admin/actions/preview-mdx-action';
import {Locale} from '@/types/locale';

type Props = {
    result: PreviewMdxResult;
    locale: Locale;
};

// A block can still fail while its already-compiled output is rendered; that
// must not take the whole preview (or picker) down with it.
class RenderErrorBoundary extends React.Component<PWC, {error?: string}> {
    state: {error?: string} = {};

    static getDerivedStateFromError(error: unknown) {
        return {error: error instanceof Error ? error.message : String(error)};
    }

    render() {
        if (this.state.error !== undefined) {
            return (
                <pre className="kv-notice kv-notice-danger">
                    Nie udało się wyrenderować podglądu: {this.state.error}
                </pre>
            );
        }
        return this.props.children;
    }
}

// Renders a `previewMdxAction` result: the compile error if there is one,
// otherwise the compiled node wrapped the way CMS blocks need to render
// outside of a localized route (next-intl client context, a boundary against
// a block that compiles but fails at render). Shared by the full MDX preview,
// the block picker's live thumbnails, and the blocks gallery page — each owns
// its own layout around this, only the result-rendering is common.
export function PreviewResult({result, locale}: Props) {
    if ('error' in result) {
        return <pre className="kv-notice kv-notice-danger">{result.error}</pre>;
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
