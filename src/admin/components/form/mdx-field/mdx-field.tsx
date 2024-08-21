import type {editor} from 'monaco-editor';

import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Field} from 'formik';
import {FieldProps} from 'formik/dist/Field';
import Editor, {Monaco, OnMount} from '@monaco-editor/react';
import {Freeze} from 'react-freeze';
import {mdiEye, mdiFileCode} from '@mdi/js';
import {clsx} from 'clsx';

import ButtonsGroup from '@/admin/components/button/buttons-group';
import {Button} from '@/admin/components/button/button';
import {MdxPreview} from '@/admin/components/form/mdx-field/mdx-preview';
import {ButtonImageInput} from '@/admin/components/button/button-image-input';

type Props = {
    name: string;
    className?: string;
};

export const MdxField = ({name, className}: Props) => {
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

    const insertImage = useCallback((url: string) => {
        editorRef.current?.trigger('keyboard', 'type', {
            text: `![Image description](${url})`,
        });
    }, []);

    const cls = useMemo(() => {
        return (className || '').replace(/(h|px)-\d+/g, '');
    }, [className]);

    return (
        <div className={cls} style={{minHeight: 600}}>
            <div className="mb-3 flex border-b border-b-gray-700 px-3 pb-3">
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
            <Field
                name={name}
                component={({field, form}: FieldProps<string>) => (
                    <>
                        <Freeze freeze={showPreview}>
                            <Editor
                                height="600px"
                                defaultLanguage="mdx"
                                theme="vs-dark"
                                value={field.value || ''}
                                options={{
                                    minimap: {
                                        enabled: false,
                                    },
                                }}
                                onMount={onEditorMount}
                                onChange={(value) =>
                                    form.setFieldValue(field.name, value)
                                }
                            />
                        </Freeze>
                        <Freeze freeze={!showPreview}>
                            <div className={'px-3'}>
                                <MdxPreview mdx={field.value} />
                            </div>
                        </Freeze>
                    </>
                )}
            />
        </div>
    );
};
