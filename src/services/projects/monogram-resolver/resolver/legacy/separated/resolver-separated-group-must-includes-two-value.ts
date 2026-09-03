import {ArrayHelper} from '../../../helper/helper-array';
import {ResolverHelper} from '../../../helper/helper-resolver';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';
import {GroupModel} from '../../../model/model-group';
import {CellModel} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';

export class SeparatedGroupMustIncludeSpecificValueResolver extends ResolverModel {
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
        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells, true);
        const minValue = Math.min(...values);

        for (const separatedGroup of separatedGroups) {
            if (separatedGroup.groups.length !== 1) {
                continue;
            }

            const potentialValues = ArrayHelper.unique(
                values.filter(
                    (v) =>
                        separatedGroup.includedSize <= v && v <= separatedGroup.size,
                ),
            );

            if (potentialValues.length !== 1) {
                continue;
            }
            const groupValue = potentialValues[0];

            if (groupValue + minValue < separatedGroup.size) {
                continue;
            }

            const res = ResolverHelper.resolveSeparatedGroup(
                separatedGroup,
                potentialValues[0],
            );
            result.included.push(...res.included);
            result.excluded.push(...res.excluded);
        }

        return result;
    }
}
