import {ArrayHelper} from '../../../helper/helper-array';
import {StatusGroup, StatusGroupHelper} from '../../../helper/helper-status-group';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';

export class ExtendsGroupsWithSeparatorBetweenResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        return result;
    }

    resolveGroup(values: number[], groupCells: CellModel[]): ResolverIndexResult {
        const result = ResolverIndexResult.create();
        const statusGroups = StatusGroupHelper.fromCells(groupCells);

        const groupsToProcess = this.groupsToProcess(statusGroups);

        if (groupsToProcess.length === 0) {
            return result;
        }

        for (const group of groupsToProcess) {
            const potentialValues = this.findPotentialValues(
                values,
                statusGroups,
                group,
                groupCells.length,
            );

            if (potentialValues.length !== 1) {
                continue;
            }

            const [firstValue, secondValue] = potentialValues[0];

            result.included.push(
                ...ArrayHelper.range(group.start - firstValue, group.start - 1),
                ...ArrayHelper.range(
                    group.start + group.len,
                    group.start + group.len + secondValue - 1,
                ),
            );

            result.excluded.push(
                group.start - firstValue - 1,
                group.start + group.len + secondValue,
            );
        }

        return result;
    }

    findPotentialValues(
        values: number[],
        statusGroups: StatusGroup[],
        group: StatusGroup,
        size: number,
    ): [number, number][] {
        const includedBefore = statusGroups[group.index - 1];
        const includedAfter = statusGroups[group.index + 1];
        const potentialValues: [number, number][] = [];

        const leftBLocker = statusGroups.findLast(
            (g) =>
                g.status === CellStatus.excluded && g.start < includedBefore.start,
        );
        const startLeftIndex = leftBLocker ? leftBLocker.start + leftBLocker.len : 0;
        const leftMaxWidth =
            includedBefore.start + includedBefore.len - startLeftIndex;

        const rightBLocker = statusGroups.find(
            (g) => g.status === CellStatus.excluded && g.start > includedAfter.start,
        );
        const endRightIndex = rightBLocker ? rightBLocker.start : size - 1;
        const rightMaxWidth = endRightIndex - includedAfter.start;

        for (let index = 0; index < values.length - 1; index++) {
            const value = values[index];
            const nextValue = values[index + 1];

            // check values fit to included groups
            if (
                includedBefore.len <= value &&
                value <= leftMaxWidth &&
                includedAfter.len <= nextValue &&
                nextValue <= rightMaxWidth
            ) {
                potentialValues.push([value, nextValue]);
            }
        }

        return potentialValues;
    }

    groupsToProcess(statusGroups: StatusGroup[]) {
        return statusGroups.filter((group) => {
            if (group.status !== CellStatus.excluded) {
                return false;
            }

            if (
                group.index === 0 ||
                statusGroups[group.index - 1].status !== CellStatus.included ||
                group.index === statusGroups.length - 1 ||
                statusGroups[group.index + 1].status !== CellStatus.included
            ) {
                return false;
            }

            if (
                group.index - 1 === 0 &&
                group.index + 1 === statusGroups.length - 1
            ) {
                return false;
            }

            if (
                statusGroups[group.index - 2]?.status !== CellStatus.unknown &&
                statusGroups[group.index + 2]?.status !== CellStatus.unknown
            ) {
                return false;
            }

            return true;
        });
    }
}
