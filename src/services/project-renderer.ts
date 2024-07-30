import {AssetType, LocalProject} from '@/types/project';
import {compressHtml} from '@/utils/html';

export class ProjectRenderer {
    public render = async (project: LocalProject, minFile = false) => {
        return compressHtml(
            this.renderHtml(project.template, {
                content: project.html,
                css: this.createAsset(project, 'css', minFile),
                script: this.createAsset(project, 'js', minFile),
            }),
        );
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
        {url, themeCss, myQuery, cssFiles, jsFiles}: LocalProject,
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
