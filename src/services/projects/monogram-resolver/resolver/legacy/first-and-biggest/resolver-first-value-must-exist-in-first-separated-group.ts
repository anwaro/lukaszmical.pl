import {GroupHelper} from '../../../helper/helper-group';
import {ResolverHelper} from '../../../helper/helper-resolver';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class FirstValueMustExistInFirstSeparatedGroupResolver extends ResolverModel {
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
        const [firstValue, secondValue] = values;
        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);
        const firstGroupCanFitValue = separatedGroups.find(
            (g) => g.size >= firstValue,
        );
        if (!firstGroupCanFitValue) {
            return result;
        }
        const firstGroupCanIncludeTwoValues =
            firstGroupCanFitValue.size >=
            GroupHelper.valuesSize([firstValue, secondValue]);

        const statusGroup = StatusGroupHelper.fromCells(groupCells);
        const valuesSum = GroupHelper.sum(values);
        const excludedGroups = StatusGroupHelper.filter(
            statusGroup,
            CellStatus.excluded,
        ).filter((g) => g.start > firstGroupCanFitValue.separatorEnd.start);

        let offset = values.length - 1;
        if (statusGroup[statusGroup.length - 1].status === CellStatus.excluded) {
            offset += statusGroup[statusGroup.length - 1].len;
            offset += GroupHelper.sum(
                excludedGroups
                    .slice(0, excludedGroups.length - 1)
                    .map((g, i) => (i < values.length ? g.len - 1 : g.len)),
            );
        } else {
            offset += GroupHelper.sum(
                excludedGroups.map((g, i) =>
                    i < values.length ? g.len - 1 : g.len,
                ),
            );
        }

        const sizeAfterGroup =
            groupCells.length -
            (firstGroupCanFitValue.separatorEnd.start +
                firstGroupCanFitValue.separatorEnd.len);

        if (sizeAfterGroup >= valuesSum + offset) {
            return result;
        }

        result.addIndexesResults(
            ResolverHelper.resolveSeparatedGroup(
                firstGroupCanFitValue,
                firstValue,
                firstGroupCanIncludeTwoValues,
            ),
        );

        return result;
    }
}
