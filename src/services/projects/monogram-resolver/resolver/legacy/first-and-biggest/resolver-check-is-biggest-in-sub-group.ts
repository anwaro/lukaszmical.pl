import {GroupHelper} from '../../../helper/helper-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {GroupModel} from '../../../model/model-group';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';

export class CheckIsBiggestInSubGroupResolver extends ResolverModel {
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
        const includedGroups = StatusGroupHelper.fromCells(
            groupCells,
            CellStatus.included,
        );

        const valuesSubGroup = (maxSize: number): number[] => {
            return values.reduce((acc, value) => {
                if (GroupHelper.valuesSize(acc) <= maxSize) {
                    return [...acc, value];
                }
                return acc;
            }, [] as number[]);
        };

        for (const group of includedGroups) {
            const maxValue = Math.max(...valuesSubGroup(group.start));

            if (maxValue === group.len) {
                result.excluded.push(group.start - 1, group.start + group.len);
            }
        }

        return result;
    }
}
