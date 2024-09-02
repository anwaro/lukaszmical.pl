import {GroupId} from '@/services/projects/number-sums-resolver/model/model-group';

export class RowHelper {
    static rowName(index: number): number {
        return index + 1;
    }

    static id(index: number): GroupId {
        return `ROW-${index + 1}`;
    }
}
