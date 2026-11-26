import {EntryInput, EntryPresentation} from '@/types/entry';
import {Locale} from '@/types/locale';

export const presentationLabels: Record<EntryPresentation, string> = {
    article: 'Artykuł',
    app: 'Aplikacja',
    link: 'Link',
};

export const contentHelp =
    'MDX z bloków. W trybie edycji biblioteka bloków po prawej wstawia blok w miejscu kursora.';

export type EntryKindFlags = {
    isPage: boolean;
    isCaseStudy: boolean;
    isProject: boolean;
    // Projects also have the `app`/`link` presentations; a page or case
    // study is always "an article" for the purpose of showing the MDX field.
    isArticle: boolean;
};

export function entryKindFlags(values: EntryInput): EntryKindFlags {
    const isPage = values.kind === 'page';
    const isCaseStudy = values.kind === 'case_study';
    const isProject = values.kind === 'project';
    const isArticle = !isProject || values.presentation === 'article';

    return {isPage, isCaseStudy, isProject, isArticle};
}

export function textFieldName(locale: Locale, field: string) {
    return `texts.${locale}.${field}`;
}
