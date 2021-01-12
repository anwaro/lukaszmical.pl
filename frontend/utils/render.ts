type Params = {
    [key: string]: string;
};

const render = (template: string, params: Params) => {
    return template.replace(/{{(\w+)}}/gi, (_: string, key: string) =>
        key in params ? params[key] : key,
    );
};

export default render;
