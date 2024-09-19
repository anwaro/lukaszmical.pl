import {ResolverHelper} from '../helper/helper-resolver';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';

export class OnlyFirstValueCanFitInFirstGroupResolver extends ResolverModel {
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
        if (values.length < 2) {
            return result;
        }
        const [firstValue, secondValue] = values;
        const separatedGroups = StatusHelper.toSeparatedGroups(groupCells);
        const separatedGroup = separatedGroups[0];
        if (separatedGroup.groups.every((g) => g.status !== CellStatus.included)) {
            return result;
        }

        const separatedGroupSize =
            separatedGroup.separatorEnd.start -
            separatedGroup.separatorStart.start -
            separatedGroup.separatorStart.len;

        if (separatedGroupSize <= firstValue + secondValue) {
            return ResolverHelper.resolveSeparatedGroup(separatedGroup, firstValue);
        }

        return result;
    }
}
