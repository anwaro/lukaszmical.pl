export type Project = {
    slug: string;
    name: string;
    description: string;
    requireThemeCss: boolean;
    requireMyQuery: boolean;
    createdAt: string;
    order: number;
    published: boolean;
};

export type ProjectWitAssets = Project & {
    cssFiles: string[];
    jsFiles: string[];
};

export type ProjectListItem = Omit<Project, 'order' | 'published'>;
