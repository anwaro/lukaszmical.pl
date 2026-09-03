import {CellModel} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class ExcludeHoleSmallerThanValuesResolver extends ResolverModel {
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
        const minValue = Math.min(...values);
        let holes = StatusGroupHelper.toHoles(groupCells);

        const holesToExcluded = holes.filter((h) => h.len < minValue);

        // additional check for start and end
        if (holes.length) {
            const firstValue = values[0];
            const firstHole = holes[0];

            if (firstHole.start < firstValue && firstHole.len < firstValue) {
                holesToExcluded.unshift(firstHole);
            }

            const lastValue = values[values.length - 1];
            const lastHole = holes[holes.length - 1];

            if (
                groupCells.length - lastHole.start <= lastValue &&
                lastHole.len < lastValue
            ) {
                holesToExcluded.push(lastHole);
            }
        }

        holesToExcluded.forEach((hole) => {
            for (let index = hole.start; index < hole.start + hole.len; index++) {
                result.excluded.push(index);
            }
        });

        return result;
    }
}
