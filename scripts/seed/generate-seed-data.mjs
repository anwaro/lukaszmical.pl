// Parses a Supabase `pg_dump` (plain SQL) backup and extracts the public
// application tables into a JSON seed used by `scripts/seed/seed.ts`.
//
// Usage:
//   node scripts/seed/generate-seed-data.mjs <path-to-.backup>
//
// The emitted `seed-data.json` is git-ignored — it is derived data, not source.

import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// Tables to extract, with the column order used by their COPY block.
const TABLES = {
    'public.projects': [
        'id',
        'createdAt',
        'url',
        'type',
        'themeCss',
        'myQuery',
        'published',
        'order',
        'cover',
    ],
    'public.projects_strings': ['id', 'projectId', 'locale', 'type', 'value'],
};

const BOOLEAN_COLUMNS = new Set(['themeCss', 'myQuery', 'published']);
const NUMBER_COLUMNS = new Set(['id', 'projectId', 'order']);

function unescape(value) {
    return value
        .replace(/\\t/g, '\t')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\\\/g, '\\');
}

function parseValue(column, raw) {
    if (raw === '\\N') {
        return null;
    }
    if (BOOLEAN_COLUMNS.has(column)) {
        return raw === 't';
    }
    if (NUMBER_COLUMNS.has(column)) {
        return Number(raw);
    }
    return unescape(raw);
}

function extractTable(lines, table, columns) {
    const header = `COPY ${table} (`;
    const start = lines.findIndex((line) => line.startsWith(header));
    if (start === -1) {
        throw new Error(`COPY block for ${table} not found in backup`);
    }

    const rows = [];
    for (let i = start + 1; i < lines.length; i += 1) {
        const line = lines[i];
        if (line === '\\.') {
            break;
        }
        const cells = line.split('\t');
        const row = {};
        columns.forEach((column, index) => {
            row[column] = parseValue(column, cells[index]);
        });
        rows.push(row);
    }
    return rows;
}

const backupPath = process.argv[2];
if (!backupPath) {
    console.error(
        'Usage: node scripts/seed/generate-seed-data.mjs <path-to-.backup>',
    );
    process.exit(1);
}

const sql = readFileSync(resolve(backupPath), 'utf8');
const lines = sql.split('\n');

const data = {
    projects: extractTable(lines, 'public.projects', TABLES['public.projects']),
    projectsStrings: extractTable(
        lines,
        'public.projects_strings',
        TABLES['public.projects_strings'],
    ),
};

const outPath = resolve(here, 'seed-data.json');
writeFileSync(outPath, `${JSON.stringify(data, null, 4)}\n`);

console.log(
    `Wrote ${data.projects.length} projects and ` +
        `${data.projectsStrings.length} project strings to ${outPath}`,
);
