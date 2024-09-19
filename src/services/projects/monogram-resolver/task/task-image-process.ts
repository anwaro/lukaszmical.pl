import {ImageFileLoader} from '../image/image-file-loader';
import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class ImageProcessTask extends TaskModel {
    public eventName = EventType.imageProcessed;

    async run(store: StoreModel, emitEvent: (event: EventModel) => void) {
        const loader = new ImageFileLoader();
        await loader.loadFromFile(store.data.file);
        store.setItem('image', loader.getImage());
    }
}
