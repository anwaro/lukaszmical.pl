import {GridDetector} from '../detector/detector-grid';
import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class GridDetectTask extends TaskModel {
    public eventName = EventType.detectGrid;

    async run(store: StoreModel, emitEvent: (event: EventModel) => void) {
        const detector = new GridDetector(store.data.image.data);

        store.setItem('gridBounds', detector.gridBounds);
        store.setItem('columnValuesBounds', detector.columnValuesBounds);
        store.setItem('rowValuesBounds', detector.rowValuesBounds);
        store.setItem('cellInfo', detector.cellInfo);
        store.setItem('borderWidth', detector.borderWidth);
    }
}
