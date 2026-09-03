import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {FirstValueMustBelongToFirstIncludedGroupResolver} from './resolver-first-value-must-belong-to-first-included-group';

describe('FirstValueMustBelongToFirstIncludedGroupResolver', () => {
    const resolver = new FirstValueMustBelongToFirstIncludedGroupResolver();
    const factory = new ResolverFactory();

    it('should exclude hole before first value', () => {
        const cells = factory
            .init()
            .fromPattern('❌❌❌❌❔❔❔❔❔🟦🟦🟦❔❔❔❔❔❔❔❔')
            .getCells();
        const group = factory.getGroup([1, 5]);
        const result = resolver.run(group, cells);

        expect(result.getIncludedCellsId()).toEqual([]);
        expect(result.getExcludedCellsId()).toEqual([
            'A15',
            'A16',
            'A17',
            'A18',
            'A19',
            'A20',
        ]);
    });
});
