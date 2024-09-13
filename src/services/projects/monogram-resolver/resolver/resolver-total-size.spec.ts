import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {TotalSizeResolver} from './resolver-total-size';

describe('TotalSizeResolver', () => {
    const resolver = new TotalSizeResolver();
    const factory = new ResolverFactory();

    it('empty result for sum not equals grid size, single value', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 5).getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for sum not equals grid size, double value', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 5).getCells();
        const group = factory.getGroup([1, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for sum not equals grid size, single value', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 5).getCells();
        const group = factory.getGroup([5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A1', 'A2', 'A3', 'A4', 'A5']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for sum not equals grid size, double value', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 5).getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A1', 'A2', 'A4', 'A5']);
        expect(result.getExcludedCellsId()).toEqual(['A3']);
    });

    it('empty result for sum not equals grid size, triple value', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 10).getCells();
        const group = factory.getGroup([4, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([
            'A1',
            'A2',
            'A3',
            'A4',
            'A6',
            'A7',
            'A9',
            'A10',
        ]);
        expect(result.getExcludedCellsId()).toEqual(['A5', 'A8']);
    });
});
