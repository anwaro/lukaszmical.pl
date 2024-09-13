import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {SeparatedGroupsForDoubleValuesResolver} from './resolver-separated-groups-for-double-values';

describe('SeparatedGroupsForDoubleValuesResolver', () => {
    const resolver = new SeparatedGroupsForDoubleValuesResolver();
    const factory = new ResolverFactory();

    it('empty result for one value', () => {
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

    it('empty result for single included cell', () => {
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

    it('empty result for single included cell group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([5, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should include cell beetwen included groups before separoator', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 5)
            .getCells();
        const group = factory.getGroup([4, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A4']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should include cell beetwen included groups after separoator', () => {
        const cells = factory
            .init()

            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([4, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A12']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
