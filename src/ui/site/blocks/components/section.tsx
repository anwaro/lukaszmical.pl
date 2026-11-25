import {Prompt as PromptLine} from '../../site-parts';

// Two-column block: `# title` on the left, content on the right.
export function Section({title, children}: PWC<{title: string}>) {
    return (
        <section className="flex flex-wrap gap-x-16 gap-y-4 pt-[clamp(48px,7vw,96px)]">
            <PromptLine as="h2" symbol="#" className="flex-[1_1_220px]">
                {title}
            </PromptLine>
            <div className="flex min-w-0 flex-[3_1_480px] flex-col gap-6 text-soft [&>p]:max-w-190">
                {children}
            </div>
        </section>
    );
}
