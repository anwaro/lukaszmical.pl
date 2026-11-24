import {describe, expect, it} from 'vitest';

import {blockNames, blockSections} from './block-library';

describe('block-library', () => {
    it('lists every block once', () => {
        expect(new Set(blockNames).size).toBe(blockNames.length);
    });

    it('has unique section ids', () => {
        const ids = blockSections.map((section) => section.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('gives each block a snippet that uses it and its parts', () => {
        for (const section of blockSections) {
            for (const block of section.blocks) {
                const parts: readonly string[] = 'parts' in block ? block.parts : [];
                for (const name of [block.name, ...parts]) {
                    expect(block.snippet).toContain(`<${name}`);
                }
            }
        }
    });
});
