import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {IncludedGroupsIsSeparatedResolver} from './resolver-included-groups-is-separated';

describe('IncludedGroupsIsSeparatedResolver', () => {
    const resolver = new IncludedGroupsIsSeparatedResolver();
    const factory = new ResolverFactory();

    it('Should exclude cells around second included group', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔🟦❔❔❔❔❔🟦❌❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([2, 1, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A10']);
    });

    it('Should extend first included group to width 2', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔🟦❌❔❔❔❔🟦❌❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([2, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A4']);
        expect(result.getExcludedCellsId()).toEqual(['A3']);
    });

    it('Should extend first two included group to width 2', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔🟦❌❔❔❔❔❌🟦❔❔❔❔🟦❔❔❔')
            .getCells();
        const group = factory.getGroup([2, 2, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A4', 'A13']);
        expect(result.getExcludedCellsId()).toEqual(['A3', 'A14']);
    });
});
