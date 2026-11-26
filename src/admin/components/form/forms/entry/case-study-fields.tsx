import React from 'react';

import {Field} from 'formik';

import {Locale} from '@/types/locale';
import {FormField} from '@/admin/components/form/form-field/form-field';

import {textFieldName} from './entry-fields-model';

type Props = {
    locale: Locale;
};

// Extra fields a case study has over a project or page.
export function CaseStudyFields({locale}: Props) {
    const text = (field: string) => textFieldName(locale, field);

    return (
        <>
            <FormField
                label="Nagłówek"
                help="Tytuł karty na stronie głównej, np. „itmbw.pl — serwis biegowy z aplikacją dla biegaczy”"
                locale={locale}
            >
                <Field key={locale} name={text('headline')} />
            </FormField>
            <FormField label="Rola" locale={locale}>
                <Field key={locale} name={text('role')} />
            </FormField>
            <FormField
                label="Problem (karta na stronie głównej)"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={text('problem')} as="textarea" />
            </FormField>
            <FormField
                label="Podejście (karta na stronie głównej)"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={text('approach')} as="textarea" />
            </FormField>
            <FormField
                label="Rezultat (karta na stronie głównej)"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={text('result')} as="textarea" />
            </FormField>
            <FormField
                label="Dodatkowe fakty"
                help="Jedno „etykieta: wartość” w linii, obok roli, okresu i stacku — np. „platformy: iOS · Android”"
                locale={locale}
                hasTextareaHeight
            >
                <Field key={locale} name={text('facts')} as="textarea" />
            </FormField>
        </>
    );
}
