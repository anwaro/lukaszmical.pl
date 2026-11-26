// One object in the media library — the bucket mirrors it 1:1.
export type MediaAsset = {
    key: string;
    url: string;
    size: number;
    lastModified: string;
    contentType?: string;
};
