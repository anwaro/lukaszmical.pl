import {
    CellModel,
    CellId,
} from '@/services/projects/number-sums-resolver/model/model-cell';
import {GroupModel} from '@/services/projects/number-sums-resolver/model/model-group';

export type ResolverResult = {
    included: CellId[];
    excluded: CellId[];
};

export abstract class ResolverModel {
    abstract run(group: GroupModel, cells: CellModel[]): ResolverResult;
}
