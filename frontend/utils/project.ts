import {Project, ProjectFileInfo} from '~interfaces/project';

import {readDir, readFile} from './projectFs';
import renderHtml from './renderHtml';

type AssetType = 'js' | 'css';
const themeCss = (min: boolean) => `theme.${min ? '.min' : ''}css`;
const myQueryJs = (min: boolean) => `myQuery.${min ? '.min' : ''}js`;

const jsTag = (path: string) => `<script src="${path}"></script>`;
const cssTag = (path: string) => `<link rel="stylesheet" href="${path}" />`;
const assetUrl = (path: string) => `/assets/${path}`;

export const getProjectsPath = (path: string) => {
    path = path.replace(/^\//, '');
    return `${__dirname}/../projects/${path}`.replace(/\/\//, '/');
};

export const getProjects = async () => {
    const projects = await readDir(getProjectsPath(''));
    return projects.filter((name) => !name.includes('.'));
};

export const getProjectsInfos = async () => {
    const projects = await getProjects();
    return Promise.all(
        projects.map(async (slug) => {
            return await getProjectInfoFile(slug);
        }),
    );
};

export const getMainTemplate = async () => {
    return await readFile(getProjectsPath('template.html'));
};

export const getProjectHtml = async (slug: string) => {
    return await readFile(getProjectsPath(`${slug}/index.html`));
};

export const filterAssetFile = (
    files: string[],
    minType: boolean,
    assetType: AssetType,
) => {
    return files
        .filter((f) => f.includes(`.${assetType}`))
        .filter((f) => {
            if (minType) {
                return f.includes('.min');
            }
            if (!f.includes('.min')) {
                return true;
            }

            return !files.includes(f.replace(`.min.${assetType}`, `.${assetType}`));
        });
};

export const getProjectJsFiles = async (slug: string, minType = false) => {
    const jsFiles = await readDir(getProjectsPath(`${slug}/js`));
    return filterAssetFile(jsFiles, minType, 'js');
};

export const getProjectCssFiles = async (slug: string, minType = false) => {
    const cssFiles = await readDir(getProjectsPath(`${slug}/css`));
    return filterAssetFile(cssFiles, minType, 'css');
};

export const getProjectInfoFile = async (slug: string) => {
    const content = await readFile(getProjectsPath(`${slug}/project.json`));
    return JSON.parse(content) as ProjectFileInfo;
};

const pickTypeValue = <T>(type: AssetType, cssValue: T, jsValue: T): T =>
    type === 'css' ? cssValue : jsValue;

export const createAsset = (
    {slug, requireThemeCss, requireMyQuery, cssFiles, jsFiles}: Project,
    type: AssetType,
    minFile = false,
) => {
    const mapper = pickTypeValue(type, cssTag, jsTag);
    return [
        ...(pickTypeValue(type, requireThemeCss, requireMyQuery)
            ? [
                  mapper(
                      assetUrl(
                          pickTypeValue(type, themeCss(minFile), myQueryJs(minFile)),
                      ),
                  ),
              ]
            : []),
        ...pickTypeValue(type, cssFiles, jsFiles).map((file: string) =>
            mapper(assetUrl(`${slug}/${type}/${file}`)),
        ),
    ].join('\n');
};

export const renderProject = async (project: Project, minFile = true) => {
    const template = await getMainTemplate();
    const projectHtml = await getProjectHtml(project.slug);

    return renderHtml(template, {
        title: project.name,
        description: project.description,
        content: projectHtml,
        css: createAsset(project, 'css', minFile),
        script: createAsset(project, 'js', minFile),
    });
};

export const getProjectInfo = async (
    slug: string,
    minFile = true,
): Promise<Project | undefined> => {
    const files = await readDir(getProjectsPath(slug));
    if (!files.length) {
        return undefined;
    }
    const cssFiles = await getProjectCssFiles(slug, minFile);
    const jsFiles = await getProjectJsFiles(slug, minFile);
    const projectFileInfo = await getProjectInfoFile(slug);

    return {
        slug,
        ...projectFileInfo,
        cssFiles,
        jsFiles,
    };
};
