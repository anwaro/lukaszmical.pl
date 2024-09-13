import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';
import {SplitGroupByBiggestValueResolver} from './resolver-split-group-by-biggest-value';

describe('SplitGroupByBiggestValueResolver', () => {
    const resolver = new SplitGroupByBiggestValueResolver();
    const factory = new ResolverFactory();

    it('empty result, only one value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('empty result, max value is not included', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([1, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([]);
    });

    it('should include before max value and exclude after', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.excluded, 2)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 6)
            .getCells();
        const group = factory.getGroup([1, 4]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A3']);
        expect(result.getExcludedCellsId()).toEqual([
            'A10',
            'A11',
            'A12',
            'A13',
            'A14',
            'A15',
        ]);
    });

    it('should include before max value and exclude after - real case', () => {
        const cells = factory
            .init()
            .fromPattern('🟦❌❌❌❔❌❌❌🟦❌🟦🟦❌❌❌❔❌🟦❌❌')
            .getCells();
        const group = factory.getGroup([1, 1, 1, 2, 1]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual(['A5']);
        expect(result.getExcludedCellsId()).toEqual(['A16']);
    });
});
