import {ResolverHelper} from '../../../helper/helper-resolver';
import {CellModel} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class FirstUnresolvedSeparatedGroupResolver extends ResolverModel {
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

        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);

        for (const group of separatedGroups) {
            if (group.includedSize == 0) {
                break;
            }

            if (group.index >= values.length) {
                break;
            }
            const value = values[group.index];

            if (group.isResolved) {
                continue;
            }

            const nextValue =
                group.index < values.length - 1
                    ? values[group.index + 1]
                    : undefined;

            const canIncludeMoreValues = nextValue
                ? value + nextValue < group.size
                : false;

            result.addIndexesResults(
                ResolverHelper.resolveSeparatedGroup(
                    group,
                    value,
                    canIncludeMoreValues,
                ),
            );

            if (canIncludeMoreValues) {
                break;
            }
        }

        return result;
    }
}
