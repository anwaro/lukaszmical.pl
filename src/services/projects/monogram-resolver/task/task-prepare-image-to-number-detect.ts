import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';
import {PrepareImageToNumberDetect} from '../image/prepare-image-to-number-detect';
import {ImageFileLoader} from '../image/image-file-loader';

export class PrepareImageToNumberDetectTask extends TaskModel {
    public eventName = EventType.imageProcessedToNumberDetect;

    async run(store: StoreModel, emitEvent: (event: EventModel) => void) {
        const service = new PrepareImageToNumberDetect();
        const loader = new ImageFileLoader();

        const data = await service.run(
            store.data.image,
            store.data.gridBounds,
            store.data.rowValuesBounds,
            store.data.columnValuesBounds,
        );

        await loader.loadFromImageData(data);

        store.setItem('processedImage', loader.getImage());
    }
}
