import {AssetType, ProjectWitAssets} from '@/types/project';
import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import fs from 'fs';

export class Project {
    getProjectsPath = (path: string) => {
        return `${process.env.PWD}/public/projects/${path}`.replace(/\/\//, '/');
    };

    getProjectInfo = async (
        slug: string,
        minFile = true,
    ): Promise<ProjectWitAssets | undefined> => {
        const client = new SupabaseProject();
        const files = await fs.promises.readdir(this.getProjectsPath(slug));
        const project = await client.getProjectBySlug(slug);
        if (!files.length || project === null) {
            return undefined;
        }
        const cssFiles = await this.getProjectCssFiles(slug, minFile);
        const jsFiles = await this.getProjectJsFiles(slug, minFile);

        return {
            ...project,
            cssFiles,
            jsFiles,
        };
    };

    getProjectJsFiles = async (slug: string, minType = false) => {
        const dir = this.getProjectsPath(`${slug}/js`);
        const jsFiles = await fs.promises.readdir(dir);
        return this.filterAssetFile(jsFiles, minType, 'js');
    };

    getProjectCssFiles = async (slug: string, minType = false) => {
        const dir = this.getProjectsPath(`${slug}/css`);
        const cssFiles = await fs.promises.readdir(dir);
        return this.filterAssetFile(cssFiles, minType, 'css');
    };

    filterAssetFile = (files: string[], minType: boolean, assetType: AssetType) => {
        files.sort((a, b) =>
            a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()),
        );
        return files
            .filter((f) => f.includes(`.${assetType}`))
            .filter((f) => {
                if (minType) {
                    return f.includes('.min');
                }
                if (!f.includes('.min')) {
                    return true;
                }

                return !files.includes(
                    f.replace(`.min.${assetType}`, `.${assetType}`),
                );
            });
    };
}
