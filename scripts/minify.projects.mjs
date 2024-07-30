import fs from 'fs';

import {minify} from 'minify';
import UglifyIs from 'uglify-js';

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
    return files.filter(
        (name) => name.includes(`.${type}`) && !name.includes(`.min.${type}`),
    );
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

const minifyJsFiles = async (
    files,
    path,
    toplevel = true,
    output = 'index.min.js',
) => {
    if (files.length === 0) {
        return;
    }
    const code = {};

    for (let file of files) {
        const filePath = `${path}/${file}`;
        code[file] = await fs.promises.readFile(filePath, 'utf8');
    }

    const result = UglifyIs.minify(code, {
        toplevel: true,
        mangle: {
            reserved: ['$$'],
            toplevel: toplevel,
        },
    });

    if (result.error) {
        throw result.error;
    } else {
        result.warnings && console.log(result.warnings);
        await fs.promises.writeFile(`${path}/${output}`, result.code);
    }
};

const minifyProject = async (slug) => {
    // eslint-disable-next-line no-console
    console.info(`Start minify ${slug} project`);

    const cssDir = absPath(`${slug}/css`);
    const cssFiles = match(await getFiles(cssDir), 'css');
    await minifyFiles(cssFiles, cssDir);

    const jsDir = absPath(`${slug}/js`);
    const jsFiles = match(await getFiles(jsDir), 'js');
    await minifyJsFiles(jsFiles, jsDir);
};

const run = async (main, name) => {
    const {projects, files} = await getProjectsFiles();
    if (main) {
        await minifyFiles(match(files, 'css'), absPath(''));
        for (const file of match(files, 'js')) {
            await minifyJsFiles(
                [file],
                absPath(''),
                false,
                file.replace('.js', '.min.js'),
            );
        }
    }

    for (let project of projects) {
        if (project === name || name === '*') {
            await minifyProject(project);
        }
    }
};

// run();

const mode = process.argv[2] || '';
if (mode.startsWith('--all')) {
    run(true, '*');
} else if (mode.startsWith('--main')) {
    run(true);
} else if (mode.startsWith('--projects')) {
    run(false, '*');
} else if (mode.startsWith('--project')) {
    const [_, name] = mode.split('=');
    run(false, name);
} else {
    console.log(
        [
            'Invalid usage, you must define scope by flag:',
            '  --all          - minify all files, main project file and individual project files.',
            '  --main         - minify  main project ',
            '  --projects     - minify projects files.',
            '  --project=name - minify project files with specific name.',
        ].join('\n'),
    );
}
