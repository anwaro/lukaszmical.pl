import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {CheckIsBiggestInSubGroupResolver} from './resolver-check-is-biggest-in-sub-group';

describe('CheckIsBiggestInSubGroupResolver', () => {
    const resolver = new CheckIsBiggestInSubGroupResolver();
    const factory = new ResolverFactory();

    it('Should exclude call around single included cells', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔🟦🟦🟦❔❔❌❌❔❔🟦❌❔🟦❌❔❌❔❌')
            .getCells();
        const group = factory.getGroup([5, 1, 1, 1, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A14']);
    });

    it('Should exclude call around only first two single included cells', () => {
        const cells = factory
            .init()
            .fromPattern('🟦❔🟦❔❔❔❔❔🟦❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 1, 1, 1, 5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A2', 'A4']);
    });

    it('Should resolve all values 2, there is two separated group which can fit value', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔🟦🟦❔🟦❔❔❔❔❔🟦❔❔❔❔🟦❔❔🟦')
            .getCells();
        const group = factory.getGroup([5, 1, 1, 1, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A16', 'A18', 'A19']);
    });
});
