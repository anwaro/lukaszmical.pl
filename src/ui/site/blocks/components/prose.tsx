// Plain markdown as an article: headings, lists and paragraphs get spacing.
export function Prose({children}: PWC) {
    return (
        <div className="flex max-w-190 flex-col gap-5 pt-[clamp(32px,5vw,64px)] text-soft [&_h1]:m-0 [&_h1]:font-term [&_h1]:text-[clamp(32px,4.6vw,64px)] [&_h1]:leading-[1.08] [&_h1]:font-bold [&_h1]:tracking-[-0.03em] [&_h1]:text-fg [&_h2]:m-0 [&_h2]:mt-6 [&_h2]:font-term [&_h2]:text-[clamp(22px,2.4vw,30px)] [&_h2]:font-bold [&_h2]:text-fg [&_h3]:m-0 [&_h3]:mt-2 [&_h3]:font-term [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-fg [&_li]:mt-1.5 [&_ol]:m-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-6">
            {children}
        </div>
    );
}
