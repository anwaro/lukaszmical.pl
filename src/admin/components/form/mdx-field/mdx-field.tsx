import type {editor} from 'monaco-editor';

import React, {useCallback, useMemo, useRef, useState} from 'react';

import {useField} from 'formik';
import Editor, {Monaco, OnMount} from '@monaco-editor/react';
import {Freeze} from 'react-freeze';
import {mdiEye, mdiFileCode} from '@mdi/js';
import {clsx} from 'clsx';

import ButtonsGroup from '@/admin/components/button/buttons-group';
import {Button} from '@/admin/components/button/button';
import {MdxPreview} from '@/admin/components/form/mdx-field/mdx-preview';
import {ButtonImageInput} from '@/admin/components/button/button-image-input';
import {BlockPicker} from '@/admin/components/form/mdx-field/block-picker';
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
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

    const onEditorMount = useCallback<OnMount>(
        (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorRef.current = editor;
            monaco.editor.defineTheme('default', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#1e293b',
                },
            });
            monaco.editor.setTheme('default');
        },
        [],
    );

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
        (url: string) => insertText(`![Image description](${url})`),
        [insertText],
    );

    // A block starts on a line of its own, with a blank line around it.
    const insertBlock = useCallback(
        (snippet: string) => insertText(`\n${snippet}\n`),
        [insertText],
    );

    const cls = useMemo(() => {
        return (className || '').replace(/(h|px)-\d+/g, '');
    }, [className]);

    return (
        <div className={cls} style={{minHeight: 1200}}>
            <div className="sticky top-14 z-10 mb-3 flex border-b border-b-gray-700 bg-slate-800 px-3 pb-3">
                <ButtonsGroup noWrap>
                    <Button
                        color="whiteDark"
                        className={clsx(!showPreview && 'opacity-55')}
                        onClick={() => setShowPreview(true)}
                        icon={mdiEye}
                        title={'Preview mode'}
                        type={'button'}
                        small
                    />
                    <Button
                        color="whiteDark"
                        className={clsx(showPreview && 'opacity-55')}
                        onClick={() => setShowPreview(false)}
                        icon={mdiFileCode}
                        title={'Edit mdx mode'}
                        type={'button'}
                        small
                    />
                    {!showPreview && <ButtonImageInput onChange={insertImage} />}
                </ButtonsGroup>
            </div>
            <Freeze freeze={showPreview}>
                <div className="flex" style={{height: 1200}}>
                    <div className="min-w-0 flex-1">
                        <Editor
                            height="1200px"
                            defaultLanguage="mdx"
                            theme="vs-dark"
                            value={field.value || ''}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                wordWrap: 'on',
                            }}
                            onMount={onEditorMount}
                            onChange={(value) =>
                                helpers.setValue(value ?? '')
                            }
                        />
                    </div>
                    <BlockPicker onInsert={insertBlock} />
                </div>
            </Freeze>
            <Freeze freeze={!showPreview}>
                <div className={'px-3'}>
                    <MdxPreview mdx={field.value} locale={locale} />
                </div>
            </Freeze>
        </div>
    );
};
