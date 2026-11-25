import {useEffect, useState} from 'react';

import {clsx} from 'clsx';

import {
    previewMdxAction,
    PreviewMdxResult,
} from '@/admin/actions/preview-mdx-action';
import {PreviewResult} from '@/admin/components/form/mdx-field/preview-result';
import {Locale} from '@/types/locale';
import {contentProseClass} from '@/ui/site/content-mdx-components';

type Props = {
    snippet: string;
    locale: Locale;
};

// Snippets are the static constants from block-library.ts, so a render for a
// given (locale, snippet) pair never changes — cached for the life of the
// page, shared by every mounted picker item, so switching the block picker's
// section tabs back and forth doesn't recompile (and, for the Dynamic
// section, re-query the database for) the same blocks over and over.
const previewCache = new Map<string, Promise<PreviewMdxResult>>();

function getCachedPreview(snippet: string, locale: Locale) {
    const key = `${locale}:${snippet}`;
    let cached = previewCache.get(key);
    if (!cached) {
        cached = previewMdxAction(snippet, locale).catch((error) => ({
            error: error instanceof Error ? error.message : String(error),
        }));
        previewCache.set(key, cached);
    }
    return cached;
}

// Small, non-interactive render of one block's snippet, shown inside its
// picker button. The snippet is static, so this renders once and stays put.
export function BlockPreview({snippet, locale}: Props) {
    const [result, setResult] = useState<PreviewMdxResult>();

    useEffect(() => {
        let stale = false;
        getCachedPreview(snippet, locale).then((next) => {
            if (!stale) {
                setResult(next);
            }
        });
        return () => {
            stale = true;
        };
    }, [snippet, locale]);

    if (!result) {
        return null;
    }

    return (
        // inert: a block can render real links/buttons, which must not steal
        // clicks or tab stops from the picker button around this.
        <div
            inert
            className={clsx(
                'pointer-events-none mt-2 max-h-24 overflow-hidden rounded-md bg-ink p-2 text-[10px] text-fg',
                contentProseClass,
            )}
        >
            <PreviewResult result={result} locale={locale} />
        </div>
    );
}
