import {CellModel} from '../model/model-cell';
import {GroupModel} from '../model/model-group';
import {ResolveIndexResult, ResolverResult} from './model-resolver-result';

export abstract class ResolverModel {
    abstract run(group: GroupModel, cells: CellModel[]): ResolverResult;

    abstract resolveGroup(values: number[], cells: CellModel[]): ResolveIndexResult;
}
