import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {ExcludeForDoubleResolver} from './resolver-exclude-for-double';

describe('ExcludeForDoubleResolver', () => {
    const resolver = new ExcludeForDoubleResolver();
    const factory = new ResolverFactory();

    it('empty result for single value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 14)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for single included cells', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 14)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for single included cells group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 11)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for three included cells group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 1)
            .addCells(CellStatus.included, 1)
            .addCells(CellStatus.unknown, 10)
            .addCells(CellStatus.included, 1)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for two included cells group with to small distance', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 1)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 5)
            .getCells();
        const group = factory.getGroup([5, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('excluded only in right', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([
            'A11',
            'A12',
            'A13',
            'A14',
            'A15',
        ]);
    });

    it('excluded only in left', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A2', 'A3', 'A4', 'A5']);
    });

    it('excluded in left and right', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([
            'A1',
            'A2',
            'A3',
            'A14',
            'A15',
        ]);
    });

    it('excluded in left, right and middle', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A7', 'A8', 'A9', 'A15']);
    });

    it('excluded in left, right and middle - second variant', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 6)
            .addCells(CellStatus.included, 1)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A7', 'A8']);
    });

    it('excluded single cell beetween included groups', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 1)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([4, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).includes('A6');
    });
});
