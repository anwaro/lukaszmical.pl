import {
    ImageFileData,
    initialImageFileData,
} from '@/services/projects/monogram-resolver/model/model-store';

export class ImageFileLoader {
    private image: ImageFileData = initialImageFileData();

    getImage(): ImageFileData {
        return this.image;
    }

    async loadFromFile(file: File) {
        const image = await this.createImageElement(file);
        this.image.name = file.name;
        this.image.src = image.src;
        this.image.data = this.imageToImageData(image);
    }

    async loadFromImageData(image: ImageData) {
        this.image.src = await this.imageDataToUrl(image);
        this.image.data = image;
    }

    createImageElement(file: File): Promise<HTMLImageElement> {
        const img = new Image();
        return new Promise((resolve) => {
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                resolve(img);
            };
        });
    }

    private imageToImageData(image: HTMLImageElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    async imageDataToUrl(image: ImageData) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.putImageData(image, 0, 0);

        const dataURI = canvas.toDataURL();
        const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const binary = atob(dataURI.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], {type: mime});

        return URL.createObjectURL(blob);
    }
}
