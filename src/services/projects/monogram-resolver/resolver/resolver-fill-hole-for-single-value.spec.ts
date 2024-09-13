import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {FillHoleForSingleValueResolver} from './resolver-fill-hole-for-single-value';

describe('FillHoleForSingleValueResolver', () => {
    const resolver = new FillHoleForSingleValueResolver();
    const factory = new ResolverFactory();

    it('should return empty result for more than one value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 4)
            .getCells();
        const group = factory.getGroup([5, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result for single included cell', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([5, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should fill one whole', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown) // A5
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A5']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should fill two whole', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A3', 'A5']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
