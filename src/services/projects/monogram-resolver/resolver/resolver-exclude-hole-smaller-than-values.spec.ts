import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {ExcludeHoleSmallerThanValuesResolver} from './resolver-exclude-hole-smaller-than-values';

describe('ExcludeHoleSmallerThanValuesResolver', () => {
    const resolver = new ExcludeHoleSmallerThanValuesResolver();
    const factory = new ResolverFactory();

    it('with hole smaller than min value', () => {
        const cells = factory
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 4)
            .getCells();
        const group = factory.getGroup([4, 2, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A6']);
    });

    it('with hole smaller than min value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded, 1)
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown, 2) // 9, 10
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown, 2) // 13, 14
            .addCells(CellStatus.excluded)
            .getCells();
        const group = factory.getGroup([3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A9', 'A10', 'A13', 'A14']);
    });

    it('with hole equal min value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 4)
            .getCells();
        const group = factory.getGroup([4, 1, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('with hole equal min value, start case', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included, 5)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded, 3)
            .getCells();
        const group = factory.getGroup([7, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A2']);
    });

    it('with hole equal min value, start case - 2', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 12)
            .getCells();
        const group = factory.getGroup([2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A2']);
    });

    it('with hole equal min value, end case', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 5)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .getCells();
        const group = factory.getGroup([1, 7]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A14']);
    });

    it('with hole equal min value, end case - 2', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 12)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .getCells();
        const group = factory.getGroup([1, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A14']);
    });
});
