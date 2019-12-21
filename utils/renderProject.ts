import fs from "fs";

import {Project} from "../controllers/ProjectsController/projects";
import render from "./render";

const jsTag = (path: string) => `<script src="${path}"></script>`;
const cssTag = (path: string) => `<link rel="stylesheet" href="${path}" />`;
const assetUrl = (path: string) => `/asset/${path}`;

const getFilePath = (file: string) => {
    return `${__dirname}/../${file}`;
};

const getMainTemplate = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(getFilePath("projects/template.html"), (error, content) => {
            resolve(content.toString());
            reject(error);
        });
    });
};

const getProjectHtml = async (project: Project): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(getFilePath(`projects/${project.url}/index.html`), (error, content) => {
            resolve(content.toString());
            reject(error);
        });
    });
};

const createCssAsset = (project: Project) => project.css.map((file: string) => {
    const path = file === "theme.css" ? file : `${project.url}/css/${file}`;
    return cssTag(assetUrl(path));
}).join("\n");

const createJsAsset = (project: Project) => project.js.map((file: string) => {
    const path = file === "myQuery.js" ? file : `${project.url}/js/${file}`;
    return jsTag(assetUrl(path));
}).join("\n");

const renderProject = (project: Project) => {
    return new Promise(async (resolve) => {
        const template = await getMainTemplate();
        const projectHtml = await getProjectHtml(project);

        resolve(
            render(template, {
                title: project.name,
                description: project.description,
                content: projectHtml,
                css: createCssAsset(project),
                script: createJsAsset(project),
            })
        );
    });
};


export default renderProject;