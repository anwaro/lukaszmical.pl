// Opening paragraph of a section, larger and brighter than the rest.
export function Big({children}: PWC) {
    return (
        <div className="max-w-190 text-[clamp(19px,1.8vw,24px)] leading-[1.45] text-fg">
            {children}
        </div>
    );
}
