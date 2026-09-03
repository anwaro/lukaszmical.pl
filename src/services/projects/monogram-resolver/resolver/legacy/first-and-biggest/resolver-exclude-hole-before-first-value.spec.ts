import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {ExcludeHoleBeforeFirstValueResolver} from './resolver-exclude-hole-before-first-value';

describe('ExcludeHoleBeforeFirstValueResolver', () => {
    const resolver = new ExcludeHoleBeforeFirstValueResolver();
    const factory = new ResolverFactory();

    it('should exclude hole before first value', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❔❌❔❔❌❔❔❔❔❔❔❔🟦❌❌❔❔❔')
            .getCells();
        const group = factory.getGroup([2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A3']);
    });

    it('should return empty result, first hole can fit first value', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❔❔❌❔❔❌❔❔❔❔❔❔🟦❌❌❔❔❔')
            .getCells();
        const group = factory.getGroup([2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
