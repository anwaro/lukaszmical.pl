import {describe, expect, it, vi} from 'vitest';

import {R2Client} from '@/services/r2/r2-client';

import {MediaService} from './media-service';

vi.spyOn(R2Client.prototype, 'publicDomain').mockReturnValue(
    'https://assets.example.com',
);

describe('MediaService', () => {
    describe('list', () => {
        it('maps R2 objects to media assets, newest first', async () => {
            vi.spyOn(R2Client.prototype, 'list').mockResolvedValue([
                {key: 'a-old.jpg', size: 10, lastModified: new Date('2024-01-01')},
                {key: 'b-new.jpg', size: 20, lastModified: new Date('2024-06-01')},
            ]);

            const assets = await new MediaService().list();

            expect(assets.map((asset) => asset.key)).toEqual([
                'b-new.jpg',
                'a-old.jpg',
            ]);
            expect(assets[0].url).toBe('https://assets.example.com/b-new.jpg');
            expect(assets[0].size).toBe(20);
        });

        it('returns an empty list for an empty bucket', async () => {
            vi.spyOn(R2Client.prototype, 'list').mockResolvedValue([]);

            await expect(new MediaService().list()).resolves.toEqual([]);
        });
    });

    describe('upload', () => {
        it('uploads the file under a generated key and returns its asset', async () => {
            const upload = vi
                .spyOn(R2Client.prototype, 'upload')
                .mockResolvedValue(undefined as never);
            const file = new File(['content'], 'My Photo.JPG', {type: 'image/jpeg'});

            const asset = await new MediaService().upload(file);

            expect(upload).toHaveBeenCalledOnce();
            const [key, buffer, contentType] = upload.mock.calls[0];
            expect(key).toMatch(/^[a-z0-9]+-my-photo\.jpg$/);
            expect(Buffer.isBuffer(buffer)).toBe(true);
            expect(contentType).toBe('image/jpeg');
            expect(asset.key).toBe(key);
            expect(asset.url).toBe(`https://assets.example.com/${key}`);
            expect(asset.contentType).toBe('image/jpeg');
        });
    });

    describe('remove', () => {
        it('removes the object by key', async () => {
            const remove = vi
                .spyOn(R2Client.prototype, 'remove')
                .mockResolvedValue(undefined);

            await new MediaService().remove('some-key.jpg');

            expect(remove).toHaveBeenCalledWith(['some-key.jpg']);
        });
    });

    describe('move', () => {
        it('moves the object under the folder and returns the new asset', async () => {
            const move = vi
                .spyOn(R2Client.prototype, 'move')
                .mockResolvedValue(undefined as never);

            const asset = await new MediaService().move(
                {key: 'some-key.jpg', size: 123, contentType: 'image/jpeg'},
                'logos',
            );

            expect(move).toHaveBeenCalledWith('some-key.jpg', 'logos/some-key.jpg');
            expect(asset.key).toBe('logos/some-key.jpg');
            expect(asset.url).toBe('https://assets.example.com/logos/some-key.jpg');
            expect(asset.size).toBe(123);
            expect(asset.contentType).toBe('image/jpeg');
        });

        it('moves a nested object back to the root', async () => {
            const move = vi
                .spyOn(R2Client.prototype, 'move')
                .mockResolvedValue(undefined as never);

            const asset = await new MediaService().move(
                {key: 'logos/some-key.jpg', size: 123},
                null,
            );

            expect(move).toHaveBeenCalledWith('logos/some-key.jpg', 'some-key.jpg');
            expect(asset.key).toBe('some-key.jpg');
        });

        it('does nothing when the key is unchanged', async () => {
            const move = vi
                .spyOn(R2Client.prototype, 'move')
                .mockResolvedValue(undefined as never);

            const asset = await new MediaService().move(
                {key: 'logos/some-key.jpg', size: 123},
                'logos',
            );

            expect(move).not.toHaveBeenCalled();
            expect(asset.key).toBe('logos/some-key.jpg');
        });
    });
});
