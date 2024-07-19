import {minify} from 'minify';
import fs from 'fs';

const absPath = (path) => {
    return `${process.env.PWD}/public/projects/${path}`
        .replace(/\/\//, '/')
        .replace(/\/$/, '');
};

const getFiles = async (path) => {
    if (fs.existsSync(path)) {
        return await fs.promises.readdir(path);
    }
    return [];
};

const match = (files, type) => {
    const regex = new RegExp(`.*[^min].${type}$`, 'i');
    return files.filter((name) => regex.test(name));
};

const getProjectsFiles = async () => {
    const projects = await getFiles(absPath(''));
    return {
        projects: projects.filter((name) => !name.includes('.')),
        files: projects.filter((name) => name.includes('.')),
    };
};

const minifyFiles = async (files, path) => {
    for (let file of files) {
        const filePath = `${path}/${file}`;
        const minContent = await minify(filePath).catch(console.error);
        if (minContent) {
            await fs.promises.writeFile(
                filePath.replace('.css', '.min.css').replace('.js', '.min.js'),
                minContent,
            );
        } else {
            throw Error(`Error occurred during minify ${filePath}`);
        }
    }
};

const minifyProject = async (slug) => {
    // eslint-disable-next-line no-console
    console.info(`Start minify ${slug} project`);
    const projectPath = absPath(slug);

    const cssDir = absPath(`${slug}/css`);
    const cssFiles = match(await getFiles(cssDir), 'css');
    await minifyFiles(cssFiles, cssDir);

    const jsDir = absPath(`${slug}/js`);
    const jsFiles = match(await getFiles(jsDir), 'js');
    await minifyFiles(jsFiles, jsDir);
};

const run = async () => {
    const {projects, files} = await getProjectsFiles();

    await minifyFiles(match(files, false, 'css'), '');
    await minifyFiles(match(files, false, 'js'), '');

    for (let project of projects) {
        await minifyProject(project);
    }
};

run();
