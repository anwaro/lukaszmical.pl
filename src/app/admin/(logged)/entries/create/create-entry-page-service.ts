import {EntryKind, EntryKindList} from '@/types/entry';

const titles: Record<EntryKind, string> = {
    page: 'Nowa strona',
    case_study: 'Nowe case study',
    project: 'Nowy projekt',
};

export class CreateEntryPageService {
    resolveKind(requested: string | undefined): EntryKind {
        return EntryKindList.includes(requested as EntryKind)
            ? (requested as EntryKind)
            : 'project';
    }

    getTitle(kind: EntryKind): string {
        return titles[kind];
    }
}
