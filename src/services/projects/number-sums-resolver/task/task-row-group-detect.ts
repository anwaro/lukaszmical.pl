import {RowGroupDetector} from '../detector/detector-row-group';
import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class RowGroupDetectTask extends TaskModel {
    public eventName = EventType.detectRowGroupsSums;

    async run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ) {
        const detector = new RowGroupDetector(
            canvas,
            store.data.gridBounds,
            store.data.rowSumsBounds,
            store.data.cells,
            store.data.cellInfo,
        );

        await detector.run();

        store.setItem('groups', [...store.data.groups, ...detector.rows]);
    }
}
