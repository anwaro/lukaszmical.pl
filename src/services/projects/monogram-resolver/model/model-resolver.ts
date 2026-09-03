import {CellModel} from '../model/model-cell';
import {GroupModel} from '../model/model-group';
import {ResolverResult} from './model-resolver-result';
import {ResolverIndexResult} from './model-resolver-index-result';

export abstract class ResolverModel {
    abstract run(group: GroupModel, cells: CellModel[]): ResolverResult;

    abstract resolveGroup(values: number[], cells: CellModel[]): ResolverIndexResult;
}
