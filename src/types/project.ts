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

export type ProjectStringsListItem = {
    description: string;
    name: string;
};

export type ProjectListItem = Pick<
    ProjectRow,
    'id' | 'type' | 'url' | 'createdAt' | 'cover'
> &
    ProjectStringsListItem;

export type ProjectEntity = ProjectRow & ProjectStringsEntity;
export type LocalizedProjectEntity = ProjectRow & LocalizedProjectStringsEntity;

export const ProjectTypeList: ProjectType[] = ['external', 'page', 'project'];
export const ProjectLocalesList: ProjectLocale[] = ['en', 'pl'];
export const ProjectStringTypeList: ProjectStringType[] = [
    'name',
    'description',
    'content',
];

export type AssetType = 'js' | 'css';

export type LocalProject = ProjectRow & {
    template: string;
    html: string;
    cssFiles: string[];
    jsFiles: string[];
};
