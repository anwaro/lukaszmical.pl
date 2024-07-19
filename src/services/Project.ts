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
        const projectPath = this.getProjectsPath(slug);

        if (!fs.existsSync(projectPath)) {
            return undefined;
        }

        const files = await fs.promises.readdir(projectPath);
        const project = await client.getProjectBySlug(slug);

        if (!files.length || project === null) {
            return undefined;
        }
        const cssFiles = await this.getProjectTypeFile(slug, 'css', minFile);
        const jsFiles = await this.getProjectTypeFile(slug, 'js', minFile);

        return {
            ...project,
            cssFiles,
            jsFiles,
        };
    };

    getProjectTypeFile = async (slug: string, type: AssetType, minType = false) => {
        const dir = this.getProjectsPath(`${slug}/${type}`);
        if (fs.existsSync(dir)) {
            const jsFiles = await fs.promises.readdir(dir);
            return this.filterAssetFile(jsFiles, minType, type);
        }
        return [];
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
