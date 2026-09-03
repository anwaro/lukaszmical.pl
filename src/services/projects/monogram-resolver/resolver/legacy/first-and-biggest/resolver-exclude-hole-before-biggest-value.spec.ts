import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {ExcludeHoleBeforeBiggestValueResolver} from './resolver-exclude-hole-before-biggest-value';

describe('ExcludeHoleBeforeBiggestValueResolver', () => {
    const resolver = new ExcludeHoleBeforeBiggestValueResolver();
    const factory = new ResolverFactory();

    it('should exclude hole before first value', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❌❌❌❌❔❌🟦🟦❌❌❔❌❌❌❌❌❌❌')
            .getCells();
        const group = factory.getGroup([2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A7']);
    });
});
