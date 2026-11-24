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

// Typing pauses this long before the preview is rendered again.
const DEBOUNCE_MS = 400;

export function MdxPreview({mdx, locale}: Props) {
    const [result, setResult] = useState<PreviewMdxResult>();

    useEffect(() => {
        let stale = false;
        const timer = setTimeout(async () => {
            let next: PreviewMdxResult;
            try {
                next = await previewMdxAction(mdx ?? '', locale);
            } catch (error) {
                next = {error: error instanceof Error ? error.message : String(error)};
            }
            if (!stale) {
                setResult(next);
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
        return (
            <pre className="rounded-lg border border-red-500/50 bg-slate-900 p-4 text-sm whitespace-pre-wrap text-red-300">
                {result.error}
            </pre>
        );
    }

    return (
        // Blocks link through next-intl, which needs a locale outside of the site.
        <NextIntlClientProvider locale={locale} messages={{}} timeZone="Europe/Warsaw">
            <div
                className={clsx(
                    'rounded-lg bg-ink px-6 pb-6 font-site leading-[1.6] text-fg',
                    contentProseClass,
                )}
            >
                {result.node}
            </div>
        </NextIntlClientProvider>
    );
}
