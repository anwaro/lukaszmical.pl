import {ArrayHelper} from '../../../helper/helper-array';
import {GroupModel} from '../../../model/model-group';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';

export class BiggestValueResolvedResolver extends ResolverModel {
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
        const uniqueSorted = ArrayHelper.sort(ArrayHelper.unique(values));

        for (const value of uniqueSorted) {
            const includedGroups = statusGroups.filter(
                (g) => g.status === CellStatus.included && g.len === value,
            );

            includedGroups.forEach((group) => {
                result.excluded.push(group.start - 1, group.start + group.len);
            });

            if (includedGroups.length !== values.filter((v) => v === value).length) {
                break;
            }
        }

        return result;
    }
}
