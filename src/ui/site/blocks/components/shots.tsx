// Grid of <Shot> screenshots.
export function Shots({children}: PWC) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 pt-[clamp(48px,7vw,96px)]">
            {children}
        </div>
    );
}
