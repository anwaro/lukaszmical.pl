import {TerminateWorkersTask} from './task/task-terminate-workers';
import {TaskConstructor} from './model/model-task';
import {ImageProcessTask} from './task/task-image-process';
import {GridDetectTask} from './task/task-grid-detect';
import {CellDetectTask} from './task/task-cell-detect';
import {ColumnGroupDetectTask} from './task/task-column-group-detect';
import {RowGroupDetectTask} from './task/task-row-group-detect';
import {PrepareImageToNumberDetectTask} from './task/task-prepare-image-to-number-detect';
import {LoopResolverTask} from './task/task-resolver-loop';
import {LoopHelper} from './helper/helper-loop';
import {EventModel} from './model/model-event';
import {StoreModel} from './model/model-store';

export class MonogramResolverController {
    public store = new StoreModel();

    emitEvent(event: EventModel) {
        const prevEvent = this.store.data.events.find((e) => e.id === event.id);
        if (prevEvent) {
            this.store.setItem(
                'events',
                this.store.data.events.map((e) => (e.id === event.id ? event : e)),
            );
        } else {
            this.store.setItem('events', [...this.store.data.events, event]);
        }
    }

    async onFileSelect(file: File) {
        this.store.reset();
        this.store.setItem('file', file);
        await this.runTasks();
    }

    async runTasks() {
        try {
            await this.run(
                ImageProcessTask,
                GridDetectTask,
                PrepareImageToNumberDetectTask,
                CellDetectTask,
                RowGroupDetectTask,
                ColumnGroupDetectTask,
                LoopResolverTask,
                TerminateWorkersTask,
            );
        } catch (e) {
            console.error(e);
        }
        console.log(this.store);
    }

    async run(...tasks: TaskConstructor[]) {
        for (const TaskClass of tasks) {
            await LoopHelper.delay(10);
            const task = new TaskClass();
            task.start();
            this.emitEvent(task.event);
            let error: Error | undefined = undefined;
            try {
                await task.run(this.store, this.emitEvent.bind(this));
            } catch (e) {
                error = e as Error;
            }
            task.event.finish(task.duration(), error ? `${error}` : '');
            this.emitEvent(task.event);
            console.log(`Task ${TaskClass.name} duration:`, task.duration() / 1000);

            if (error) {
                throw error;
            }
        }
    }
}
