import {
    createScheduler,
    createWorker,
    ImageLike,
    RecognizeOptions,
} from 'tesseract.js';

const scheduler = createScheduler();
const workerNumber = 5;

export class NumberDetector {
    async initializeDetector() {
        if (scheduler.getNumWorkers() === 0) {
            for (let i = 0; i < workerNumber; i++) {
                // use some non latin language
                const worker = await createWorker('ara');
                scheduler.addWorker(worker);
            }
        }
    }

    async detectNumber(image: ImageLike, options?: Partial<RecognizeOptions>) {
        const ret = await scheduler.addJob('recognize', image, options);

        let result = ret.data.text;

        if (result.includes(' ')) {
            [result] = result.split(' ');
        }

        const number = Number(result.replace(/\D/g, ''));

        if (number === 0 || number > 40) {
            console.log(number, options, ret.data);
        }

        return number;
    }

    async terminate() {
        await scheduler.terminate();
    }
}
