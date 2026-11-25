// Code-like list: `label = ["a", "b"]`; `items` is comma-separated.
export function Stack({
    label = 'stack',
    items = '',
}: {
    label?: string;
    items?: string;
}) {
    const stack = items
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    if (!stack.length) {
        return null;
    }

    return (
        <div className="min-w-0 flex-[2_1_300px] self-start rounded-[10px] border border-line bg-panel p-6 font-term text-sm leading-[1.9]">
            <div>
                <span className="text-muted">{label}</span> = [
            </div>
            <div className="flex flex-wrap gap-x-2 pl-6">
                {stack.map((item) => (
                    <span key={item}>
                        <span className="text-accent">{`"${item}"`}</span>,
                    </span>
                ))}
            </div>
            <div>]</div>
        </div>
    );
}
