import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {AllCellsBeforeIncludedGroupAreResolvedResolver} from './resolver-all-cells-before-included-group-are-resolved';

describe('AllCellsBeforeIncludedGroupAreResolvedResolver', () => {
    const resolver = new AllCellsBeforeIncludedGroupAreResolvedResolver();
    const factory = new ResolverFactory();

    it('should resolve first value where calls before are resolved', () => {
        const cells = factory
            .init()
            .fromPattern('🟦❌🟦❌🟦❌🟦❔❌❔❔❔❔❔❌🟦🟦❌🟦❌')
            .getCells();
        const group = factory.getGroup([1, 1, 1, 1, 1, 2, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A8']);
    });

    it('should return empty result first cell is unknown', () => {
        const cells = factory
            .init()
            .fromPattern('❔❌🟦❌🟦❌🟦❔❌❔❔❔❔❔❌🟦🟦❌🟦❌')
            .getCells();
        const group = factory.getGroup([1, 1, 1, 1, 1, 2, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
