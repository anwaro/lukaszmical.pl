import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {OnlyFirstValueCanFitInFirstSeparatedGroupResolver} from './resolver-only-first-value-can-fit-in-first-separated-group';

describe('OnlyFirstValueCanFitInFirstGroupResolver', () => {
    const resolver = new OnlyFirstValueCanFitInFirstSeparatedGroupResolver();
    const factory = new ResolverFactory();

    it('should resolve first separated group', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔🟦🟦🟦🟦🟦❌❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([8, 2, 3, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A1', 'A2', 'A3']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result, first separated group can fit two first value', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔🟦🟦🟦🟦🟦❔❔❔❔❌❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([8, 2, 3, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
