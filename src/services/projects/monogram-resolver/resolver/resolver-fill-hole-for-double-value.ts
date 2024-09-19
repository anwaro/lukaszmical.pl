import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusGroup, StatusHelper} from '../helper/helper-status';
import {ArrayHelper} from '../helper/helper-array';

export class FillHoleForDoubleValueResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        result.addIndexResult(
            this.resolveGroup(group.values.toReversed(), groupCells.toReversed()),
            groupCells.toReversed(),
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

        if (values.length === 2 && includedGroups.length === 2) {
            return this.doubleIncludedGroups(includedGroups, values);
        }

        if (values.length !== 2 || includedGroups.length < 3) {
            return result;
        }

        const firstGroup = includedGroups[0];
        const firstValue = values[0];

        const canBelongToFirstValue = includedGroups.filter((group) => {
            const endIndex = firstGroup.start + firstValue;
            const currentValue = group.start + group.len;
            return currentValue <= endIndex;
        });

        const lastGroup = includedGroups[includedGroups.length - 1];
        const lastValue = values[values.length - 1];

        const canBelongToLastValue = includedGroups.filter((group) => {
            const startIndex = lastGroup.start + lastGroup.len - lastValue;
            const currentValue = group.start - group.len + 1;
            return currentValue >= startIndex;
        });

        const firstResult = this.joinGroups(
            this.excludeCommonGroups(canBelongToFirstValue, canBelongToLastValue),
        );

        const secondResult = this.joinGroups(
            this.excludeCommonGroups(canBelongToLastValue, canBelongToFirstValue),
        );

        result.included.push(...firstResult.included, ...secondResult.included);
        result.excluded.push(...firstResult.excluded, ...secondResult.excluded);
        return result;
    }

    excludeCommonGroups(groups: StatusGroup[], groupsToCheck: StatusGroup[]) {
        return groups.filter(
            (group) => !groupsToCheck.find((g) => g.start === group.start),
        );
    }

    joinGroups(groups: StatusGroup[]) {
        const result = createResolveIndexResult();
        if (groups.length < 2) {
            return result;
        }
        const startIndex = Math.min(...groups.map((g) => g.start + g.len));
        const endIndex = Math.max(...groups.map((g) => g.start));

        for (let index = startIndex; index < endIndex; index++) {
            result.included.push(index);
        }

        return result;
    }

    doubleIncludedGroups(includedGroups: StatusGroup[], values: number[]) {
        const result = createResolveIndexResult();

        if (includedGroups[0].len > values[0]) {
            result.included.push(
                ...ArrayHelper.range(
                    includedGroups[0].start,
                    includedGroups[1].start,
                ),
            );
        }

        return result;
    }
}
