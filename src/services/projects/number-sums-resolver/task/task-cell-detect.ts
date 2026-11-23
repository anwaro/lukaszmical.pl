import {CellDetector} from '../detector/detector-cell';
import {TaskModel} from '../model/model-task';
import {EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class CellDetectTask extends TaskModel {
    public eventName = EventType.detectCellsSums;

    async run(canvas: HTMLCanvasElement, store: StoreModel) {
        const detector = new CellDetector(
            canvas,
            store.data.image,
            store.data.gridBounds,
            store.data.borderWidth,
            store.data.cellInfo,
        );

        await detector.run();
        store.setItem('cells', detector.cells);
    }
}
