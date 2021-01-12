import fs from 'fs';

import {Project} from '../controllers/ProjectsController/projects';

import render from './render';

const jsTag = (path: string) => `<script src="${path}"></script>`;
const cssTag = (path: string) => `<link rel="stylesheet" href="${path}" />`;
const assetUrl = (path: string) => `/assets/${path}`;

const getFilePath = (file: string) => {
    return `${__dirname}/../${file}`;
};

const getMainTemplate = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(getFilePath('projects/template.html'), (error, content) => {
            if (error) {
                reject(error);
            } else {
                resolve(content.toString());
            }
        });
    });
};

const getProjectHtml = async (project: Project): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(
            getFilePath(`projects/${project.slug}/index.html`),
            (error, content) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(content.toString());
                }
            },
        );
    });
};

const createAsset = (project: Project, type: 'css' | 'js') => {
    const mapper = type === 'css' ? cssTag : jsTag;
    const addGlobal = type === 'css' ? project.globalCss : project.globalJs;
    const files = type === 'css' ? project.css : project.js;
    const globalFile = type === 'css' ? 'theme.css' : 'myQuery.js';
    return [
        ...(addGlobal ? [mapper(assetUrl(globalFile))] : []),
        ...files.map((file: string) =>
            mapper(assetUrl(`${project.slug}/${type}/${file}`)),
        ),
    ].join('\n');
};

const renderProject = async (project: Project) => {
    const template = await getMainTemplate();
    const projectHtml = await getProjectHtml(project);

    return render(template, {
        title: project.name,
        description: project.description,
        content: projectHtml,
        css: createAsset(project, 'css'),
        script: createAsset(project, 'js'),
    });
};

export default renderProject;
