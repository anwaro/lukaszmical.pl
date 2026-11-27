import type {editor} from 'monaco-editor';
import type {BeforeMount} from '@monaco-editor/react';

import {useSyncExternalStore} from 'react';

import {clsx} from 'clsx';

const mobileQuery = '(max-width: 639.98px)';

function subscribeMobile(onChange: () => void) {
    const query = window.matchMedia(mobileQuery);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}

// Below the `sm` breakpoint — where edit mode goes full-screen.
export function useIsMobileViewport(): boolean {
    return useSyncExternalStore(
        subscribeMobile,
        () => window.matchMedia(mobileQuery).matches,
        () => false,
    );
}

// On mobile, edit mode takes over the screen instead of sitting in the
// page's padded column, so the keyboard leaves room to actually type.
export function mdxFieldRootClassName(fullscreenEdit: boolean) {
    return clsx(
        fullscreenEdit &&
            'fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900',
    );
}

export function mdxFieldToolbarClassName(fullscreenEdit: boolean) {
    return clsx(
        'z-20 flex items-center gap-2 border-b border-slate-100 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90',
        fullscreenEdit ? 'flex-none px-2 py-1.5' : 'sticky top-14 mb-3 py-2',
    );
}

export function mdxFieldBoxClassName(fullscreenEdit: boolean) {
    return clsx(
        'flex flex-col overflow-hidden',
        fullscreenEdit
            ? 'min-h-0 flex-1'
            : 'rounded-lg border border-slate-200 lg:h-300 lg:flex-row dark:border-slate-700',
    );
}

export function mdxFieldEditorWrapperClassName(fullscreenEdit: boolean) {
    return clsx('min-w-0 flex-1', fullscreenEdit && 'min-h-0');
}

// The editor sits on the card: its background matches the surface it's on.
export const defineMdxEditorThemes: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('admin-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {'editor.background': '#ffffff'},
    });
    monaco.editor.defineTheme('admin-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {'editor.background': '#0f172a'},
    });
};

export function mdxEditorThemeName(theme: 'light' | 'dark') {
    return theme === 'dark' ? 'admin-dark' : 'admin-light';
}

// An edit, unlike simulated typing, is not touched by auto-indent.
export function insertTextAtSelection(
    editorInstance: editor.IStandaloneCodeEditor | null,
    text: string,
) {
    const selection = editorInstance?.getSelection();
    if (!editorInstance || !selection) {
        return;
    }
    editorInstance.executeEdits('mdx-field', [
        {range: selection, text, forceMoveMarkers: true},
    ]);
    editorInstance.focus();
}

export function imageMarkdownSnippet(url: string) {
    return `![Opis obrazu](${url})`;
}

// A block starts on a line of its own, with a blank line around it.
export function blockSnippet(snippet: string) {
    return `\n${snippet}\n`;
}
