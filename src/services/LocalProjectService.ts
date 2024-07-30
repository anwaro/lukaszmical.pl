import fs from 'fs';

import {AssetType, LocalProject} from '@/types/project';
import {ProjectRow} from '@/types/supabase/projects';

export class LocalProjectService {
    getProjectsPath = (path: string) => {
        return `${process.env.PWD}/public/projects/${path}`.replace(/\/\//, '/');
    };

    toLocalProject = async (
        project: ProjectRow,
        minFile = true,
    ): Promise<LocalProject | undefined> => {
        const projectPath = this.getProjectsPath(project.url);

        if (!fs.existsSync(projectPath)) {
            return undefined;
        }

        const template = await this.readFile('template.html');
        const html = await this.readFile(`${project.url}/index.html`);
        const cssFiles = await this.getProjectTypeFile(project.url, 'css', minFile);
        const jsFiles = await this.getProjectTypeFile(project.url, 'js', minFile);

        return {
            ...project,
            template,
            html,
            cssFiles,
            jsFiles,
        };
    };

    readFile = async (file: string) => {
        return fs.promises.readFile(this.getProjectsPath(file), {encoding: 'utf8'});
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
                return !f.includes('.min');
            });
    };
}
