import {ArrayHelper} from '../../../helper/helper-array';
import {CellModel} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class ExcludeHoleBeforeFirstValueResolver extends ResolverModel {
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
        const [firstValue] = values;
        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);
        const firstGroupCanFitValue = separatedGroups.find(
            (g) => g.size >= firstValue,
        );

        if (!firstGroupCanFitValue) {
            return result;
        }

        const holesToExclude = StatusGroupHelper.toHoles(groupCells).filter(
            (group) =>
                group.len < firstValue &&
                group.start < firstGroupCanFitValue.separatorStart.start,
        );

        holesToExclude.forEach((group) => {
            result.excluded.push(
                ...ArrayHelper.range(group.start, group.start + group.len - 1),
            );
        });

        return result;
    }
}
