import {describe, expect, it} from 'vitest';

import {BorderFillSecondGroupResolver} from './resolver-border-fill-second-group';
import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';

describe('BorderFillSecondGroupResolver', () => {
    const resolver = new BorderFillSecondGroupResolver();
    const factory = new ResolverFactory();

    it('should return empty result with single group value', () => {
        const cells = factory.init().addCells(CellStatus.unknown, 10).getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result with single included status group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 10)
            .getCells();
        const group = factory.getGroup([4, 5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result if second value can fill between two first included groups', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([3, 2, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result if second included group may belong to first value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 8)
            .getCells();
        const group = factory.getGroup([8, 5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should exclude cells around second group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 8)
            .getCells();
        const group = factory.getGroup([5, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A8', 'A12']);
    });

    it('should include 2 cells after second included group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 10)
            .getCells();
        const group = factory.getGroup([6, 5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A11', 'A12']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should exclude around second group', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 4)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 7)
            .getCells();
        const group = factory.getGroup([8, 2, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A11', 'A14']);
    });

    it('should exclude around second group - reverse', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 7)
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 4)
            .getCells();
        const group = factory.getGroup([1, 2, 2, 8]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual(['A7', 'A10']);
    });

    it('should return empty result - real case 20x20', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.included, 2)
            .addCells(CellStatus.unknown, 5)
            .addCells(CellStatus.included, 5)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.excluded, 6)

            .getCells();

        const group = factory.getGroup([2, 8]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
