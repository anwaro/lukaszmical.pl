import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {SeparatedGroupNearBorderResolver} from './resolver-separated-group-near-border';

describe('SeparatedGroupNearBorderResolver', () => {
    const resolver = new SeparatedGroupNearBorderResolver();
    const factory = new ResolverFactory();

    it('should return empty result for cells without separated group', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 5).getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result for cells with one separated group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.excluded, 1)
            .getCells();
        const group = factory.getGroup([3, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should fill last separated group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([1, 4, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A10']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should fill first separated group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([2, 4, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A1']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should A9 cell - real case', () => {
        const cells = factory
            .init()

            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included)

            .getCells();
        const group = factory.getGroup([1, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
