import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '@/services/projects/monogram-resolver/resolver/factory/resolver-factory';

import {StatusGroupHelper} from './helper-status-group';
import {SeparatedGroupHelper} from './helper-separated-group';

describe('StatusHelper', () => {
    const factory = new ResolverFactory();

    it('should return two holes', () => {
        const cells = factory
            .init()
            .fromPattern('❌❔❔❔❔❔❌❌❔❔❌❌❔❔❌')
            .getCells();
        const holes = StatusGroupHelper.toHoles(cells);

        expect(holes.length).toEqual(3);
    });

    it('should validate result be true', () => {
        const cells = factory
            .init()
            .fromPattern('🟦❌🟦🟦❌🟦❔🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦❔❌')
            .getCells();
        const separatedGroups = SeparatedGroupHelper.fromCells(cells);

        expect(
            SeparatedGroupHelper.validate(separatedGroups, [1, 2, 13]),
        ).toBeTruthy();
    });

    it('should validate result be true - reverse', () => {
        const cells = factory
            .init()
            .fromPattern('❌❔🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦❔🟦❌🟦🟦❌🟦')
            .getCells();
        const separatedGroups = SeparatedGroupHelper.fromCells(cells);

        expect(
            SeparatedGroupHelper.validate(separatedGroups, [13, 2, 1]),
        ).toBeTruthy();
    });
});
