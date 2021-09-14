import fs from 'fs';

import {ProjectListItem} from '~interfaces/project';
import {RunParams} from '~interfaces/scripts';

const projects: ProjectListItem[] = [
    {
        slug: 'animal',
        name: 'Animal',
        description: 'Animal animation',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2018-12-27',
    },
    {
        slug: 'animate',
        name: 'Animacja',
        description: 'Prosta animacja',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2015-05-22',
    },
    {
        slug: 'audio',
        name: 'Audio Visualizer 3D',
        description: '',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2016-09-23',
    },
    {
        slug: 'billiards',
        name: 'Bilard',
        description: 'Bilard',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2015-05-22',
    },
    {
        slug: 'canvas3d',
        name: 'Canvas 3D',
        description: 'Biblioteka 3d',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-09-27',
    },
    {
        slug: 'car3d',
        name: 'Car 3D model',
        description: 'Model samochodu ',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-02-12',
    },
    {
        slug: 'clock',
        name: 'Clock',
        description: 'Zegarek analogowy',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2015-11-13',
    },
    {
        slug: 'colorpicker',
        name: 'Kolor picker',
        description: '',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-03-14',
    },
    {
        slug: 'draw',
        name: 'Paint',
        description: 'Internetowy paint',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2015-05-28',
    },
    {
        slug: 'drop',
        name: 'Drops',
        description: 'Ruch bąbelków',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2017-07-11',
    },
    {
        slug: 'flappy',
        name: 'Flappy Birds',
        description: 'Popularna gra flappy birds.',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2015-05-20',
    },
    {
        slug: 'gauss',
        name: 'Gauss',
        description: 'Rozkład liczb pseudolosowych',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-02-23',
    },
    {
        slug: 'graf',
        name: 'Graf',
        description: 'Grafik',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-06-02',
    },
    {
        slug: 'graph',
        name: 'Graph',
        description: 'Aplikacja rysująca wykresy',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2015-11-07',
    },
    {
        slug: 'grid',
        name: 'Particle',
        description: 'Cząstki oddziałujące z kursorem',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2017-06-28',
    },
    {
        slug: 'hangman',
        name: 'Wisielec',
        description: 'Gra wisielec',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2015-11-18',
    },
    {
        slug: 'jigsaw',
        name: 'Układanka',
        description: 'Układanka z zdjęcia',
        requireThemeCss: true,
        requireMyQuery: true,
        createdAt: '2015-11-09',
    },
    {
        slug: 'jump',
        name: 'Jump',
        description: '-',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-02-20',
    },
    {
        slug: 'life',
        name: 'Gra w życie',
        description: '',
        requireThemeCss: true,
        requireMyQuery: true,
        createdAt: '2016-10-02',
    },
    {
        slug: 'math',
        name: 'Wykresy ',
        description: 'Aplikacja do rysowania wykresu funkcji.',
        requireThemeCss: true,
        requireMyQuery: false,
        createdAt: '2015-05-06',
    },
    {
        slug: 'mathcode',
        name: 'Math Code',
        description: 'Kod funckcji',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-03-10',
    },
    {
        slug: 'md5',
        name: 'Md5 Generator',
        description:
            'This online tool allows you to generate the MD5 hash of any string.',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2018-07-01',
    },
    {
        slug: 'mp3player',
        name: 'Mp3 Player',
        description: 'Odtwarzacz muzyki',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2015-11-19',
    },
    {
        slug: 'my-query',
        name: 'myQuery',
        description: 'Mała biblioteka js',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-09-19',
    },
    {
        slug: 'photo',
        name: 'Pixel photo',
        description: 'Dodaje efekt łączenia kolorów w większe piksele.',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2015-05-06',
    },
    {
        slug: 'photoeditor',
        name: 'Edytor zdjęć',
        description: 'Dodaje filtry do zdjęcia.',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2016-03-10',
    },
    {
        slug: 'photofilter',
        name: 'Photo filter',
        description: 'Dodaje filtry do zdjęcia.',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2015-05-04',
    },
    {
        slug: 'plot',
        name: 'Wykresy ',
        description: 'Aplikacja do rysowania wykresu funkcji.',
        requireThemeCss: true,
        requireMyQuery: false,
        createdAt: '2015-05-27',
    },
    {
        slug: 'puzzles',
        name: 'Puzzle',
        description: 'Układaj puzzle z własnych zdjęć',
        requireThemeCss: true,
        requireMyQuery: true,
        createdAt: '2015-05-14',
    },
    {
        slug: 'record',
        name: 'Record',
        description: 'Nagrywanie filmu z elementu canvas',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2015-11-12',
    },
    {
        slug: 'rubikscube',
        name: 'Kostka rubika',
        description: '',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-03-16',
    },
    {
        slug: 'run',
        name: 'Run calculator',
        description: 'Calculate speed, pace, distance and time',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2017-06-07',
    },
    {
        slug: 'runner',
        name: 'Runner',
        description: 'Runner animation',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2018-12-27',
    },
    {
        slug: 'squash',
        name: 'Squash',
        description: 'Squash',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2015-05-21',
    },
    {
        slug: 'stayalive',
        name: 'Stay Alive',
        description: 'Ruszaj piłką i unikaj min',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2014-11-12',
    },
    {
        slug: 'sync',
        name: 'Sync',
        description: '-',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2016-06-29',
    },
    {
        slug: 'temp',
        name: 'Tenperatura',
        description: 'Temperaturę na ziemi w zależności od parametrów.',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2014-06-12',
    },
    {
        slug: 'test',
        name: 'Test',
        description: 'Test',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2015-05-20',
    },
    {
        slug: 'tetris',
        name: 'Tetris',
        description: 'Tetris',
        requireThemeCss: true,
        requireMyQuery: false,
        createdAt: '2015-05-21',
    },
    {
        slug: 'text',
        name: 'Text Statistics',
        description: 'Text Statistics',
        requireThemeCss: false,
        requireMyQuery: false,
        createdAt: '2017-06-16',
    },
    {
        slug: 'visualizer',
        name: 'Visualiser 3D',
        description: 'Audio visualizer 3D',
        requireThemeCss: false,
        requireMyQuery: true,
        createdAt: '2016-09-20',
    },
];

const getFilePath = (file: string) => {
    return `${__dirname}/../${file}`;
};

export const saveProjectInfo = (
    projectName: string,
    content: string,
): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(
            getFilePath(`projects/${projectName}/project.json`),
            content,
            (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            },
        );
    });
};

const run = async (_params: RunParams) => {
    for (let project of projects) {
        await saveProjectInfo(
            project.slug,
            JSON.stringify(
                {
                    name: project.name,
                    description: project.description,
                    requireThemeCss: project.requireThemeCss,
                    requireMyQuery: project.requireMyQuery,
                    createdAt: project.createdAt,
                    order: 100,
                    published: false,
                },
                null,
                4,
            ),
        );

        // eslint-disable-next-line no-console
        console.log(`Created info file for ${project.name} project`);
    }
    return 'Done';
};

export default run;
