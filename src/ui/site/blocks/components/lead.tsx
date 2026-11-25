import {Prompt as PromptLine} from '../../site-parts';

// A column inside <Split>: an optional command line, then large text.
export function Lead({command, children}: PWC<{command?: string}>) {
    return (
        <div className="flex min-w-0 flex-[3_1_400px] flex-col gap-5">
            {command && <PromptLine as="h2">{command}</PromptLine>}
            <div className="flex flex-col gap-5 text-[clamp(19px,2vw,26px)] leading-[1.4]">
                {children}
            </div>
        </div>
    );
}
