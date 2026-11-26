import type {editor} from 'monaco-editor';
import type {BeforeMount} from '@monaco-editor/react';

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
