// The block library: every MDX block available in CMS content (homepage, static
// pages, case studies, projects), grouped into sections. This file is plain data
// so the admin editor can list the blocks without importing their components;
// `BlockName` keeps the component maps in sync with it at compile time.

export type BlockEntry = {
    name: string;
    description: string;
    // Inserted into the editor at the cursor.
    snippet: string;
    // Child blocks that only make sense inside this one.
    parts?: readonly string[];
    // Rendered from CMS entries instead of its own content.
    dynamic?: boolean;
};

export type BlockSection = {
    id: string;
    title: string;
    description: string;
    blocks: readonly BlockEntry[];
};

export const blockSections = [
    {
        id: 'layout',
        title: 'Layout',
        description: 'Page structure: sections, columns, hero',
        blocks: [
            {
                name: 'Section',
                description: 'Two columns: “# title” on the left, content on the right',
                snippet: '<Section title="Title">\n\nText\n\n</Section>',
            },
            {
                name: 'Hero',
                description: 'Top of the page: an intro next to a visual',
                parts: ['HeroIntro'],
                snippet:
                    '<Hero>\n<HeroIntro command="whoami" title="First line," title2="second line">\n\nLead paragraph.\n\n<Buttons>\n<Button href="/#kontakt" variant="primary">label</Button>\n</Buttons>\n\n</HeroIntro>\n<Solver label="monogram-resolver" status="solved" alt="Solved nonogram" />\n</Hero>',
            },
            {
                name: 'Split',
                description: 'Row of columns that wraps on small screens; `id` makes it a link target',
                snippet:
                    '<Split id="anchor">\n<Lead command="cat file.md">\n\nText\n\n</Lead>\n<Stack label="stack" items="React, TypeScript" />\n</Split>',
            },
            {
                name: 'Prose',
                description: 'Article typography for plain markdown: headings, lists, paragraphs',
                snippet: '<Prose>\n\n## Heading\n\nText\n\n- item\n\n</Prose>',
            },
        ],
    },
    {
        id: 'text',
        title: 'Text',
        description: 'Headings, paragraphs and calls to action',
        blocks: [
            {
                name: 'Prompt',
                description: 'Terminal line: “$ command” or “# heading”',
                snippet: '<Prompt symbol="$">command</Prompt>',
            },
            {
                name: 'Big',
                description: 'Opening paragraph, larger and brighter than the rest',
                snippet: '<Big>\n\nText\n\n</Big>',
            },
            {
                name: 'Lead',
                description: 'Column with a command line and large text',
                snippet: '<Lead command="cat file.md">\n\nText\n\n</Lead>',
            },
            {
                name: 'Buttons',
                description: 'Row of buttons; variant="primary" fills the button',
                parts: ['Button'],
                snippet:
                    '<Buttons>\n<Button href="/case-studies" variant="primary">primary</Button>\n<Button href="/#kontakt">secondary</Button>\n</Buttons>',
            },
            {
                name: 'Chips',
                description: 'Renders a markdown list as a row of chips',
                snippet: '<Chips>\n\n- one\n- two\n\n</Chips>',
            },
            {
                name: 'Stack',
                description: 'Code-like list; `items` is comma-separated',
                snippet: '<Stack label="stack" items="React, TypeScript" />',
            },
            {
                name: 'Contact',
                description:
                    'Contact panel with an e-mail address, obfuscated in the HTML; `placeholder` shows while `email` is empty',
                snippet:
                    '<Contact id="kontakt" command="mail --to" email="you@example.com">\n\nText\n\n</Contact>',
            },
            {
                name: 'Cta',
                description: 'Banner with a sentence and a button',
                snippet: '<Cta text="Sentence" button="label" href="/projects" />',
            },
        ],
    },
    {
        id: 'data',
        title: 'Data & diagrams',
        description: 'Numbers, cards, decisions and flows',
        blocks: [
            {
                name: 'Stats',
                description: 'Grid of big numbers with captions',
                parts: ['Stat'],
                snippet:
                    '<Stats>\n<Stat value="42">caption</Stat>\n<Stat value="7">caption</Stat>\n</Stats>',
            },
            {
                name: 'Cards',
                description: 'Grid of labelled cards, e.g. stages of a pipeline',
                parts: ['Card'],
                snippet:
                    '<Cards>\n<Card label="01" title="Title">Text</Card>\n<Card label="02" title="Title">Text</Card>\n</Cards>',
            },
            {
                name: 'Decisions',
                description: 'Numbered list of decisions',
                parts: ['Decision'],
                snippet:
                    '<Decisions>\n<Decision title="Title">Why</Decision>\n<Decision title="Title">Why</Decision>\n</Decisions>',
            },
            {
                name: 'Flow',
                description: 'Architecture diagram: steps joined by arrows',
                parts: ['Step', 'Arrow'],
                snippet:
                    '<Flow>\n<Step title="Client">Text</Step>\n<Arrow label="HTTP" />\n<Step title="API" highlight>Text</Step>\n</Flow>',
            },
        ],
    },
    {
        id: 'media',
        title: 'Media & code',
        description: 'Screenshots, code and embedded apps',
        blocks: [
            {
                name: 'Shot',
                description: 'Screenshot; a labelled placeholder while `src` is empty',
                snippet: '<Shot src="" alt="Description">placeholder label</Shot>',
            },
            {
                name: 'Shots',
                description: 'Grid of screenshots',
                snippet:
                    '<Shots>\n<Shot src="" alt="Description">label</Shot>\n<Shot src="" alt="Description">label</Shot>\n</Shots>',
            },
            {
                name: 'CodePanel',
                description: 'Titled frame around a fenced code block',
                snippet: '<CodePanel file="file.ts">\n\n```ts\nconst answer = 42;\n```\n\n</CodePanel>',
            },
            {
                name: 'Demo',
                description: 'Embedded live app (iframe)',
                snippet: '<Demo src="/projects/slug/app" title="Demo" />',
            },
            {
                name: 'Solver',
                description: 'Solved nonogram panel from the homepage hero',
                snippet:
                    '<Solver label="monogram-resolver" status="solved" alt="Solved nonogram" caption="Caption" />',
            },
        ],
    },
    {
        id: 'dynamic',
        title: 'Dynamic (from CMS)',
        description: 'Filled with entries stored in the CMS',
        blocks: [
            {
                name: 'CaseStudyList',
                description: 'Cards of published case studies, in their order',
                dynamic: true,
                snippet: '<CaseStudyList id="case-studies" command="ls case-studies/" />',
            },
            {
                name: 'ProjectList',
                description:
                    'Rows of projects marked “Featured on homepage”; the first `limit` projects when none is',
                dynamic: true,
                snippet: '<ProjectList id="projekty" command="ls -l projekty/" limit="3" />',
            },
        ],
    },
] as const satisfies readonly BlockSection[];

type Entry = (typeof blockSections)[number]['blocks'][number];
type PartsOf<T> = T extends {parts: readonly (infer Part)[]} ? Part : never;

export type DynamicBlockName = Extract<Entry, {dynamic: true}>['name'];
export type StaticBlockName =
    | Exclude<Entry, {dynamic: true}>['name']
    | PartsOf<Entry>;
export type BlockName = StaticBlockName | DynamicBlockName;

const sections: readonly BlockSection[] = blockSections;

// Every tag usable in content, child blocks included.
export const blockNames: string[] = sections.flatMap((section) =>
    section.blocks.flatMap((block) => [block.name, ...(block.parts ?? [])]),
);
