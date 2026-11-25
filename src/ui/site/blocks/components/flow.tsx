// Architecture diagram: <Step> boxes joined by <Arrow>s.
export function Flow({children}: PWC) {
    return <div className="flex flex-wrap items-stretch gap-3">{children}</div>;
}
