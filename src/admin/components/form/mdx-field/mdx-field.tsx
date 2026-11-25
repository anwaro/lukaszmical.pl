import type {editor} from 'monaco-editor';

import React, {useCallback, useMemo, useRef, useState} from 'react';

import {useField} from 'formik';
import Editor, {BeforeMount, OnMount} from '@monaco-editor/react';
import {Freeze} from 'react-freeze';
import {Blocks} from 'lucide-react';

import {MdxPreview} from '@/admin/components/form/mdx-field/mdx-preview';
import {ButtonImageInput} from '@/admin/components/button/button-image-input';
import {BlockPicker} from '@/admin/components/form/mdx-field/block-picker';
import {SegmentedControl} from '@/admin/components/segmented-control/segmented-control';
import {useAdminTheme} from '@/admin/theme/theme-provider';
import {Locale} from '@/types/locale';

type Props = {
    name: string;
    // Locale of the edited content — the preview renders its lists in it.
    locale: Locale;
    className?: string;
};

export const MdxField = ({name, locale, className}: Props) => {
    const [field, , helpers] = useField<string>(name);
    const [showPreview, setShowPreview] = useState(true);
    const [showBlocks, setShowBlocks] = useState(false);
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const {theme} = useAdminTheme();

    // The editor sits on the card: its background is the surface token.
    const defineThemes = useCallback<BeforeMount>((monaco) => {
        monaco.editor.defineTheme('kivo-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {'editor.background': '#ffffff'},
        });
        monaco.editor.defineTheme('kivo-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {'editor.background': '#0f172a'},
        });
    }, []);

    const onEditorMount = useCallback<OnMount>((editor) => {
        editorRef.current = editor;
    }, []);

    const insertText = useCallback((text: string) => {
        const editor = editorRef.current;
        const selection = editor?.getSelection();
        if (!editor || !selection) {
            return;
        }
        // An edit, unlike simulated typing, is not touched by auto-indent.
        editor.executeEdits('mdx-field', [
            {range: selection, text, forceMoveMarkers: true},
        ]);
        editor.focus();
    }, []);

    const insertImage = useCallback(
        (url: string) => insertText(`![Opis obrazu](${url})`),
        [insertText],
    );

    // A block starts on a line of its own, with a blank line around it.
    const insertBlock = useCallback(
        (snippet: string) => insertText(`\n${snippet}\n`),
        [insertText],
    );

    const cls = useMemo(() => {
        return (className || '').replace(/kv-input|(h|px)-\d+/g, '');
    }, [className]);

    return (
        <div className={cls} style={{minHeight: 1200}}>
            <div className="kv-toolbar mb-3 flex items-center gap-2 border-b border-(--border-subtle) py-2">
                <SegmentedControl
                    label="Tryb edytora"
                    hideLabel
                    size="sm"
                    className="w-52"
                    value={showPreview ? 'preview' : 'edit'}
                    onChange={(mode) => setShowPreview(mode === 'preview')}
                    options={[
                        {value: 'preview', label: 'Podgląd'},
                        {value: 'edit', label: 'Edycja MDX'},
                    ]}
                />
                {!showPreview && (
                    <>
                        <ButtonImageInput onChange={insertImage} />
                        <button
                            type="button"
                            aria-pressed={showBlocks}
                            onClick={() => setShowBlocks((prev) => !prev)}
                            className="kv-chip ml-auto inline-flex items-center gap-1.5"
                        >
                            <Blocks
                                className="kv-icon"
                                strokeWidth={1.8}
                                aria-hidden
                            />
                            Bloczki
                        </button>
                    </>
                )}
            </div>
            <Freeze freeze={showPreview}>
                <div className="flex flex-col overflow-hidden rounded-lg border border-(--border-control) lg:h-[1200px] lg:flex-row">
                    <div className="min-w-0 flex-1">
                        <Editor
                            height="1200px"
                            defaultLanguage="mdx"
                            theme={theme === 'dark' ? 'kivo-dark' : 'kivo-light'}
                            value={field.value || ''}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                wordWrap: 'on',
                            }}
                            beforeMount={defineThemes}
                            onMount={onEditorMount}
                            onChange={(value) => helpers.setValue(value ?? '')}
                        />
                    </div>
                    {showBlocks && (
                        <BlockPicker
                            locale={locale}
                            onInsert={insertBlock}
                            onClose={() => setShowBlocks(false)}
                        />
                    )}
                </div>
            </Freeze>
            <Freeze freeze={!showPreview}>
                <MdxPreview mdx={field.value} locale={locale} />
            </Freeze>
        </div>
    );
};
