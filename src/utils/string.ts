const trim = (str: string, char = ' ') => {
    return str
        .replace(new RegExp(`^[${char}]*`), '')
        .replace(new RegExp(`[${char}]*$`), '');
};

const match = <T extends Record<string, string>>(
    str: string,
    pattern: string,
): Partial<T> => {
    const regexpPattern = pattern
        .replace(/\//g, '\\/')
        .replace(/:(\w+)/g, (_, match) => `(?<${match}>[\\w\\d]+)`);

    const regexp = new RegExp(regexpPattern, 'g').exec(str);

    return {
        ...(regexp?.groups as Partial<T>),
    };
};

export const string = {
    trim,
    match,
};
