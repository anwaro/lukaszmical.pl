import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {ExcludeAlreadyDoneResolver} from './resolver-exclude-already-done';

describe('ExcludeAlreadyDoneResolver', () => {
    const resolver = new ExcludeAlreadyDoneResolver();
    const factory = new ResolverFactory();

    it('single value checked', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A5']);
    });

    it('double value non fully checked', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('double value checked', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A3', 'A5']);
    });

    it('double value non fully checked', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
