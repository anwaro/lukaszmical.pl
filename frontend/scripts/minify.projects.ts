import minify from 'minify';

import {RunParams} from '~types/scripts';
import {
    filterAssetFile,
    getProjectCssFiles,
    getProjectJsFiles,
    getProjectsPath,
} from '~utils/project';
import {readDir, writeFile} from '~utils/projectFs';

const getProjectsFiles = async () => {
    const projects = await readDir(getProjectsPath(''));
    return {
        projects: projects.filter((name) => !name.includes('.')),
        files: projects.filter((name) => name.includes('.')),
    };
};

const minifyFiles = async (
    files: string[],
    slug: string,
    dir: string,
    type: string,
) => {
    for (let file of files) {
        const filePath = getProjectsPath(`${slug}/${dir}/${file}`);
        const minFilePath = filePath.replace(`.${type}`, `.min.${type}`);
        const minContent = await minify(filePath).catch(console.error);
        if (minContent) {
            await writeFile(minFilePath, minContent);
        } else {
            throw Error(`Error occurred during minify ${slug}:${file}`);
        }
    }
};

const minifyProject = async (slug: string) => {
    // eslint-disable-next-line no-console
    console.info(`Start minify ${slug} project`);
    const jsFiles = await getProjectJsFiles(slug, false);
    const cssFiles = await getProjectCssFiles(slug, false);
    await minifyFiles(jsFiles, slug, 'js', 'js');
    await minifyFiles(cssFiles, slug, 'css', 'css');
};

// eslint-disable-next-line no-unused-vars
const run = async (_params: RunParams) => {
    const {projects, files} = await getProjectsFiles();
    await minifyFiles(filterAssetFile(files, false, 'js'), '', '', 'js');
    await minifyFiles(filterAssetFile(files, false, 'css'), '', '', 'css');

    for (let project of projects) {
        await minifyProject(project);
    }
};

export default run;
