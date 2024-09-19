import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {SeparatedGroupMustIncludeSpecificValueResolver} from './resolver-separated-group-must-include-specific-value';

describe('SeparatedGroupMustIncludeSpecificValueResolver', () => {
    const resolver = new SeparatedGroupMustIncludeSpecificValueResolver();
    const factory = new ResolverFactory();

    it('should exclude from cell separated group only 1 can fit', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❌❌❔❔❌🟦❌🟦❔❌❌❌❌❌🟦🟦🟦')
            .getCells();
        const group = factory.getGroup([3, 1, 1, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A12']);
    });

    it('should return empty result, 1 and 2 can fit in separated group', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❌❌❔❔❌🟦❌🟦❔❌❌❌❌❌🟦🟦🟦')
            .getCells();
        const group = factory.getGroup([3, 1, 2, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result can fit two values', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔❔❔❔🟦🟦🟦❌🟦🟦🟦❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
