import {createScheduler, createWorker, ImageLike, Rectangle} from 'tesseract.js';

const scheduler = createScheduler();
const workerNumber = 5;

export class NumberDetector {
    async initializeDetector() {
        if (scheduler.getNumWorkers() === 0) {
            for (let i = 0; i < workerNumber; i++) {
                // use some non latin language
                const worker = await createWorker('pol');
                scheduler.addWorker(worker);
            }
        }
    }

    async detectNumbers(image: ImageLike, rectangle: Rectangle, debug = false) {
        this.validateRectangle(rectangle);
        const ret = await scheduler.addJob('recognize', image, {rectangle});

        if (ret.data.confidence < 90) {
            console.log(ret.data.text);
            console.log(ret.data);
            console.log(ret.data.symbols);
        }

        return ret.data.text.split(/\D+/g).filter(Boolean);
    }

    fixNumbers(numbers: string[]) {
        return numbers.map((n) => Number(n));
    }

    async terminate() {
        // await scheduler.terminate();
    }

    validateRectangle(rectangle: Rectangle) {
        if (
            [rectangle.left, rectangle.top, rectangle.width, rectangle.height].some(
                (v) => v <= 0,
            )
        ) {
            throw `Invalid rectangle value ${JSON.stringify(rectangle)}`;
        }
    }
}
