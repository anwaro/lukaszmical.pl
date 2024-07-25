import {AssetType, ProjectWitAssets} from '@/types/project';
import {Project} from '@/services/Project';
import fs from 'fs';

export class ProjectRenderer {
    private project: Project;

    constructor() {
        this.project = new Project();
    }

    public render = async (slug: string, url: URL, minFile = false) => {
        const project = await this.project.getProjectInfo(slug, minFile);

        if (!project) {
            return undefined;
        }

        const template = await fs.promises.readFile(
            this.project.getProjectsPath('template.html'),
            {encoding: 'utf8'},
        );

        const projectHtml = await fs.promises.readFile(
            this.project.getProjectsPath(`${project.url}/index.html`),
            {encoding: 'utf8'},
        );

        const imagePath = this.assetUrl(`${project.url}/image/cover.jpg`);

        return this.renderHtml(template, {
            title: project.name,
            description: project.description,
            content: projectHtml,
            url: url.href,
            image: `${url.origin}${imagePath}`,
            css: this.createAsset(project, 'css', minFile),
            script: this.createAsset(project, 'js', minFile),
        });
    };

    private themeCss = (min: boolean) => `theme${min ? '.min' : ''}.css`;
    private myQueryJs = (min: boolean) => `myQuery${min ? '.min' : ''}.js`;
    private jsTag = (path: string) => `<script src="${path}"></script>`;
    private cssTag = (path: string) => `<link rel="stylesheet" href="${path}" />`;
    private assetUrl = (path: string) => `/projects/${path}`;

    private renderHtml = (template: string, params: Record<string, string>) => {
        return template.replace(/{{(\w+)}}/gi, (_: string, key: string) =>
            key in params ? params[key] : key,
        );
    };

    private pickTypeValue = <T>(type: AssetType, cssValue: T, jsValue: T): T =>
        type === 'css' ? cssValue : jsValue;

    private createAsset = (
        {url, themeCss, myQuery, cssFiles, jsFiles}: ProjectWitAssets,
        type: AssetType,
        minFile = false,
    ) => {
        const mapper = this.pickTypeValue(type, this.cssTag, this.jsTag);

        const assets = [];

        if (this.pickTypeValue(type, themeCss, myQuery)) {
            assets.push(
                this.pickTypeValue(
                    type,
                    this.assetUrl(this.themeCss(minFile)),
                    this.assetUrl(this.myQueryJs(minFile)),
                ),
            );
        }
        this.pickTypeValue(type, cssFiles, jsFiles).forEach((file: string) => {
            assets.push(this.assetUrl(`${url}/${type}/${file}`));
        });

        return assets.map(mapper).join('\n');
    };
}
