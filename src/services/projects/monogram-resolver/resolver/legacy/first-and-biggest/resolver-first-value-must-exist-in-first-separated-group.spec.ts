import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {FirstValueMustExistInFirstSeparatedGroupResolver} from './resolver-first-value-must-exist-in-first-separated-group';

describe('FirstValueMustExistInFirstSeparatedGroupResolver', () => {
    const resolver = new FirstValueMustExistInFirstSeparatedGroupResolver();
    const factory = new ResolverFactory();

    it('should exclude hole before first value', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔❌❔❔❔❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([3, 4, 6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A3']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result, first hole can fit first value', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔❌❔❔❔❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([3, 3, 6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result, values can fit after first separated group', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❌🟦🟦🟦❌🟦🟦🟦❌❔❔❔❌❌❌❌')
            .getCells();
        const group = factory.getGroup([3, 3, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
