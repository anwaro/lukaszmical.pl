import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {ExcludeHoleForNonResolvedValuesResolver} from './resolver-exclude-hole-for-non-resolved-values';

describe('ExcludeHoleForNonResolvedValuesResolver', () => {
    const resolver = new ExcludeHoleForNonResolvedValuesResolver();
    const factory = new ResolverFactory();

    it('should exclude hole before first value', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❌❌❔❔❌🟦❌🟦❌❌❌❌❌❌🟦🟦🟦')
            .getCells();
        const group = factory.getGroup([3, 1, 1, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A6', 'A7']);
    });
});
