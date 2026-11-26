import {describe, expect, it} from 'vitest';

import {MediaAsset} from '@/types/media';

import {
    baseName,
    distinctFolders,
    folderOf,
    keyInFolder,
    sanitizeFolder,
} from './media-path';

const asset = (key: string): MediaAsset => ({
    key,
    url: `https://assets.example.com/${key}`,
    size: 0,
    lastModified: '2024-01-01T00:00:00.000Z',
});

describe('folderOf', () => {
    it('returns the segment before the first slash', () => {
        expect(folderOf('logos/abc-logo.png')).toBe('logos');
    });

    it('returns null for a root key', () => {
        expect(folderOf('abc-logo.png')).toBeNull();
    });
});

describe('baseName', () => {
    it('strips the folder from the key', () => {
        expect(baseName('logos/abc-logo.png')).toBe('abc-logo.png');
    });

    it('returns the key unchanged with no folder', () => {
        expect(baseName('abc-logo.png')).toBe('abc-logo.png');
    });
});

describe('keyInFolder', () => {
    it('prefixes the base name with the folder', () => {
        expect(keyInFolder('logos/abc-logo.png', 'brand')).toBe(
            'brand/abc-logo.png',
        );
    });

    it('moves a nested key back to the root', () => {
        expect(keyInFolder('logos/abc-logo.png', null)).toBe('abc-logo.png');
    });
});

describe('sanitizeFolder', () => {
    it('lowercases and dashes free text', () => {
        expect(sanitizeFolder(' Project Logos! ')).toBe('project-logos');
    });

    it('returns null for empty input', () => {
        expect(sanitizeFolder('   ')).toBeNull();
    });
});

describe('distinctFolders', () => {
    it('lists sorted folder names, root assets excluded', () => {
        const assets = [
            asset('logos/a.png'),
            asset('b.png'),
            asset('brand/c.png'),
            asset('logos/d.png'),
        ];

        expect(distinctFolders(assets)).toEqual(['brand', 'logos']);
    });
});
