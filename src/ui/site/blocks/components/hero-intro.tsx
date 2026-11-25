import {Prompt as PromptLine} from '../../site-parts';

// The text column inside <Hero>: a command line, a two-line heading and a lead.
export function HeroIntro({
    command,
    title,
    title2,
    children,
}: PWC<{command?: string; title: string; title2?: string}>) {
    return (
        <div className="flex min-w-0 flex-[3_1_440px] flex-col gap-7">
            {command && <PromptLine>{command}</PromptLine>}
            <h1 className="m-0 font-term text-[clamp(34px,5.2vw,72px)] leading-[1.08] font-bold tracking-[-0.03em]">
                {title}
                {title2 && (
                    <>
                        <br />
                        {title2}
                    </>
                )}
                <span className="text-accent">_</span>
            </h1>
            <div className="contents [&>p]:max-w-135 [&>p]:text-[clamp(17px,1.4vw,19px)] [&>p]:text-soft">
                {children}
            </div>
        </div>
    );
}
