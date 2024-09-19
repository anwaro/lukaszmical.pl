import {EventModel} from './model-event';
import {CellModel} from './model-cell';
import {GroupModel} from './model-group';

export type Bounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export const initialBounds = (): Bounds => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
});

export type CellsInfo = {
    size: number;
    count: number;
};

type Listener = () => void;

export type ImageFileData = {
    data: ImageData;
    name: string;
    src: string;
};
export const initialImageFileData = (): ImageFileData => ({
    data: new ImageData(1, 1),
    name: '',
    src: '',
});

export type StoreData = {
    file: File;
    image: ImageFileData;
    processedImage: ImageFileData;
    gridBounds: Bounds;
    rowValuesBounds: Bounds;
    columnValuesBounds: Bounds;
    cellInfo: CellsInfo;
    borderWidth: number;
    cells: CellModel[];
    groups: GroupModel[];
    events: EventModel[];
};

const initialState = (): StoreData => ({
    file: new File([], ''),
    image: initialImageFileData(),
    processedImage: initialImageFileData(),
    gridBounds: initialBounds(),
    rowValuesBounds: initialBounds(),
    columnValuesBounds: initialBounds(),
    cellInfo: {size: 0, count: 0},
    borderWidth: 1,
    cells: [],
    groups: [],
    events: [],
});

export class StoreModel {
    public data: StoreData = initialState();
    private listeners: Listener[] = [];

    setItem<Key extends keyof StoreData>(key: Key, value: StoreData[Key]) {
        this.data[key] = value;
        this.emitChange();
    }

    reset = () => {
        this.data = initialState();
        this.emitChange();
    };

    subscribe = (listener: Listener) => {
        this.listeners = [...this.listeners, listener];

        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    };

    getSnapshot = () => {
        return this.data;
    };

    emitChange() {
        for (let listener of this.listeners) {
            listener();
        }
    }
}
