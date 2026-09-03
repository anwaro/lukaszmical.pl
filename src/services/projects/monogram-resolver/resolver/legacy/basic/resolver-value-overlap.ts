import {ArrayHelper} from '../../../helper/helper-array';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {GroupHelper} from '../../../helper/helper-group';

export class ValueOverlapResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        return result;
    }

    resolveGroup(values: number[], groupCells: CellModel[]): ResolverIndexResult {
        const result = ResolverIndexResult.create();
        const statusGroups = StatusGroupHelper.fromCells(groupCells);
        const initialOffset = (groupIndex: number) =>
            statusGroups[groupIndex].status === CellStatus.excluded
                ? statusGroups[groupIndex].len
                : 0;

        const getLeftOffset = (index: number) => {
            let offset = initialOffset(0);
            const valuesBefore = values.slice(0, index);
            offset += GroupHelper.valuesSize(valuesBefore) + 1;

            if (
                offset !== 0 &&
                groupCells[offset - 1].status === CellStatus.included
            ) {
                // @TODO find first non included
                offset += 1;
            }

            return offset;
        };

        const getRightOffset = (index: number) => {
            let offset = initialOffset(statusGroups.length - 1);

            const valuesAfter = values.slice(index + 1, values.length);
            offset += GroupHelper.valuesSize(valuesAfter) + 1;

            if (
                offset !== 0 &&
                groupCells[groupCells.length - offset].status === CellStatus.included
            ) {
                // @TODO find first non included
                offset += 1;
            }

            return offset;
        };

        for (let index = 0; index < values.length; index++) {
            const value = values[index];

            result.included.push(
                ...ArrayHelper.range(
                    groupCells.length - getRightOffset(index) - value,
                    getLeftOffset(index) + value - 1,
                ),
            );
        }

        return result;
    }
}
