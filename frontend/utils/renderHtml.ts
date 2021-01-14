const renderHtml = (template: string, params: Record<string, string>) => {
    return template.replace(/{{(\w+)}}/gi, (_: string, key: string) =>
        key in params ? params[key] : key,
    );
};

export default renderHtml;
