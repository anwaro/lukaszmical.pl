import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {ValueOverlapResolver} from './resolver-value-overlap';

describe('ValueOverlapResolver', () => {
    const resolver = new ValueOverlapResolver();
    const factory = new ResolverFactory();

    it('empty result, value is less than half of grid size, single value', () => {
        const cells = factory.init().fromPattern('❔❔❔❔❔❔❔❔❔❔').getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result, value is less than half of grid size, double value', () => {
        const cells = factory.init().fromPattern('❔❔❔❔❔❔❔❔❔❔').getCells();
        const group = factory.getGroup([3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result, value is less than half of grid size, triple value', () => {
        const cells = factory.init().fromPattern('❔❔❔❔❔❔❔❔❔❔').getCells();
        const group = factory.getGroup([2, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result, value is equal to half of grid size, single value', () => {
        const cells = factory.init().fromPattern('❔❔❔❔❔❔❔❔❔❔').getCells();
        const group = factory.getGroup([5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value is greater than half of grid size, single value', () => {
        const cells = factory.init().fromPattern('❔❔❔❔❔❔❔❔❔❔').getCells();
        const group = factory.getGroup([6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A5', 'A6']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value is greater than half of grid size, double value', () => {
        const cells = factory.init().fromPattern('❔❔❔❔❔❔❔❔❔❔').getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([
            'A2',
            'A3',
            'A4',
            'A7',
            'A8',
            'A9',
        ]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value is greater than half of grid size, double value', () => {
        const cells = factory.init().fromPattern('❔❔❔❔❔❔❔❔❔❔').getCells();
        const group = factory.getGroup([1, 6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A5', 'A6', 'A7', 'A8']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value is greater than half of grid size, triple value', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([4, 4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([
            'A2',
            'A3',
            'A4',
            'A7',
            'A8',
            'A9',
            'A12',
            'A13',
            'A14',
        ]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value overlap with offset', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❔❔❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A9']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value overlap with offset by other value', () => {
        const cells = factory
            .init()
            .fromPattern('❔❔❔❔❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A9']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value overlap with offset by other value and excluded cells', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❔❔❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A9', 'A10', 'A11']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('value overlap with offset by other value and excluded cells and additional 1', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❔🟦❔❔❔❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A9', 'A10', 'A11', 'A12']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
