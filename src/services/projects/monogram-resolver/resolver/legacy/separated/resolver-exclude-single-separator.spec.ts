import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';
import {ExcludeSingleSeparatorResolver} from './resolver-exclude-single-separator';

describe('IncludedGroupsWithSingleUnknownSeparatorResolver', () => {
    const resolver = new ExcludeSingleSeparatorResolver();
    const factory = new ResolverFactory();

    it('should fill biggest value in biggest whole', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❌❌❔❔❔❔❔🟦🟦❔🟦🟦❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A12']);
    });
});
