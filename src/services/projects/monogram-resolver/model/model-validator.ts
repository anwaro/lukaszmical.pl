import {ArrayHelper} from '../helper/helper-array';
import {GroupHelper} from '../helper/helper-group';
import {StatusGroupHelper} from '../helper/helper-status-group';
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
        const createError = (reason: string) =>
            [
                'Group values verification fail:',
                reason,
                `Values: [${values.join(', ')}]`,
                `Grid size: ${size}`,
                `Group id: ${groupId}`,
            ].join(' ');

        if (values.some((s) => s === 0)) {
            throw createError('One of the values is equal to 0');
        }

        const valuesSize = GroupHelper.valuesSize(values);
        if (valuesSize > size || valuesSize === 0) {
            throw createError('Values size is grater than grid size');
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

        const statusGroups = StatusGroupHelper.fromCells(groupCells);

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
            const groups = includedGroups.filter((g) => g.len >= includedGroup.len);
            const values = group.values.filter((v) => v >= includedGroup.len);

            if (includedGroup.len === 1 || groups.length <= values.length) {
                continue;
            }

            const valuesSum = ArrayHelper.sum(values);
            const groupsSum = ArrayHelper.sum(groups.map((g) => g.len));

            if (groupsSum > valuesSum) {
                console.log(CellHelper.toPattern(groupCells));
                throw createError(
                    `The sum of groups with size ${includedGroup.len} and greater is to big`,
                );
            }
        }

        return true;
    }
}
