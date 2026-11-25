// A single entry inside <Decisions>.
export function Decision({title, children}: PWC<{title: string}>) {
    return (
        <li className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line py-6 [counter-increment:decision] before:flex-[0_0_40px] before:font-term before:text-sm before:text-accent before:content-[counter(decision,decimal-leading-zero)]">
            <span className="flex flex-[1_1_320px] flex-col gap-1.5">
                <span className="font-term text-lg font-bold text-fg">{title}</span>
                <span className="text-soft">{children}</span>
            </span>
        </li>
    );
}
