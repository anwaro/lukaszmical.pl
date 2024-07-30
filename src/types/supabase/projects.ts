import {Database} from './supabase';

export type ProjectTable = Database['public']['Tables']['projects'];
export type ProjectStringTable = Database['public']['Tables']['projects_strings'];

export type ProjectInsert = ProjectTable['Insert'];
export type ProjectRow = ProjectTable['Row'];

export type ProjectStringsEntity = Record<
    ProjectStringType,
    Record<ProjectLocale, string>
>;

export type LocalizedProjectStringsEntity = Record<ProjectStringType, string>;

export type ProjectStringsListItem = {
    description: string;
    name: string;
};

export type ProjectListItem = Pick<ProjectRow, 'id' | 'type' | 'url' | 'createdAt'> &
    ProjectStringsListItem;

export type ProjectEntity = ProjectRow & ProjectStringsEntity;
export type LocalizedProjectEntity = ProjectRow & LocalizedProjectStringsEntity;

export type ProjectStringInsert = ProjectStringTable['Insert'];
export type ProjectStringRow = ProjectStringTable['Row'];

export type ProjectType = Database['public']['Enums']['ProjectType'];
export type ProjectLocale = Database['public']['Enums']['ProjectLocale'];
export type ProjectStringType = Database['public']['Enums']['ProjectStringType'];
export const ProjectTypeList: ProjectType[] = ['external', 'page', 'project'];
export const ProjectLocalesList: ProjectLocale[] = ['en', 'pl'];
export const ProjectStringTypeList: ProjectStringType[] = [
    'name',
    'description',
    'content',
];
