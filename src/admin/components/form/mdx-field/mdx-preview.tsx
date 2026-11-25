import {useEffect, useState} from 'react';

import {clsx} from 'clsx';

import '@/admin/css/github-dark.css';
import {
    previewMdxAction,
    PreviewMdxResult,
} from '@/admin/actions/preview-mdx-action';
import {MdxFieldLoader} from '@/admin/components/form/mdx-field/mdx-field-loader';
import {PreviewResult} from '@/admin/components/form/mdx-field/preview-result';
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

    return (
        <div
            className={clsx(
                'rounded-lg bg-ink px-6 pb-6 font-site leading-[1.6] text-fg',
                contentProseClass,
            )}
        >
            {/* A new result gets a fresh boundary, so a fixed block shows again. */}
            <PreviewResult key={version} result={result} locale={locale} />
        </div>
    );
}
