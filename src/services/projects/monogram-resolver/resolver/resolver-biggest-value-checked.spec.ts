import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {BiggestValueCheckedResolver} from './resolver-biggest-value-checked';

describe('BigestGroupCheckedResolver', () => {
    const resolver = new BiggestValueCheckedResolver();
    const factory = new ResolverFactory();

    it('should return empty value for group without checked calls', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 4)
            .getCells();
        const group = factory.getGroup([5, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty value for checked group, but not equal to max value ', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should exclude cells near group equal to biggest value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A6']);
    });

    it('should exclude cells near groups equal to biggest value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A5', 'A6', 'A10']);
    });

    it('should exclude cells near group equal to biggest value - variant 2', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([1, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A6']);
    });
});
