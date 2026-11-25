import React, {useEffect, useState} from 'react';

import {NextIntlClientProvider} from 'next-intl';
import {clsx} from 'clsx';

import {
    previewMdxAction,
    PreviewMdxResult,
} from '@/admin/actions/preview-mdx-action';
import {Locale} from '@/types/locale';
import {contentProseClass} from '@/ui/site/content-mdx-components';

type Props = {
    snippet: string;
    locale: Locale;
};

// A block can fail to render on its own without taking the picker down with it.
class PreviewErrorBoundary extends React.Component<PWC, {hasError: boolean}> {
    state: {hasError: boolean} = {hasError: false};

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    render() {
        if (this.state.hasError) {
            return <span className="kv-caption">Brak podglądu</span>;
        }
        return this.props.children;
    }
}

// Small, non-interactive render of one block's snippet, shown inside its
// picker button. The snippet is static, so this renders once and stays put.
export function BlockPreview({snippet, locale}: Props) {
    const [result, setResult] = useState<PreviewMdxResult>();

    useEffect(() => {
        let stale = false;
        previewMdxAction(snippet, locale).then((next) => {
            if (!stale) {
                setResult(next);
            }
        });
        return () => {
            stale = true;
        };
    }, [snippet, locale]);

    if (!result || 'error' in result) {
        return null;
    }

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={{}}
            timeZone="Europe/Warsaw"
        >
            {/* inert: a block can render real links/buttons, which must not
                steal clicks or tab stops from the picker button around this. */}
            <div
                inert
                className={clsx(
                    'pointer-events-none mt-2 max-h-24 overflow-hidden rounded-md bg-ink p-2 text-[10px] text-fg',
                    contentProseClass,
                )}
            >
                <PreviewErrorBoundary>{result.node}</PreviewErrorBoundary>
            </div>
        </NextIntlClientProvider>
    );
}
