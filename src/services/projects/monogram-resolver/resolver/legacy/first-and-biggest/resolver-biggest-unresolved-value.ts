import {ResolverHelper} from '../../../helper/helper-resolver';
import {GroupModel} from '../../../model/model-group';
import {CellModel} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';

export class BiggestUnresolvedValueResolver extends ResolverModel {
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
        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);
        const resolvedSeparatedGroups = separatedGroups.filter((g) => g.isResolved);
        let valuesToProcess = [...values];

        for (const group of resolvedSeparatedGroups) {
            const index = valuesToProcess.findIndex((v) => v === group.size);
            valuesToProcess = valuesToProcess.filter((_, i) => i !== index);
        }

        const maxValue = Math.max(...valuesToProcess);
        const minValue = Math.min(...valuesToProcess);

        const separatedGroupsForMaxValue = separatedGroups.filter((group) => {
            if (group.size === maxValue) {
                return true;
            }
            if (group.size > maxValue) {
                return !group.isResolved;
            }
            return false;
        });

        // validate if some group can fit two max value
        if (separatedGroupsForMaxValue.some((g) => g.size > 2 * maxValue)) {
            return result;
        }

        if (
            separatedGroupsForMaxValue.length ===
            values.filter((v) => v === maxValue).length
        ) {
            separatedGroupsForMaxValue.forEach((group) =>
                result.addIndexesResults(
                    ResolverHelper.resolveSeparatedGroup(
                        group,
                        maxValue,
                        maxValue + minValue < group.size,
                    ),
                ),
            );
        }

        return result;
    }
}
