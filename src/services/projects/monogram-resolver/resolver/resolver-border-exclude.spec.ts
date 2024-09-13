import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {BorderExcludedResolver} from './resolver-border-exclude';

describe('BorderExcludedResolver', () => {
    const resolver = new BorderExcludedResolver();
    const factory = new ResolverFactory();

    it('should excluded last element', () => {
        // included cell is part of last value, and it can not include last cell

        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 7)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A10']);
    });

    it('should excluded last element - second variant', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A10']);
    });

    it('should excluded last two element', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A9', 'A10']);
    });

    it('should excluded first element', () => {
        // included cell is part of first value, and it can not include first cell

        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 7)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1']);
    });

    it('should excluded first two element - second variant', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A2']);
    });

    it('should return empty result for single status group', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 10).getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result for unknown group bigger than first value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 5)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
