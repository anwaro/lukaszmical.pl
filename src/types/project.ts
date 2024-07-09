import {ProjectRow} from '@/services/supabase/SupabaseProject';

export type AssetType = 'js' | 'css';

export type ProjectWitAssets = ProjectRow & {
    cssFiles: string[];
    jsFiles: string[];
};
