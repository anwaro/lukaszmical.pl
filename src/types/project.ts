import {ProjectRow} from '@/types/supabase/projects';

export type AssetType = 'js' | 'css';

export type LocalProject = ProjectRow & {
    template: string;
    html: string;
    cssFiles: string[];
    jsFiles: string[];
};
