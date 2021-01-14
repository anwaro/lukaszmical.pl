export type Project = {
    slug: string;
    name: string;
    description: string;
    cssFiles: string[];
    requireThemeCss: boolean;
    jsFiles: string[];
    requireMyQuery: boolean;
    createdAt: string;
};

export type ProjectFileInfo = Pick<
    Project,
    'name' | 'description' | 'requireThemeCss' | 'requireMyQuery' | 'createdAt'
>;

export type ProjectListItem = ProjectFileInfo & Pick<Project, 'slug'>;
