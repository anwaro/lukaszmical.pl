import {splitGroupResolvers} from '../resolver/index';
import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {SeparatedGroup, StatusGroup, StatusHelper} from '../helper/helper-status';

export class SplitGroupByBiggestValueResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells, group.id),
            groupCells,
        );

        result.addIndexResult(
            this.resolveGroup(
                group.values.toReversed(),
                groupCells.toReversed(),
                `${group.id} - reversed`,
            ),
            groupCells.toReversed(),
        );

        return result;
    }

    resolveGroup(
        values: number[],
        groupCells: CellModel[],
        g: string = '',
    ): ResolveIndexResult {
        const result = createResolveIndexResult();

        if (values.length < 2) {
            return result;
        }

        const sortedValues = values.toSorted((a, b) => b - a);
        const [maxValue, secondValue] = sortedValues;
        if (maxValue === secondValue) {
            return result;
        }

        const statusGroups = StatusHelper.toStatusGroups(groupCells);
        const separatedGroups = StatusHelper.toSeparatedGroups(groupCells);
        const maxValueIndex = values.findIndex((v) => v === maxValue);
        const maxValueIncludedGroup = statusGroups.find(
            (g) => g.status === CellStatus.included && g.len > secondValue,
        );
        if (!maxValueIncludedGroup) {
            return result;
        }

        const maxValueSeparatedGroup = separatedGroups.find(
            (g) =>
                g.separatorStart.start < maxValueIncludedGroup.start &&
                maxValueIncludedGroup.start < g.separatorEnd.start,
        );

        // validate only if max value is not included fully
        if (
            maxValueIncludedGroup.len !== maxValue &&
            !StatusHelper.validateSeparatedGroups(separatedGroups, values)
        ) {
            return result;
        }

        const valuesSubGroup = values.slice(0, maxValueIndex + 1);
        const cellsSubGroup = this.createCellsSubGroup(
            groupCells,
            maxValue,
            maxValueIncludedGroup,
            maxValueSeparatedGroup,
        );
        // console.log(`\n\t================== GROUP: ${g} ==================`);
        // console.log('\tvaluesSubGroup', valuesSubGroup);
        // console.log('\tmaxValueSeparatedGroup', maxValueSeparatedGroup);
        // console.log('\tfull', CellHelper.toPattern(groupCells));
        // console.log('\tsub', CellHelper.toPattern(cellsSubGroup));

        splitGroupResolvers.forEach((Resolver) => {
            const res = new Resolver().resolveGroup(valuesSubGroup, cellsSubGroup);

            // if (res.included.length || res.excluded.length) {
            // console.log(`\n\t================== GROUP: ${g} ==================`);
            // console.log('\tResolver', Resolver.name);
            // console.log('\tvaluesSubGroup', valuesSubGroup);
            // console.log('\tres', res);
            // console.log('\tfull', CellHelper.toPattern(groupCells));
            // console.log('\tsub', CellHelper.toPattern(cellsSubGroup));
            // }

            result.included.push(...res.included);
            result.excluded.push(...res.excluded);
        });

        return result;
    }

    private createCellsSubGroup(
        cells: CellModel[],
        value: number,
        includedGroup: StatusGroup,
        separatedGroup?: SeparatedGroup,
    ) {
        let sliceIndex = cells.length;

        if (value === includedGroup.len) {
            sliceIndex = includedGroup.start + includedGroup.len;
        } else if (separatedGroup) {
            sliceIndex = separatedGroup.separatorEnd.start;
        }

        return cells.slice(0, Math.min(sliceIndex, cells.length));
    }
}
