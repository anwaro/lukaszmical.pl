import {describe, expect, it, vi} from 'vitest';

import {Entry, EntryBase, emptyEntryTexts} from '@/types/entry';

import {MediaReferenceUpdater} from './media-reference-updater';

const from = 'https://assets.example.com/photo.jpg';
const to = 'https://assets.example.com/blog/photo.jpg';

function entry(
    overrides: Partial<EntryBase> = {},
    content: Partial<{pl: string; en: string}> = {},
): Entry {
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
        texts: {
            pl: {...emptyEntryTexts(), content: content.pl ?? ''},
            en: {...emptyEntryTexts(), content: content.en ?? ''},
        },
    };
}

function updaterWith(entries: Entry[]) {
    const repository = {
        listAll: vi.fn((kind: EntryBase['kind']) =>
            Promise.resolve(
                entries
                    .filter((item) => item.kind === kind)
                    .map(({texts: _texts, ...base}) => base),
            ),
        ),
        getById: vi.fn((id: number) =>
            Promise.resolve(entries.find((item) => item.id === id) ?? null),
        ),
        update: vi.fn(() => Promise.resolve()),
    };
    return {updater: new MediaReferenceUpdater(repository), repository};
}

describe('MediaReferenceUpdater', () => {
    it('changes nothing when the url is not referenced', async () => {
        const {updater, repository} = updaterWith([entry({}, {pl: 'no images'})]);

        await expect(updater.replaceUrl(from, to)).resolves.toEqual([]);
        expect(repository.update).not.toHaveBeenCalled();
    });

    it('rewrites the cover and every occurrence in the texts', async () => {
        const {updater, repository} = updaterWith([
            entry(
                {id: 3, cover: from},
                {pl: `<Shot src="${from}" /> ![a](${from})`, en: `![b](${from})`},
            ),
        ]);

        await expect(updater.replaceUrl(from, to)).resolves.toEqual([3]);
        expect(repository.update).toHaveBeenCalledTimes(1);

        const [id, input] = repository.update.mock.calls[0] as unknown as [
            number,
            Entry,
        ];
        expect(id).toBe(3);
        expect(input.cover).toBe(to);
        expect(input.texts.pl.content).toBe(`<Shot src="${to}" /> ![a](${to})`);
        expect(input.texts.en.content).toBe(`![b](${to})`);
        expect(input).not.toHaveProperty('id');
    });

    it('does nothing when the url does not change', async () => {
        const {updater, repository} = updaterWith([entry({cover: from})]);

        await expect(updater.replaceUrl(from, from)).resolves.toEqual([]);
        expect(repository.update).not.toHaveBeenCalled();
    });
});
