// Edits a `string[]` field as a comma-separated list of trimmed values.
export function listFieldValueToText(value: string[] | undefined): string {
    return (value ?? []).join(', ');
}

export function listFieldTextToValue(text: string): string[] {
    return text
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}
