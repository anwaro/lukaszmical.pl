import React, {useEffect, useState} from 'react';

import {NextIntlClientProvider} from 'next-intl';
import {clsx} from 'clsx';

import '@/admin/css/github-dark.css';
import {
    previewMdxAction,
    PreviewMdxResult,
} from '@/admin/actions/preview-mdx-action';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {Locale} from '@/types/locale';
import {contentProseClass} from '@/ui/site/content-mdx-components';

type Props = {
    mdx: string;
    locale: Locale;
};

const errorClass = 'kv-notice kv-notice-danger';

// A block can still fail while the preview is rendered in the browser; that
// must not take the whole form down with it.
class PreviewBoundary extends React.Component<PWC, {error?: string}> {
    state: {error?: string} = {};

    static getDerivedStateFromError(error: unknown) {
        return {error: error instanceof Error ? error.message : String(error)};
    }

    render() {
        if (this.state.error !== undefined) {
            return (
                <pre className={errorClass}>
                    Nie udało się wyrenderować podglądu: {this.state.error}
                </pre>
            );
        }
        return this.props.children;
    }
}

// Typing pauses this long before the preview is rendered again.
const DEBOUNCE_MS = 400;

export function MdxPreview({mdx, locale}: Props) {
    const [result, setResult] = useState<PreviewMdxResult>();
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let stale = false;
        const timer = setTimeout(async () => {
            let next: PreviewMdxResult;
            try {
                next = await previewMdxAction(mdx ?? '', locale);
            } catch (error) {
                next = {
                    error: error instanceof Error ? error.message : String(error),
                };
            }
            if (!stale) {
                setResult(next);
                setVersion((current) => current + 1);
            }
        }, DEBOUNCE_MS);

        return () => {
            stale = true;
            clearTimeout(timer);
        };
    }, [mdx, locale]);

    if (!result) {
        return <MdxFieldLoader />;
    }

    if ('error' in result) {
        return <pre className={errorClass}>{result.error}</pre>;
    }

    return (
        // Blocks link through next-intl, which needs a locale outside of the site.
        <NextIntlClientProvider
            locale={locale}
            messages={{}}
            timeZone="Europe/Warsaw"
        >
            <div
                className={clsx(
                    'rounded-lg bg-ink px-6 pb-6 font-site leading-[1.6] text-fg',
                    contentProseClass,
                )}
            >
                {/* A new result gets a fresh boundary, so a fixed block shows again. */}
                <PreviewBoundary key={version}>{result.node}</PreviewBoundary>
            </div>
        </NextIntlClientProvider>
    );
}
