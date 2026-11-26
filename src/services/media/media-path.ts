import {MediaAsset} from '@/types/media';

// Folders are just a `/`-prefixed segment of the key — R2 has no real
// directories, so nothing persists once its last asset moves out.
export function folderOf(key: string): string | null {
    const index = key.indexOf('/');
    return index === -1 ? null : key.slice(0, index);
}

export function baseName(key: string): string {
    const index = key.indexOf('/');
    return index === -1 ? key : key.slice(index + 1);
}

export function keyInFolder(key: string, folder: string | null): string {
    return folder ? `${folder}/${baseName(key)}` : baseName(key);
}

// Free text -> a single safe path segment (lowercase, dashes only).
export function sanitizeFolder(input: string): string | null {
    const folder = input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return folder || null;
}

export function distinctFolders(assets: MediaAsset[]): string[] {
    return Array.from(
        new Set(
            assets
                .map((asset) => folderOf(asset.key))
                .filter((folder): folder is string => folder !== null),
        ),
    ).sort();
}
