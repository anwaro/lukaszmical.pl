import {ArrayHelper} from '../helper/helper-array';
import {StatusGroup, StatusHelper} from '../helper/helper-status';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';

export class IncludedGroupsEqualToValuesCountsResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        return result;
    }

    resolveGroup(values: number[], groupCells: CellModel[]): ResolveIndexResult {
        const result = createResolveIndexResult();
        const statusGroups = StatusHelper.toStatusGroups(groupCells);
        const includedGroups = StatusHelper.filter(
            statusGroups,
            CellStatus.included,
        );

        if (!StatusHelper.validateStatusGroups(statusGroups, values)) {
            return result;
        }

        for (let index = 0; index < includedGroups.length; index++) {
            const groupResult = this.resolveIncludedGroup(
                index,
                values,
                includedGroups,
                statusGroups,
                groupCells.length - 1,
            );

            result.included.push(...groupResult.included);
            result.excluded.push(...groupResult.excluded);
        }

        return result;
    }

    private resolveIncludedGroup(
        index: number,
        values: number[],
        includedGroups: StatusGroup[],
        statusGroups: StatusGroup[],
        maxIndex: number,
    ): ResolveIndexResult {
        const result = createResolveIndexResult();
        const value = values[index];
        const group = includedGroups[index];

        const leftHoleWidth = this.getGroupHoleWidth(
            index,
            includedGroups,
            maxIndex,
            'before',
        );

        const leftBorder = this.getGroupBorder(
            index,
            values,
            includedGroups,
            maxIndex,
            'before',
        );

        const leftBlocker = this.getGroupBlocker(
            index,
            includedGroups,
            statusGroups,
            'before',
        );

        const rightHoleWidth = this.getGroupHoleWidth(
            index,
            includedGroups,
            maxIndex,
            'after',
        );

        const rightBlocker = this.getGroupBlocker(
            index,
            includedGroups,
            statusGroups,
            'after',
        );

        const rightBorder = this.getGroupBorder(
            index,
            values,
            includedGroups,
            maxIndex,
            'after',
        );

        if (value === group.len) {
            result.excluded.push(...ArrayHelper.range(leftBorder, group.start - 1));
            result.excluded.push(
                ...ArrayHelper.range(group.start + value, rightBorder),
            );
            return result;
        }

        if (
            (leftHoleWidth === 1 && index !== 0) ||
            (leftBlocker && leftBlocker.start + leftBlocker.len === group.start)
        ) {
            result.excluded.push(...ArrayHelper.range(leftBorder, group.start - 1));
            result.included.push(
                ...ArrayHelper.range(group.start, group.start + value - 1),
            );
            result.excluded.push(
                ...ArrayHelper.range(group.start + value, rightBorder),
            );
            return result;
        }

        if (
            (rightHoleWidth === 1 && index !== includedGroups.length - 1) ||
            (rightBlocker && rightBlocker.start === group.start + group.len)
        ) {
            result.excluded.push(
                ...ArrayHelper.range(
                    leftBorder,
                    group.start + group.len - value - 1,
                ),
            );
            result.included.push(
                ...ArrayHelper.range(
                    group.start + group.len - value,
                    group.start + group.len - 1,
                ),
            );
            result.excluded.push(
                ...ArrayHelper.range(group.start + group.len, rightBorder),
            );

            return result;
        }

        // exclude left side
        const firstPotentiallyIncludedIndex = group.start + group.len - value;
        const excludeLeftEndIndex = Math.max(
            leftBlocker ? leftBlocker.start + leftBlocker.len - 1 : -99999,
            firstPotentiallyIncludedIndex - 1,
        );
        result.excluded.push(...ArrayHelper.range(leftBorder, excludeLeftEndIndex));

        // include form first cell which must be included to first included
        const includeLeftStartIndex =
            Math.min(rightBlocker ? rightBlocker.start - 1 : 99999, rightBorder) -
            value +
            1;
        result.included.push(
            ...ArrayHelper.range(includeLeftStartIndex, group.start),
        );

        // include form first included to last cell which must be included
        const includedRightEndIndex =
            Math.max(
                leftBlocker ? leftBlocker.start + leftBlocker.len : -99999,
                leftBorder,
            ) -
            value -
            1;
        result.included.push(
            ...ArrayHelper.range(group.start, includedRightEndIndex),
        );

        // exclude right side
        const lastPotentiallyIncludedIndex = group.start + value - 1;
        const excludeRightStartIndex = Math.min(
            rightBlocker ? rightBlocker.start : 99999,
            lastPotentiallyIncludedIndex + 1,
        );
        result.excluded.push(
            ...ArrayHelper.range(excludeRightStartIndex, rightBorder),
        );

        return result;
    }

    private getGroupBlocker(
        index: number,
        includedGroups: StatusGroup[],
        statusGroups: StatusGroup[],
        mode: 'before' | 'after',
    ) {
        const currentGroupStart = includedGroups[index].start;
        if (mode === 'before') {
            const prevGroupStart = index === 0 ? 0 : includedGroups[index - 1].start;

            return statusGroups.find(
                (g) =>
                    g.status === CellStatus.excluded &&
                    prevGroupStart < g.start &&
                    g.start < currentGroupStart,
            );
        } else {
            const lastGroup = statusGroups[statusGroups.length - 1];
            const nextGroupStart =
                index === includedGroups.length - 1
                    ? lastGroup.start + lastGroup.len
                    : includedGroups[index + 1].start;

            return statusGroups.find(
                (g) =>
                    g.status === CellStatus.excluded &&
                    currentGroupStart < g.start &&
                    g.start < nextGroupStart,
            );
        }
    }

    private getGroupHoleWidth(
        index: number,
        includedGroups: StatusGroup[],
        maxIndex: number,
        mode: 'before' | 'after',
    ) {
        const currentGroup = includedGroups[index];
        if (mode === 'before') {
            if (index === 0) {
                return currentGroup.start;
            }
            const prevGroup = includedGroups[index - 1];

            return currentGroup.start - prevGroup.start - prevGroup.len;
        } else {
            if (index === includedGroups.length - 1) {
                return maxIndex - currentGroup.start - currentGroup.len + 1;
            }
            const nextGroup = includedGroups[index + 1];

            return nextGroup.start - currentGroup.start - currentGroup.len;
        }
    }

    private getGroupBorder(
        index: number,
        values: number[],
        includedGroups: StatusGroup[],
        maxIndex: number,
        mode: 'before' | 'after',
    ) {
        if (mode === 'before') {
            if (index === 0) {
                return 0;
            }
            const prevGroup = includedGroups[index - 1];
            const prevValue = values[index - 1];

            return prevGroup.start + prevValue;
        } else {
            if (index === includedGroups.length - 1) {
                return maxIndex;
            }
            const nextGroup = includedGroups[index + 1];
            const nextValue = values[index + 1];

            return nextGroup.start + nextGroup.len - nextValue - 1;
        }
    }
}
