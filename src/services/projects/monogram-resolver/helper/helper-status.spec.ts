import {describe, expect, it} from 'vitest';

import {ResolverFactory} from '../resolver/mocks/resolver-factory';
import {StatusHelper} from './helper-status';

describe('StatusHelper', () => {
    const factory = new ResolverFactory();

    it('should return two holes', () => {
        const cells = factory
            .init()
            .fromPattern('❌❔❔❔❔❔❌❌❔❔❌❌❔❔❌')
            .getCells();
        const holes = StatusHelper.toHoles(cells);

        expect(holes.length).toEqual(3);
    });

    it('should validate result be true', () => {
        const cells = factory
            .init()
            .fromPattern('🟦❌🟦🟦❌🟦❔🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦❔❌')
            .getCells();
        const separatedGroups = StatusHelper.toSeparatedGroups(cells);

        expect(
            StatusHelper.validateSeparatedGroups(separatedGroups, [1, 2, 13]),
        ).toBeTruthy();
    });

    it('should validate result be true - reverse', () => {
        const cells = factory
            .init()
            .fromPattern('❌❔🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦❔🟦❌🟦🟦❌🟦')
            .getCells();
        const separatedGroups = StatusHelper.toSeparatedGroups(cells);

        expect(
            StatusHelper.validateSeparatedGroups(separatedGroups, [13, 2, 1]),
        ).toBeTruthy();
    });
});
