import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {IncludedGroupsEqualToValuesCountsResolver} from './resolver-included-groups-equal-to-values-counts';

describe('IncludedGroupsEqualToValuesCountsResolver', () => {
    const resolver = new IncludedGroupsEqualToValuesCountsResolver();
    const factory = new ResolverFactory();

    it('should exclude before first value and between first and second', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔🟦❔🟦🟦🟦❔❔❔🟦🟦🟦🟦🟦🟦❔')
            .getCells();
        const group = factory.getGroup([1, 4, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A11']);
        expect(result.getExcludedCellsId()).toEqual([
            'A1',
            'A2',
            'A3',
            'A4',
            'A5',
            'A7',
            'A12',
        ]);
    });

    it('should exclude before first value and between first and second with excluded', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔🟦❔🟦🟦🟦❔❌❔🟦🟦🟦🟦🟦🟦❔')
            .getCells();
        const group = factory.getGroup([1, 4, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A11']);
        expect(result.getExcludedCellsId()).toEqual([
            'A1',
            'A2',
            'A3',
            'A4',
            'A5',
            'A7',
        ]);
    });

    it('should exclude before first value and between first group', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔❔❔🟦🟦🟦❌❔❔🟦🟦🟦🟦🟦🟦❔')
            .getCells();
        const group = factory.getGroup([4, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A7']);
        expect(result.getExcludedCellsId()).toEqual([
            'A1',
            'A2',
            'A3',
            'A4',
            'A5',
            'A6',
            'A12',
        ]);
    });

    it('should return empty result', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌🟦🟦❌❔❔🟦❔❔❔🟦🟦🟦🟦🟦❔❔❌❌')
            .getCells();
        const group = factory.getGroup([2, 3, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
