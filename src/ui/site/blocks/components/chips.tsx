// Wrap a markdown list to render it as a row of chips.
export function Chips({children}: PWC) {
    return (
        <div className="font-term text-sm text-fg [&_li]:rounded-md [&_li]:border [&_li]:border-edge [&_li]:px-3.5 [&_li]:py-2 [&_ul]:m-0 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-wrap [&_ul]:gap-2.5 [&_ul]:p-0">
            {children}
        </div>
    );
}
