import {ArrayHelper} from '../helper/helper-array';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';

export class ExcludeHoleBeforeBiggestValueResolver extends ResolverModel {
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
        const [firstValue] = values;
        const [maxValue, secondMaxValue] = values.toSorted((a, b) => b - a);

        const statusGroups = StatusHelper.toStatusGroups(groupCells);

        if (values.length > 1 && maxValue !== firstValue) {
            return result;
        }

        const maxValueGroup = statusGroups.find(
            (group) =>
                group.status === CellStatus.included && group.len > secondMaxValue,
        );
        if (!maxValueGroup) {
            return result;
        }

        StatusHelper.toHoles(groupCells)
            .filter(
                (group) => group.len < maxValue && group.start < maxValueGroup.start,
            )
            .forEach((group) => {
                result.excluded.push(
                    ...ArrayHelper.range(group.start, group.start + group.len - 1),
                );
            });

        return result;
    }
}
