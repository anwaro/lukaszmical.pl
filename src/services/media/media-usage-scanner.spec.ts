import {describe, expect, it, vi} from 'vitest';

import {EntryBase, emptyEntryTexts, Entry} from '@/types/entry';

import {MediaUsageScanner} from './media-usage-scanner';

const url = 'https://assets.example.com/photo.jpg';

function entryBase(overrides: Partial<EntryBase> = {}): EntryBase {
    return {
        id: 1,
        kind: 'case_study',
        slug: 'a-case-study',
        published: true,
        position: 0,
        featured: false,
        cover: null,
        stack: [],
        period: null,
        siteUrl: null,
        repoUrl: null,
        presentation: 'article',
        linkUrl: null,
        options: {},
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        ...overrides,
    };
}

function entry(overrides: Partial<EntryBase> = {}, content: Partial<{pl: string; en: string}> = {}): Entry {
    const base = entryBase(overrides);
    return {
        ...base,
        texts: {
            pl: {...emptyEntryTexts(), content: content.pl ?? ''},
            en: {...emptyEntryTexts(), content: content.en ?? ''},
        },
    };
}

function scannerWith(entries: Entry[]) {
    const repository = {
        listAll: vi.fn((kind: EntryBase['kind']) =>
            Promise.resolve(
                entries.filter((item) => item.kind === kind).map(({texts: _texts, ...base}) => base),
            ),
        ),
        getById: vi.fn((id: number) =>
            Promise.resolve(entries.find((item) => item.id === id) ?? null),
        ),
    };
    return new MediaUsageScanner(repository);
}

describe('MediaUsageScanner', () => {
    it('finds nothing when the url is not referenced anywhere', async () => {
        const scanner = scannerWith([entry({id: 1, cover: null}, {pl: 'no images here'})]);

        await expect(scanner.findUsages(url)).resolves.toEqual([]);
    });

    it('finds a match on the cover field', async () => {
        const scanner = scannerWith([entry({id: 1, cover: url})]);

        const usages = await scanner.findUsages(url);

        expect(usages).toEqual([
            {entryId: 1, kind: 'case_study', slug: 'a-case-study', field: 'cover', href: '/admin/entries/1'},
        ]);
    });

    it('finds a match inside MDX content, locale included', async () => {
        const scanner = scannerWith([
            entry({id: 2}, {pl: `<Shot src="${url}" alt="opis" />`}),
        ]);

        const usages = await scanner.findUsages(url);

        expect(usages).toEqual([
            {
                entryId: 2,
                kind: 'case_study',
                slug: 'a-case-study',
                field: 'content',
                locale: 'pl',
                href: '/admin/entries/2',
            },
        ]);
    });
});
