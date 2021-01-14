import fs from 'fs';

export const readFile = (file: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (error, content) => {
            if (error) {
                reject(error);
            } else {
                resolve(content.toString());
            }
        });
    });
};

export const writeFile = (file: string, content: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

export const readDir = async (dir: string): Promise<string[]> => {
    const listPromise = new Promise<string[]>((resolve, reject) => {
        fs.readdir(dir, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    });
    return await listPromise.catch(() => [] as string[]);
};
