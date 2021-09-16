import {ProjectEntity} from '~types/ProjectEntity';

export type ProjectConfig = {
    requireThemeCss: boolean;
    requireMyQuery: boolean;
};

export type ProjectWitAssets = ProjectEntity &
    ProjectConfig & {
        cssFiles: string[];
        jsFiles: string[];
    };
