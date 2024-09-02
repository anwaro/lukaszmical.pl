import {GroupId} from '../model/model-group';

export class ColumnHelper {
    static columnName(index: number): string {
        return String.fromCharCode(65 + index);
    }

    static id(index: number): GroupId {
        return `COL-${String.fromCharCode(65 + index)}`;
    }
}
