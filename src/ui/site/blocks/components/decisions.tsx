// Numbered list of <Decision>s; numbers come from a CSS counter.
export function Decisions({children}: PWC) {
    return (
        <ol className="m-0 flex list-none flex-col border-t border-line p-0 [counter-reset:decision]">
            {children}
        </ol>
    );
}
