import fs from 'fs';

async function* nodeStreamToIterator(stream: fs.ReadStream) {
    for await (const chunk of stream) {
        yield new Uint8Array(chunk);
    }
}

function iteratorToStream(iterator: AsyncGenerator) {
    return new ReadableStream({
        async pull(controller) {
            const {value, done} = await iterator.next();
            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        },
    });
}

export function streamFile(path: string): ReadableStream {
    const nodeStream = fs.createReadStream(path);
    return iteratorToStream(nodeStreamToIterator(nodeStream));
}
