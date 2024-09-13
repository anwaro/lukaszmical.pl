import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {SeparatedGroupsEqualToValuesResolver} from './resolver-separated-groups-equal-to-values';

describe('SeparatedGroupsEqualToValuesResolver', () => {
    const resolver = new SeparatedGroupsEqualToValuesResolver();
    const factory = new ResolverFactory();

    it('empty result for values count not equal to separated group count', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 3)
            .getCells();
        const group = factory.getGroup([5, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result for when separated group can contains two values', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 2)
            .getCells();

        const group = factory.getGroup([2, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it("should resolve groups, separated group can't contains two values", () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 2)
            .getCells();

        const group = factory.getGroup([3, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A3', 'A14', 'A15']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should resolve for equal vales count and separated group with unknown', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([4, 3, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([
            'A2',
            'A3',
            'A4',
            'A14',
            'A15',
        ]);
        expect(result.getExcludedCellsId()).toEqual(['A1', 'A12']);
    });

    it('should resolve for equal vales count and separated group with unknown - reverse', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 4)
            .getCells();
        const group = factory.getGroup([2, 3, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([
            'A1',
            'A2',
            'A12',
            'A13',
            'A14',
        ]);
        expect(result.getExcludedCellsId()).toEqual(['A4', 'A15']);
    });

    it('resolve using value greater than half group size', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.excluded, 3)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.excluded)
            .addCells(CellStatus.unknown, 2)
            .getCells();

        const group = factory.getGroup([3, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A3', 'A14', 'A15']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
