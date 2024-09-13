import {describe, expect, it} from 'vitest';

import {ValidatorModel} from './model-validator';
import {ResolverFactory} from '../resolver/mocks/resolver-factory';
import {CellStatus} from '../model/model-cell';

describe('ValidatorModel', () => {
    const validator = new ValidatorModel();
    const factory = new ResolverFactory();

    it('should validate correctly', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown)
            .getCells();
        const group = factory.getGroup([3, 4]);

        expect(() => validator.validateGroup(group, cells)).not.toThrowError();
    });

    it('should throw error, Too many included group with width 4', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([3, 4, 1]);

        expect(() => validator.validateGroup(group, cells)).toThrowError(
            /Too many included group with width 4/,
        );
    });

    it('should throw error, Too many included cells', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 4)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([3, 4]);

        expect(() => validator.validateGroup(group, cells)).toThrowError(
            /Too many included cells/,
        );
    });

    it('should throw error, Too many excluded cells', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.excluded, 7)
            .getCells();
        const group = factory.getGroup([4]);

        expect(() => validator.validateGroup(group, cells)).toThrowError(
            /Too many excluded cells/,
        );
    });

    it('should validate correctly, included group can belong to bigger value', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 3)
            .addCells(CellStatus.unknown, 2)
            .getCells();
        const group = factory.getGroup([3, 3, 4]);

        expect(() => validator.validateGroup(group, cells)).not.toThrowError();
    });

    it('should validate correctly, included group can belong to bigger value - second variant', () => {
        const cells = factory
            .init()
            .addCells(CellStatus.excluded, 4)
            .addCells(CellStatus.unknown, 3)
            .addCells(CellStatus.included, 1)
            .addCells(CellStatus.unknown, 2)
            .addCells(CellStatus.included, 1)
            .addCells(CellStatus.excluded, 9)
            .getCells();
        const group = factory.getGroup([4]);

        expect(() => validator.validateGroup(group, cells)).not.toThrowError();
    });
});
