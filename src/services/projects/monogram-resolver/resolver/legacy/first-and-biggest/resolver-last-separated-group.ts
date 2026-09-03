import {CellModel} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
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
        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);
        const currentGroupValues = [];
        const valueIndex = 0;

        const getValuesInGroup = (index: number) => {};

        for (let index = 0; index < separatedGroups.length; index++) {
            const group = separatedGroups[index];
        }

        return result;
    }
}
