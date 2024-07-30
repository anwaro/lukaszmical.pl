export const compressHtml = (html: string) => {
    return html
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/> </g, '><');
};
