import {describe, expect, it} from 'vitest';

import {BorderFillResolver} from './resolver-border-fill';
import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';

describe('BorderFillResolver', () => {
    const resolver = new BorderFillResolver();
    const factory = new ResolverFactory();

    it('should return empty result for all unknow cells', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 10).getCells();
        const group = factory.getGroup([1, 1, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should include first 4 cells, and exclude 5th cell', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 14)
            .getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A2', 'A3', 'A4']);
        expect(result.getExcludedCellsId()).toEqual(['A5']);
    });

    it('should include last 4 cells, and exclude  5th from last', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 14)
            .addCells(CellStatus.included)
            .getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A12', 'A13', 'A14']);
        expect(result.getExcludedCellsId()).toEqual(['A11']);
    });

    it('should include last 4 cells and 4 last, should exclude 5th cell and 5th from last', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 13)
            .addCells(CellStatus.included)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([
            'A2',
            'A3',
            'A4',
            'A12',
            'A13',
            'A14',
        ]);
        expect(result.getExcludedCellsId()).toEqual(['A5', 'A11']);
    });

    it('should include cells after first included and before value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 9)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A4', 'A12']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should include cells after first included and before value with offset', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 10)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A4', 'A5', 'A12', 'A13']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should include on end with offset', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 7)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A6', 'A7']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should exclude with offset', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 7)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A3', 'A4', 'A5']);
        expect(result.getExcludedCellsId()).toEqual(['A6']);
    });

    it('should exclude with offset - real case 1', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded, 2)
            .getCells();
        const group = factory.getGroup([1, 1, 2, 1, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A17']);
    });

    it('should include with offset - real case 2', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❌❌❌❌❔❔🟦🟦❔❔🟦❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([5, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A11']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
