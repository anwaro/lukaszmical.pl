import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {ExcludeForSingleResolver} from './resolver-exclude-for-single';

describe('ExcludeForSingleResolver', () => {
    const resolver = new ExcludeForSingleResolver();
    const factory = new ResolverFactory();

    it('empty result for double value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 5)
            .getCells();
        const group = factory.getGroup([4, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for group without included cells', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 15).getCells();
        const group = factory.getGroup([4, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('with excluded on start', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A2', 'A3']);
    });

    it('with excluded on end', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 5)
            .getCells();
        const group = factory.getGroup([6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A8', 'A9', 'A10']);
    });

    it('with excluded on start and end', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([6]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A10']);
    });

    it('without excluded', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
