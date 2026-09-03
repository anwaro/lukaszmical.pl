import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {BiggestUnresolvedValueResolver} from './resolver-biggest-unresolved-value';

describe('BiggestUnresolvedValueResolver', () => {
    const resolver = new BiggestUnresolvedValueResolver();
    const factory = new ResolverFactory();

    it('Should resolve all values 2, there is two separated group which can fit value', () => {
        const cells = factory
            .init()
            .fromPattern('🟦🟦🟦🟦❌❔❌❌❔🟦🟦❌❔❔❔❌❌❌❌❌')
            .getCells();
        const group = factory.getGroup([4, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A14']);
        expect(result.getExcludedCellsId()).toEqual(['A9']);
    });

    it('Should return empty result, there is 3 separated group and 2 values', () => {
        const cells = factory
            .init()
            .fromPattern('🟦🟦🟦🟦❌❔❌❌❔🟦🟦❌❔❔❔❌❔❔❌❌')
            .getCells();
        const group = factory.getGroup([4, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('Should return empty result, first separated group can fit two values - real case', () => {
        const cells = factory
            .init()
            .fromPattern('❌❔❔❔❔❔❔❔🟦❔❔❔❔❔❌❔❔❔❌❌')
            .getCells();
        const group = factory.getGroup([2, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
