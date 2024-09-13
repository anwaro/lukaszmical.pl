import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {AlreadyDoneGroupResolver} from './resolver-already-done-group';

describe('AlreadyDoneGroupForTwoValuesResolver', () => {
    const resolver = new AlreadyDoneGroupResolver();
    const factory = new ResolverFactory();

    it('should exclude cells near first includes group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([3, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A5']);
    });

    it('should exclude cells near second includes group', () => {
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
        expect(result.getExcludedCellsId()).toEqual(['A6', 'A10']);
    });

    it('should exclude cells near first and second includes group', () => {
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
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A6', 'A10']);
    });

    it('should return empty result', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([2, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should exclude group fro equal values', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 5)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A3', 'A6']);
    });

    it('should return exclude for second group - 2', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A6', 'A9']);
    });
});
