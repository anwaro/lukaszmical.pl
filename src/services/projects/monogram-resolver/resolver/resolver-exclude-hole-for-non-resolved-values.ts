import {ArrayHelper} from '../helper/helper-array';
import {CellModel} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';

export class ExcludeHoleForNonResolvedValuesResolver extends ResolverModel {
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
        const separatedGroups = StatusHelper.toSeparatedGroups(groupCells, true);

        let nonResolved = [...values];

        for (const separatedGroup of separatedGroups) {
            const valueIndex = nonResolved.findIndex(
                (v) => v === separatedGroup.groups[0].len,
            );
            if (
                StatusHelper.separatedGroupsIsResolved(separatedGroup) &&
                valueIndex !== -1
            ) {
                nonResolved[valueIndex] = -1;
            }
        }

        nonResolved = nonResolved.filter((v) => v !== -1);

        if (nonResolved.length === 0) {
            return result;
        }

        const minNonResolvedValue = Math.min(...nonResolved.filter((v) => v !== -1));

        StatusHelper.toHoles(groupCells)
            .filter((group) => group.len < minNonResolvedValue)
            .forEach((group) => {
                result.excluded.push(
                    ...ArrayHelper.range(group.start, group.start + group.len - 1),
                );
            });

        return result;
    }
}
