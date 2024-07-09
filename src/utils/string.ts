export const trim = (str: string, char = ' ') => {
    return str
        .replace(new RegExp(`^[${char}]*`), '')
        .replace(new RegExp(`[${char}]*$`), '');
};
