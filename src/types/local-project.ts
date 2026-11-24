export type AssetType = 'js' | 'css';

// A legacy app read from `public/projects/<slug>`, ready to be rendered.
export type LocalProject = {
    slug: string;
    themeCss: boolean;
    myQuery: boolean;
    template: string;
    html: string;
    cssFiles: string[];
    jsFiles: string[];
};
