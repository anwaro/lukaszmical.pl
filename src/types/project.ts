import {ProjectRow} from '@/types/supabase/projects';

export type AssetType = 'js' | 'css';

export type ProjectWitAssets = ProjectRow & {
    cssFiles: string[];
    jsFiles: string[];
};
