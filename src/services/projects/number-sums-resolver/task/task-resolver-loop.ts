import {CellStatus} from '../model/model-cell';
import {SumCantExistWithoutNumberResolver} from '../resolver/resolver-sum-cant-exist-without-number';
import {ResolverModel, ResolverResult} from '../model/model-resolver';
import {LoopHelper} from '../helper/helper-loop';
import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';
import {OddEvenSumResolver} from '../resolver/resolver-odd-even-sum';
import {NumberGreaterThanSumResolver} from '../resolver/resolver-number-greater-than-sum';
import {CantCreateSumWithNumberResolver} from '../resolver/resolver-cant-create-sum-with-number';

export class LoopResolverTask extends TaskModel {
    public eventName = EventType.resolveLoop;

    async run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ) {
        const resolvers: ResolverModel[] = [
            new NumberGreaterThanSumResolver(),
            new SumCantExistWithoutNumberResolver(),
            new OddEvenSumResolver(),
            new CantCreateSumWithNumberResolver(),
        ];

        while (true) {
            const time = new Date().getTime();
            let editedCells = 0;
            for (const resolver of resolvers) {
                editedCells += this.runLoop(store, resolver);
            }
            const cellsWithUnknownStatus = store.data.cells.filter(
                (c) => c.status === CellStatus.unknown,
            ).length;

            if (cellsWithUnknownStatus === 0) {
                emitEvent(
                    new EventModel(
                        EventType.solveDone,
                        false,
                        new Date().getTime() - time,
                    ),
                );
                break;
            }

            if (editedCells === 0) {
                emitEvent(
                    new EventModel(
                        EventType.solveError,
                        false,
                        new Date().getTime() - time,
                    ),
                );
                break;
            }

            emitEvent(
                new EventModel(
                    EventType.solvedCells,
                    false,
                    new Date().getTime() - time,
                ),
            );
            await LoopHelper.delay(50);
        }
    }

    updateCells(
        store: StoreModel,
        {included, excluded}: ResolverResult,
        resolver: string,
        resolveInGroup: string,
    ) {
        store.setItem(
            'cells',
            store.data.cells.map((cell) => {
                if (included.includes(cell.id)) {
                    return cell.updateStatus(
                        CellStatus.included,
                        resolver,
                        resolveInGroup,
                    );
                }
                if (excluded.includes(cell.id)) {
                    return cell.updateStatus(
                        CellStatus.excluded,
                        resolver,
                        resolveInGroup,
                    );
                }
                return cell;
            }),
        );
    }

    runLoop(store: StoreModel, resolver: ResolverModel) {
        let editedCells = 0;

        for (const group of store.data.groups) {
            const result = resolver.run(group, group.cells(store.data.cells));
            this.updateCells(store, result, resolver.constructor.name, group.id);
            editedCells += result.included.length;
            editedCells += result.excluded.length;
        }

        return editedCells;
    }
}
