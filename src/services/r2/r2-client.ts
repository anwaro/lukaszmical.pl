import {
    CopyObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

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

    public async get(key: string, contentType?: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        contentType && (command.input.ResponseContentType = contentType);

        return await this.client.send(command);
    }
}
