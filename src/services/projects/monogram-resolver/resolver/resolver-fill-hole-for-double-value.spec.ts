import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {FillHoleForDoubleValueResolver} from './resolver-fill-hole-for-double-value';

describe('FillHoleForDoubleValueResolver', () => {
    const resolver = new FillHoleForDoubleValueResolver();
    const factory = new ResolverFactory();

    it('empty result for more than one value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 4)
            .getCells();
        const group = factory.getGroup([5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should join two first included groups', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 7)
            .addCells(CellStatus.excluded)
            .getCells();
        const group = factory.getGroup([3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A7']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should join two last included groups', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 7)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 5)
            .getCells();
        const group = factory.getGroup([3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A14']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should join two last included groups - second variant', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 7)
            .addCells(CellStatus.excluded)
            .getCells();
        const group = factory.getGroup([1, 5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A9', 'A10']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should join two groups, first included group cannot belong to first value', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❌❌❔❔❔❔❔🟦🟦❔🟦❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A12']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
