import {GroupHelper} from '../helper/helper-group';
import {StatusHelper} from '../helper/helper-status';
import {CellModel, CellStatus} from './model-cell';
import {GroupModel} from './model-group';
import {CellHelper} from '../helper/helper-cell';

export class ValidatorModel {
    validate(groups: GroupModel[], cells: CellModel[]) {
        for (let index = 0; index < groups.length; index++) {
            const group = groups[index];
            this.validateGroup(group, group.cells(cells));
        }
    }

    validateGroupValues(values: number[], size: number, groupId: string) {
        const valuesSize = GroupHelper.valuesSize(values);

        if (valuesSize > size || valuesSize === 0) {
            throw [
                'Group values verification fail:',
                'Values size is grater than grid size',
                `Values: [${values.join(', ')}]`,
                `Grid size: ${size}`,
                `Group id: ${groupId}`,
            ].join(' ');
        }
    }

    validateGroup(group: GroupModel, groupCells: CellModel[]) {
        const sum = GroupHelper.sum(group.values);
        const included = CellHelper.includedCells(groupCells);
        const excluded = CellHelper.excludedCells(groupCells);

        const createError = (reason: string) =>
            ['Group verification fail:', reason, `Group id: ${group.id}`].join(' ');

        if (included.length > sum) {
            console.log(CellHelper.toPattern(groupCells));
            throw createError('Too many included cells');
        }

        if (excluded.length > groupCells.length - sum) {
            console.log(CellHelper.toPattern(groupCells));
            throw createError('Too many excluded cells');
        }

        const statusGroups = StatusHelper.toStatusGroups(groupCells);

        const includedGroups = statusGroups.filter(
            (g) => g.status === CellStatus.included,
        );

        const maxIncluded = Math.max(...includedGroups.map((g) => g.len));
        const maxValue = Math.max(...group.values);

        if (maxIncluded > maxValue) {
            console.log(CellHelper.toPattern(groupCells));
            throw createError('Max included is bigger than max value');
        }

        for (const includedGroup of includedGroups) {
            const groups = includedGroups.filter((g) => g.len === includedGroup.len);
            const values = group.values.filter((v) => v >= includedGroup.len);

            if (includedGroup.len === 1 || groups.length <= values.length) {
                continue;
            }

            const maxValue = Math.max(...values);
            const sum = groups.reduce((sum, v) => sum + v.len, 0);

            if (sum > maxValue) {
                console.log(CellHelper.toPattern(groupCells));
                throw createError(
                    `Too many included group with width ${includedGroup.len}`,
                );
            }
        }

        return true;
    }
}
