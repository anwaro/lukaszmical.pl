import {ArrayHelper} from '../../../helper/helper-array';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';

export class AllCellsBeforeIncludedGroupAreResolvedResolver extends ResolverModel {
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

    resolveGroup(values: number[], groupCells: CellModel[]): ResolverIndexResult {
        const result = ResolverIndexResult.create();
        const statusGroups = StatusGroupHelper.fromCells(groupCells);
        const includedGroups = StatusGroupHelper.filter(
            statusGroups,
            CellStatus.included,
        );

        if (includedGroups.length < 2) {
            return result;
        }

        for (let index = 0; index < includedGroups.length; index++) {
            const group = includedGroups[index];
            const unknownBefore = statusGroups.find(
                (g) => g.status === CellStatus.unknown && g.index < group.index,
            );

            if (unknownBefore) {
                break;
            }

            if (group.index === statusGroups.length - 1) {
                break;
            }

            if (statusGroups[group.index + 1].status !== CellStatus.unknown) {
                continue;
            }
            const valueToFit = values[index];

            result.included.push(
                ...ArrayHelper.range(group.start, group.start + valueToFit - 1),
            );
            result.excluded.push(group.start + valueToFit);
        }

        return result;
    }
}
