import {
    CopyObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

export type R2Object = {
    key: string;
    size: number;
    lastModified: Date;
};

export class R2Client {
    protected client: S3Client;
    protected bucket: string;

    constructor() {
        this.bucket = `${process.env.R2_BUCKET_NAME}`;
        this.client = new S3Client({
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
                accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
                secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
            },
        });
    }

    public publicDomain() {
        return `${process.env.R2_BUCKET_PUBLIC_URL}`;
    }

    public async upload(key: string, fileBuffer: Buffer, contentType?: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Body: fileBuffer,
            Key: key,
        });
        if (contentType) {
            command.input.ContentType = contentType;
        }
        return this.client.send(command);
    }

    public async copy(from: string, to: string) {
        const command = new CopyObjectCommand({
            CopySource: `${this.bucket}/${from}`,
            Key: to,
            Bucket: this.bucket,
        });

        return this.client.send(command);
    }

    public async move(from: string, to: string) {
        await this.copy(from, to);
        return await this.remove([from]);
    }

    public async remove(keys: string[]) {
        if (keys.length === 0) {
            return;
        }

        const command = new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: {
                Objects: keys.map((key) => ({Key: key})),
            },
        });

        return this.client.send(command);
    }

    // Every object at the bucket root. Fine for a personal site's bucket
    // (hundreds to low thousands of objects) since the whole result is held
    // in memory and cached — a large bucket would need a server-side cursor
    // instead of listing everything up front.
    public async list(): Promise<R2Object[]> {
        const objects: R2Object[] = [];
        let continuationToken: string | undefined;

        do {
            const command = new ListObjectsV2Command({
                Bucket: this.bucket,
                ContinuationToken: continuationToken,
            });
            const response = await this.client.send(command);

            for (const item of response.Contents ?? []) {
                if (item.Key) {
                    objects.push({
                        key: item.Key,
                        size: item.Size ?? 0,
                        lastModified: item.LastModified ?? new Date(0),
                    });
                }
            }

            continuationToken = response.IsTruncated
                ? response.NextContinuationToken
                : undefined;
        } while (continuationToken);

        return objects;
    }

    public async get(key: string, contentType?: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        if (contentType) {
            command.input.ResponseContentType = contentType;
        }

        return await this.client.send(command);
    }
}
