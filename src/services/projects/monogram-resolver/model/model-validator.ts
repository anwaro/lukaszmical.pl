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

    validateGroup(group: GroupModel, groupCells: CellModel[]) {
        const sum = GroupHelper.sum(group.values);
        const included = CellHelper.includedCells(groupCells);
        const excluded = CellHelper.excludedCells(groupCells);

        const createError = (reason: string) =>
            ['Group verification fail:', reason, `Group id: ${group.id}`].join(' ');

        if (included.length > sum) {
            throw createError('Too many included cells');
        }

        if (excluded.length > groupCells.length - sum) {
            throw createError('Too many excluded cells');
        }

        const statusGroups = StatusHelper.toStatusGroups(groupCells);

        const includedGroups = statusGroups.filter(
            (g) => g.status === CellStatus.included,
        );

        for (const includedGroup of includedGroups) {
            const groups = includedGroups.filter((g) => g.len === includedGroup.len);
            const values = group.values.filter((v) => v >= includedGroup.len);

            if (groups.length <= values.length) {
                continue;
            }

            const maxValue = Math.max(...values);
            const sum = groups.reduce((sum, v) => sum + v.len, 0);

            if (sum > maxValue) {
                throw createError(
                    `Too many included group with width ${includedGroup.len}`,
                );
            }
        }

        return true;
    }
}
