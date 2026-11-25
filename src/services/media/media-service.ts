import {R2Client} from '@/services/r2/r2-client';
import {MediaAsset} from '@/types/media';

function fileName(name: string): string {
    const prefix = (Math.random() + 1).toString(36).substring(7);

    return [
        prefix,
        name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\-.a-z0-9]/, ''),
    ].join('-');
}

// The media library: the bucket root, flat, mirrored 1:1.
export class MediaService {
    private r2 = new R2Client();

    async list(): Promise<MediaAsset[]> {
        const objects = await this.r2.list();
        const domain = this.r2.publicDomain();

        return objects
            .map((object) => ({
                key: object.key,
                url: `${domain}/${object.key}`,
                size: object.size,
                lastModified: object.lastModified.toISOString(),
            }))
            .sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    }

    async upload(file: File): Promise<MediaAsset> {
        const key = fileName(file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        await this.r2.upload(key, buffer, file.type);

        return {
            key,
            url: `${this.r2.publicDomain()}/${key}`,
            size: buffer.byteLength,
            lastModified: new Date().toISOString(),
            contentType: file.type,
        };
    }

    async remove(key: string): Promise<void> {
        await this.r2.remove([key]);
    }
}
