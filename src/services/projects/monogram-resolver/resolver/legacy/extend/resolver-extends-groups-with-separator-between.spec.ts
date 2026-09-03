import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {ExtendsGroupsWithSeparatorBetweenResolver} from './resolver-extends-groups-with-separator-between';

describe('ExtendsGroupsWithSeparatorBetweenResolver', () => {
    const resolver = new ExtendsGroupsWithSeparatorBetweenResolver();
    const factory = new ResolverFactory();

    it('should extend first included group to 3', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❌❌❔❔❔❔❔🟦🟦❌🟦🟦❌❔🟦🟦🟦❔')
            .getCells();
        const group = factory.getGroup([1, 3, 2, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A9']);
        expect(result.getExcludedCellsId()).toEqual(['A8']);
    });

    it('should return empty result two potential values', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❌❌❔❔❔❔❔🟦🟦❌🟦🟦❔❌🟦🟦🟦❔')
            .getCells();
        const group = factory.getGroup([1, 3, 2, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result two potential values - real case', () => {
        const cells = factory
            .init()
            .fromPattern('🟦🟦❌❌❌❌🟦🟦❌🟦🟦❔🟦❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([2, 2, 5, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
