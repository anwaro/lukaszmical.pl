import React, {useState} from 'react';

import {useField} from 'formik';

import {listFieldTextToValue, listFieldValueToText} from './list-field-model';

type Props = {
    name: string;
    placeholder?: string;
};

// Edits a string[] field as a comma-separated list.
export function ListField({name, ...props}: Props) {
    const [field, , helpers] = useField<string[]>(name);
    const [text, setText] = useState(listFieldValueToText(field.value));

    return (
        <input
            {...props}
            value={text}
            onChange={(event) => {
                setText(event.target.value);
                helpers.setValue(listFieldTextToValue(event.target.value));
            }}
        />
    );
}
