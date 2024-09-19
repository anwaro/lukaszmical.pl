import {allResolvers} from '../resolver';
import {CellId, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {LoopHelper} from '../helper/helper-loop';
import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';
import {TotalSizeResolver} from '../resolver/resolver-total-size';
import {ValidatorModel} from '../model/model-validator';
import {CellHelper} from '../helper/helper-cell';

let resolveLoop = 1;

export class LoopResolverTask extends TaskModel {
    public eventName = EventType.resolverJob;
    private validator = new ValidatorModel();

    async run(store: StoreModel, emitEvent: (event: EventModel) => void) {
        let loop = 0;
        resolveLoop = 1;
        this.runResolver(new TotalSizeResolver(), store);

        const resolvers: ResolverModel[] = allResolvers.map(
            (Resolver) => new Resolver(),
        );

        while (true) {
            loop++;
            const time = new Date().getTime();
            let updatedCells = 0;
            for (const resolver of resolvers) {
                updatedCells += this.runResolver(resolver, store);
            }
            const cellsWithUnknownStatus = store.data.cells.filter(
                (c) => c.status === CellStatus.unknown,
            ).length;

            console.log(
                'Loop:',
                loop,
                'UpdatedCells:',
                updatedCells,
                'CellsWithUnknownStatus:',
                cellsWithUnknownStatus,
            );

            if (cellsWithUnknownStatus === 0) {
                emitEvent(
                    new EventModel(
                        EventType.resolverDone,
                        false,
                        new Date().getTime() - time,
                    ),
                );
                break;
            }

            if (updatedCells === 0) {
                emitEvent(
                    new EventModel(
                        EventType.resolverError,
                        false,
                        new Date().getTime() - time,
                    ),
                );
                break;
            }

            emitEvent(
                new EventModel(
                    EventType.resolverLoop,
                    false,
                    new Date().getTime() - time,
                ),
            );
            await LoopHelper.delay(50);
        }
    }

    runResolver(resolver: ResolverModel, store: StoreModel) {
        let unknownCells = store.data.cells.filter(
            (c) => c.status === CellStatus.unknown,
        ).length;

        for (const group of store.data.groups) {
            if (CellHelper.unknownCells(store.data.cells).length === 0) {
                continue;
            }
            const result = resolver.run(group, group.cells(store.data.cells));
            const included = result.getIncludedCellsId();
            const excluded = result.getExcludedCellsId();
            this.updateCells(
                store,
                included,
                excluded,
                resolver.constructor.name,
                group.id,
                resolveLoop,
            );
            if (included.length || excluded.length) {
                resolveLoop++;
                console.log(
                    '\t',
                    resolver.constructor.name,
                    group.id,
                    'Included:',
                    ...included,
                    'Excluded:',
                    ...excluded,
                );
                this.validator.validate(store.data.groups, store.data.cells);
            }
        }
        let unknownCellsCellsAfter = store.data.cells.filter(
            (c) => c.status === CellStatus.unknown,
        ).length;

        return unknownCells - unknownCellsCellsAfter;
    }

    updateCells(
        store: StoreModel,
        included: CellId[],
        excluded: CellId[],
        resolverName: string,
        resolveInGroup: string,
        loop: number,
    ) {
        store.setItem(
            'cells',
            store.data.cells.map((cell) => {
                const newStatus = (() => {
                    if (included.includes(cell.id)) {
                        return CellStatus.included;
                    }
                    if (excluded.includes(cell.id)) {
                        return CellStatus.excluded;
                    }
                    return undefined;
                })();

                if (newStatus && cell.status !== newStatus) {
                    if (cell.status !== CellStatus.unknown) {
                        throw [
                            `Forbidden cell status update,`,
                            `Cell: ${cell.id},`,
                            `Update: ${cell.status} --> ${newStatus},`,
                            `Resolver: ${resolverName},`,
                            `Group: ${resolveInGroup}`,
                        ].join(' ');
                    }
                    return cell.updateStatus(
                        newStatus,
                        resolverName,
                        resolveInGroup,
                        loop,
                    );
                }

                return cell;
            }),
        );
    }
}
