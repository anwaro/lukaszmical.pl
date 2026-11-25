// Top of a page: <HeroIntro> next to a visual such as <Solver>.
export function Hero({children}: PWC) {
    return (
        <section className="flex flex-wrap items-center gap-x-16 gap-y-12 pt-[clamp(40px,7vw,96px)] pb-[clamp(56px,8vw,112px)]">
            {children}
        </section>
    );
}
