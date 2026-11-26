import type {editor} from 'monaco-editor';

import React, {useCallback, useRef, useState} from 'react';

import {useField} from 'formik';
import Editor, {OnMount} from '@monaco-editor/react';
import {Freeze} from 'react-freeze';
import {Blocks} from 'lucide-react';

import {MdxPreview} from '@/admin/components/form/mdx-field/mdx-preview';
import {ButtonImageInput} from '@/admin/components/button/button-image-input';
import {BlockPicker} from '@/admin/components/form/mdx-field/block-picker';
import {SegmentedControl} from '@/admin/components/segmented-control/segmented-control';
import {chipClassName} from '@/admin/components/chip-class-name';
import {stripFieldInputClassName} from '@/admin/components/form/field-input-class-name';
import {useAdminTheme} from '@/admin/theme/theme-provider';
import {Locale} from '@/types/locale';

import {
    blockSnippet,
    defineMdxEditorThemes,
    imageMarkdownSnippet,
    insertTextAtSelection,
    mdxEditorThemeName,
} from './mdx-field-model';

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

    const onEditorMount = useCallback<OnMount>((editor) => {
        editorRef.current = editor;
    }, []);

    const insertText = useCallback(
        (text: string) => insertTextAtSelection(editorRef.current, text),
        [],
    );

    const insertImage = useCallback(
        (url: string) => insertText(imageMarkdownSnippet(url)),
        [insertText],
    );

    const insertBlock = useCallback(
        (snippet: string) => insertText(blockSnippet(snippet)),
        [insertText],
    );

    return (
        <div className={stripFieldInputClassName(className)} style={{minHeight: 1200}}>
            <div className="sticky top-14 z-20 mb-3 flex items-center gap-2 border-b border-slate-100 bg-white/90 py-2 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
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
                            className={chipClassName('ml-auto inline-flex items-center gap-1.5')}
                        >
                            <Blocks className="size-5 shrink-0" strokeWidth={1.8} aria-hidden />
                            Bloczki
                        </button>
                    </>
                )}
            </div>
            <Freeze freeze={showPreview}>
                <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 lg:h-300 lg:flex-row dark:border-slate-700">
                    <div className="min-w-0 flex-1">
                        <Editor
                            height="1200px"
                            defaultLanguage="mdx"
                            theme={mdxEditorThemeName(theme)}
                            value={field.value || ''}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                wordWrap: 'on',
                            }}
                            beforeMount={defineMdxEditorThemes}
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
