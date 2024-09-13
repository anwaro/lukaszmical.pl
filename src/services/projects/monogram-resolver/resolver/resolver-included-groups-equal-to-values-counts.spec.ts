import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {IncludedPlusUnknownEqualToSumResolver} from './resolver-included-plus-unknown-equal-to-sum';

describe('IncludedPlusUnknownEqualToSumResolver', () => {
    const resolver = new IncludedPlusUnknownEqualToSumResolver();
    const factory = new ResolverFactory();

    it('rest is not equal includes + unknown', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 4)
            .getCells();
        const group = factory.getGroup([5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('rest is equal includes + unknown, single value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 4)
            .getCells();
        const group = factory.getGroup([5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A6']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('rest is equal includes + unknown, double value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([5, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A6', 'A9', 'A10']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('rest is equal includes + unknown, triple value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([5, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A5', 'A7', 'A8', 'A10']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
