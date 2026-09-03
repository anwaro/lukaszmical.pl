import {describe, expect, it} from 'vitest';

import {ResolverFactory} from './factory/resolver-factory';
import {CombinationResolver} from './resolver-combination';
import {CellHelper} from '../helper/helper-cell';
import {CellStatus} from '../model/model-cell';

describe('CombinationResolver', () => {
    const resolver = new CombinationResolver();
    const factory = new ResolverFactory();

    const print = (result: CellStatus[][]) =>
        console.log(result.map((r) => CellHelper.toPatternStatuses(r)).join('\n'));

    it('Should create two combination', () => {
        const result = resolver.getAllVariants([15], 16);

        expect(result.length).toEqual(2);
    });

    it('Should create six combination', () => {
        const result = resolver.getAllVariants([15], 20);

        expect(result.length).toEqual(6);
    });

    it('Should create 10 combination', () => {
        const result = resolver.getAllVariants([15, 1], 20);

        expect(result.length).toEqual(10);
    });

    it('Should create 10 combination', () => {
        const result = resolver.getAllVariants([2, 2, 2], 20);

        expect(result.length).toEqual(10);
    });

    it('Should create variants', () => {
        const variants = resolver.getAllVariants([15, 1], 20);
        const state = factory
            .fromPattern('❔❔❔❔❔❔❔❔❔❔❔❔❔❔❔❔❌❔❔❌')
            .getCells()
            .map((c) => c.status);
        const result = resolver.filterWithCurrentState(variants, state);
        print(result);

        expect(result.length).toEqual(4);
    });
});
