import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverResult} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';

type ResolveIndexes = {
    included: number[];
    excluded: number[];
};

export class BorderFillSecondGroupResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        // try resolve group
        const resultStart = this.resolveGroup(group.values, groupCells);
        result.addIndexResult(resultStart, groupCells);

        // try resolve reverse group
        const reverseCells = [...groupCells].reverse();
        const resultEnd = this.resolveGroup(
            [...group.values].reverse(),
            reverseCells,
        );
        result.addIndexResult(resultEnd, reverseCells);

        return result;
    }

    resolveGroup(values: number[], cells: CellModel[]): ResolveIndexes {
        const result: ResolveIndexes = {included: [], excluded: []};
        const statusGroups = StatusHelper.toStatusGroups(cells);
        const includedGroups = StatusHelper.filter(
            statusGroups,
            CellStatus.included,
        );

        if (values.length < 2 || includedGroups.length < 2) {
            return result;
        }

        const firstValue = values[0];
        const firstGroup = includedGroups[0];

        if (firstValue < firstGroup.start) {
            return result;
        }

        const secondValue = values[1];
        const secondGroup = includedGroups[1];
        const holeWidth = secondGroup.start - firstGroup.start - firstGroup.len;

        // can pass value before second included group
        if (secondValue + 2 <= holeWidth) {
            return result;
        }

        const includedGroupsWidth =
            secondGroup.start + secondGroup.len - firstGroup.start;

        // second group can belong to first value
        if (firstValue >= includedGroupsWidth) {
            return result;
        }

        // if second value is equal to second include group length exclude cell around
        if (secondValue == secondGroup.len) {
            if (secondGroup.start - 1 >= 0) {
                result.excluded.push(secondGroup.start - 1);
            }

            if (secondGroup.start + secondGroup.len < cells.length) {
                result.excluded.push(secondGroup.start + secondGroup.len);
            }
        }

        const startIndex = secondGroup.start + secondGroup.len;
        let endIndex = Math.min(
            firstGroup.start + firstGroup.len + secondValue,
            cells.length - 1,
        );

        // check if excluded cell is between included groups
        const excludedGroup = statusGroups.find(
            (g) =>
                firstGroup.start < g.start &&
                g.start < secondGroup.start &&
                g.status === CellStatus.excluded,
        );

        if (excludedGroup) {
            endIndex = Math.min(
                excludedGroup.start + excludedGroup.len + secondValue - 1,
                cells.length - 1,
            );
        }

        for (let index = startIndex; index <= endIndex; index++) {
            result.included.push(index);
        }

        return result;
    }
}
