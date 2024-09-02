import {GridDetector} from '@/services/projects/number-sums-resolver/detector/detector-grid';

import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class GridDetectTask extends TaskModel {
    public eventName = EventType.detectGrid;

    async run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ) {
        const detector = new GridDetector(store.data.image);

        store.setItem('gridBounds', detector.gridBounds);
        store.setItem('columnSumsBounds', detector.columnSums);
        store.setItem('rowSumsBounds', detector.rowSums);
        store.setItem('cellInfo', detector.cellInfo);
        store.setItem('borderWidth', detector.borderWidth);
    }
}
