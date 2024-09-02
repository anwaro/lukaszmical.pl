import {ColumnGroupDetector} from '../detector/detector-column-group';
import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class ColumnGroupDetectTask extends TaskModel {
    public eventName = EventType.detectColumnGroupSums;

    async run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ) {
        const detector = new ColumnGroupDetector(
            canvas,
            store.data.gridBounds,
            store.data.columnSumsBounds,
            store.data.cells,
            store.data.cellInfo,
        );

        await detector.run();

        store.setItem('groups', [...store.data.groups, ...detector.columns]);
    }
}
