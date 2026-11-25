// Grid of labelled <Card>s, e.g. the stages of a pipeline.
export function Cards({children}: PWC) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {children}
        </div>
    );
}
