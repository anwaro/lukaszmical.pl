import {splitGroupResolvers} from '@/services/projects/monogram-resolver/resolver/index';

import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {StatusHelper} from '../helper/helper-status';

export class SplitGroupByBiggestValueResolver extends ResolverModel {
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

        const sortedValues = values.toSorted().toReversed();
        const maxValue = sortedValues[0];
        const secondValue = sortedValues[1];
        if (maxValue === sortedValues[1]) {
            return result;
        }

        const maxValueIncludedGroup = StatusHelper.toStatusGroups(groupCells).find(
            (g) => g.status === CellStatus.included && g.len > secondValue,
        );
        if (!maxValueIncludedGroup) {
            return result;
        }

        const maxValueIndex = values.findIndex((v) => v === maxValue);
        const valuesSubGroup = values.slice(0, maxValueIndex + 1);
        const cellsSubGroup = groupCells.slice(
            0,
            maxValueIncludedGroup.start + maxValue,
        );

        splitGroupResolvers.forEach((Resolver) => {
            const {included, excluded} = new Resolver().resolveGroup(
                valuesSubGroup,
                cellsSubGroup,
            );
            result.included.push(...included);
            result.excluded.push(...excluded);
        });

        return result;
    }
}
