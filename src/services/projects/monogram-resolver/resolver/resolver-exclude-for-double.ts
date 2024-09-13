import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';

export class ExcludeForDoubleResolver extends ResolverModel {
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

        if (values.length !== 2) {
            return result;
        }

        const statusGroups = StatusHelper.toStatusGroups(groupCells);
        const includedGroups = StatusHelper.filter(
            statusGroups,
            CellStatus.included,
        );

        if (includedGroups.length !== 2) {
            return result;
        }

        const [firstValue, secondValue] = values;
        const [firstIncludedGroup, secondIncludedGroup] = includedGroups;

        const diff =
            secondIncludedGroup.start +
            secondIncludedGroup.len -
            firstIncludedGroup.start;

        if (diff <= firstValue || diff <= secondValue) {
            return result;
        }

        // left side
        const endIndex =
            firstIncludedGroup.start + firstIncludedGroup.len - firstValue;
        for (let index = 0; index < endIndex; index++) {
            result.excluded.push(index);
        }

        // middle
        const start = firstIncludedGroup.start + firstValue;
        const end =
            secondIncludedGroup.start + secondIncludedGroup.len - secondValue;
        for (let index = start; index < end; index++) {
            result.excluded.push(index);
        }

        // right side
        const startIndex = secondIncludedGroup.start + secondValue;
        for (let index = startIndex; index < groupCells.length; index++) {
            result.excluded.push(index);
        }

        // if space between groups is only one cell, exclude it
        const spaceIndex = secondIncludedGroup.start - 1;
        const space =
            secondIncludedGroup.start -
            firstIncludedGroup.start -
            firstIncludedGroup.len;

        if (space === 1) {
            result.excluded.push(spaceIndex);
        }

        return result;
    }
}
