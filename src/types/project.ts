import {
    Project,
    ProjectInsert as SchemaProjectInsert,
    ProjectString,
    ProjectStringInsert as SchemaProjectStringInsert,
} from '@/services/drizzle/schema';

export type ProjectType = Project['type'];
export type ProjectLocale = ProjectString['locale'];
export type ProjectStringType = ProjectString['type'];

export type ProjectRow = Project;
export type ProjectInsert = SchemaProjectInsert;
export type ProjectStringRow = ProjectString;
export type ProjectStringInsert = SchemaProjectStringInsert;

export type ProjectStringsEntity = Record<
    ProjectStringType,
    Record<ProjectLocale, string>
>;

export type LocalizedProjectStringsEntity = Record<ProjectStringType, string>;

export type ProjectStringsListItem = Omit<LocalizedProjectStringsEntity, 'content'>;

export type ProjectListItem = Pick<
    ProjectRow,
    | 'id'
    | 'type'
    | 'url'
    | 'createdAt'
    | 'cover'
    | 'stack'
    | 'period'
    | 'siteUrl'
    | 'repoUrl'
    | 'featured'
> &
    ProjectStringsListItem;

export type ProjectEntity = ProjectRow & ProjectStringsEntity;
export type LocalizedProjectEntity = ProjectRow & LocalizedProjectStringsEntity;

export const ProjectTypeList: ProjectType[] = [
    'external',
    'page',
    'project',
    'case-study',
];
export const ProjectLocalesList: ProjectLocale[] = ['en', 'pl'];
export const ProjectStringTypeList: ProjectStringType[] = [
    'name',
    'description',
    'content',
    'headline',
    'lead',
    'role',
    'problem',
    'approach',
    'result',
    'meta',
];

export type AssetType = 'js' | 'css';

export type LocalProject = ProjectRow & {
    template: string;
    html: string;
    cssFiles: string[];
    jsFiles: string[];
};

// Splits an entity into the `projects` row and its localized strings.
export function splitProjectEntity<T extends ProjectStringsEntity>(
    entity: T,
): {row: Omit<T, ProjectStringType>; strings: ProjectStringsEntity} {
    const row: Record<string, unknown> = {...entity};
    const strings = {} as ProjectStringsEntity;

    for (const type of ProjectStringTypeList) {
        strings[type] = entity[type];
        delete row[type];
    }

    return {row: row as Omit<T, ProjectStringType>, strings};
}
