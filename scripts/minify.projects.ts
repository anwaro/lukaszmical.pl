import {minify} from 'minify';
import {Project} from '@/services/Project';
import fs from 'fs';

const project = new Project();

const getProjectsFiles = async () => {
    const projects = await fs.promises.readdir(project.getProjectsPath(''));
    return {
        projects: projects.filter((name: string) => !name.includes('.')),
        files: projects.filter((name: string) => name.includes('.')),
    };
};

const minifyFiles = async (
    files: string[],
    slug: string,
    dir: string,
    type: string,
) => {
    for (let file of files) {
        const filePath = project.getProjectsPath(`${slug}/${dir}/${file}`);
        const minFilePath = filePath.replace(`.${type}`, `.min.${type}`);
        const minContent = await minify(filePath).catch(console.error);
        if (minContent) {
            await fs.promises.writeFile(minFilePath, minContent);
        } else {
            throw Error(`Error occurred during minify ${slug}:${file}`);
        }
    }
};

const minifyProject = async (slug: string) => {
    // eslint-disable-next-line no-console
    console.info(`Start minify ${slug} project`);
    const jsFiles = await project.getProjectJsFiles(slug, false);
    const cssFiles = await project.getProjectCssFiles(slug, false);
    await minifyFiles(jsFiles, slug, 'js', 'js');
    await minifyFiles(cssFiles, slug, 'css', 'css');
};

const run = async () => {
    const {projects, files} = await getProjectsFiles();
    await minifyFiles(project.filterAssetFile(files, false, 'js'), '', '', 'js');
    await minifyFiles(project.filterAssetFile(files, false, 'css'), '', '', 'css');

    for (let project of projects) {
        await minifyProject(project);
    }
};

export default run;
