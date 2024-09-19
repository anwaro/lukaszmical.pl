import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {ValueCanFillOnlyInOneHoleResolver} from './resolver-value-can-fill-only-in-one-hole';

describe('ValueCanFillOnlyInOneHoleResolver', () => {
    const resolver = new ValueCanFillOnlyInOneHoleResolver();
    const factory = new ResolverFactory();

    it('should fill biggest value in biggest whole', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❌❌❔❔❔❔❔🟦❔❔❔❔❌❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 1, 7, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A9', 'A10', 'A12']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
