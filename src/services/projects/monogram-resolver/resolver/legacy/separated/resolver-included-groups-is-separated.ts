import {ArrayHelper} from '../../../helper/helper-array';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroup} from '../../../model/model-status-group';

type VariantIncludedGroup = {
    group: StatusGroup;
    potentialValues: number[];
};

export class IncludedGroupsIsSeparatedResolver extends ResolverModel {
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
        const includedGroups = StatusGroupHelper.filter(
            statusGroups,
            CellStatus.included,
        );

        if (includedGroups.length >= values.length) {
            return result;
        }

        const diff = values.length - includedGroups.length;
        const groups: VariantIncludedGroup[] = includedGroups.map(
            (group, index) => ({
                group,
                potentialValues: values.slice(index, index + diff + 1),
            }),
        );

        // valid all variants
        for (let currentDiff = 0; currentDiff <= diff; currentDiff++) {
            if (
                !StatusGroupHelper.validate(
                    statusGroups,
                    values.slice(currentDiff, currentDiff + groups.length),
                )
            ) {
                return result;
            }
        }

        for (const group of groups) {
            const maxValue = Math.max(...group.potentialValues);
            const minValue = Math.min(...group.potentialValues);
            if (maxValue === group.group.len) {
                result.excluded.push(
                    group.group.start - 1,
                    group.group.start + group.group.len,
                );
                continue;
            }

            if (minValue < group.group.len) {
                continue;
            }

            const isAllSameValue = maxValue === minValue;

            const hasLeftBLocker =
                group.group.index === 0 ||
                statusGroups[group.group.index - 1].status === CellStatus.excluded;

            if (hasLeftBLocker) {
                result.included.push(
                    ...ArrayHelper.range(
                        group.group.start,
                        group.group.start + minValue - 1,
                    ),
                );
                if (isAllSameValue) {
                    result.excluded.push(group.group.start + minValue);
                }
                continue;
            }

            const hasRightBLocker =
                group.group.index === statusGroups.length - 1 ||
                statusGroups[group.group.index + 1].status === CellStatus.excluded;

            if (hasRightBLocker) {
                result.included.push(
                    ...ArrayHelper.range(
                        group.group.start + group.group.len - minValue,
                        group.group.start + group.group.len - 1,
                    ),
                );
                if (isAllSameValue) {
                    result.excluded.push(
                        group.group.start + group.group.len - minValue - 1,
                    );
                }
            }
        }

        return result;
    }
}
