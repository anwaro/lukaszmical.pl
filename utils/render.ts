interface IParams {
    [key: string]: string;
}

const render = (template: string, params: IParams) => {
    return template.replace(/{{(\w+)}}/gi, (_: string, key: string) =>
        params.hasOwnProperty(key) ? params[key] : key
    );
};


export default render;