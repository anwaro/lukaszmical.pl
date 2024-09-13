import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {ExtendsGroupNearExcludedResolver} from './resolver-extends-group-near-excluded';

describe('ExtendsGroupNearExcludedResolver', () => {
    const resolver = new ExtendsGroupNearExcludedResolver();
    const factory = new ResolverFactory();

    it('should return empty result, smallest value is 1', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 8)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([4, 3, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should return empty result, included is not near excluded', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 8)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([4, 3, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should extends included groups to 2 cells', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 8)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([4, 3, 2]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A8', 'A15']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should extends included groups to 3 cells', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 8)
            .addCells(CellStatus.included)
            .addCells(CellStatus.excluded, 4)
            .addCells(CellStatus.included)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([4, 3, 3]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A7', 'A8', 'A15', 'A16']);
        expect(result.getExcludedCellsId()).toEqual([]);
    });
});
