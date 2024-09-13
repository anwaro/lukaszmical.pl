import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';
import {PrepareImageToNumberDetect} from '../image/prepare-image-to-number-detect';

export class PrepareImageToNumberDetectTask extends TaskModel {
    public eventName = EventType.imageProcessedToNumberDetect;

    async run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ) {
        const service = new PrepareImageToNumberDetect();

        const data = await service.run(
            store.data.image,
            store.data.gridBounds,
            store.data.rowValuesBounds,
            store.data.columnValuesBounds,
        );

        const ctx = canvas.getContext('2d');
        canvas.width = data.width;
        canvas.height = data.height;

        if (ctx) {
            ctx.putImageData(data, 0, 0);
        }

        store.setItem('imageProcessed', data);
    }
}
