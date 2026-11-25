// Grid of <Stat> numbers.
export function Stats({children}: PWC) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            {children}
        </div>
    );
}
