export class FileToImageData {
    createImageElement(file: File): Promise<HTMLImageElement> {
        const img = new Image();
        return new Promise((resolve) => {
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                resolve(img);
            };
        });
    }

    createImageData(image: HTMLImageElement): ImageData {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    async getImageData(file: File) {
        const image = await this.createImageElement(file);
        return this.createImageData(image);
    }
}
