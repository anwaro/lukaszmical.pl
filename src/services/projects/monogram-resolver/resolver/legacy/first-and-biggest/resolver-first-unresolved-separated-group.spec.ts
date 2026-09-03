import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {FirstUnresolvedSeparatedGroupResolver} from './resolver-first-unresolved-separated-group';

describe('FirstUnresolvedSeparatedGroupResolver', () => {
    const resolver = new FirstUnresolvedSeparatedGroupResolver();
    const factory = new ResolverFactory();

    it('should resolve second separated group', () => {
        const cells = factory
            .init()
            .fromPattern('❌🟦🟦🟦🟦🟦🟦🟦🟦❌❌❔🟦❌❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([8, 2, 1, 1, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A12']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result, second group can fit two values', () => {
        const cells = factory
            .init()
            .fromPattern('❌🟦🟦🟦🟦🟦🟦🟦🟦❌❌❔🟦❔❔❌❔❔❔❔')
            .getCells();
        const group = factory.getGroup([8, 2, 1, 1, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result, second group can fit two values - ', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔❔❔🟦❔❔❔❔❔❔❌🟦🟦🟦🟦❌')
            .getCells();
        const group = factory.getGroup([2, 1, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
