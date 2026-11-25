import React from 'react';

import {StaticBlockName} from './blocks/block-library';
import {
    Arrow,
    Big,
    Button,
    Buttons,
    Card,
    Cards,
    Chips,
    CodePanel,
    Contact,
    Cta,
    Decision,
    Decisions,
    Demo,
    Flow,
    Hero,
    HeroIntro,
    Lead,
    Prompt,
    Prose,
    Section,
    sectionGap,
    Shot,
    Shots,
    Solver,
    Split,
    Stack,
    Stat,
    Stats,
    Step,
} from './blocks/components';

// Static blocks of the block library (`blocks/block-library.ts`), each in its
// own file under `blocks/components/`. Blocks fed from the database live in
// `content-mdx-dynamic.tsx`. Props are plain strings so they survive
// next-mdx-remote's JS blocking.

export {sectionGap};

export const contentMdxComponents = {
    Hero,
    HeroIntro,
    Buttons,
    Button,
    Solver,
    Split,
    Lead,
    Prompt,
    Prose,
    Cta,
    Stack,
    Contact,
    Section,
    Big,
    Shot,
    Shots,
    Flow,
    Step,
    Arrow,
    Decisions,
    Decision,
    Chips,
    Stats,
    Stat,
    Cards,
    Card,
    CodePanel,
    Demo,
} satisfies Record<StaticBlockName, React.ComponentType<any>>;

export const contentProseClass = [
    '[&_p]:m-0',
    // Links written in markdown; buttons and cards rendered by blocks keep their look.
    '[&_:is(p,li)>a]:underline [&_:is(p,li)>a]:underline-offset-4 [&_:is(p,li)>a:hover]:text-accent',
    '[&_:not(pre)>code]:font-term [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:text-accent',
    '[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-5 [&_pre]:font-term [&_pre]:text-sm [&_pre]:leading-[1.7]',
    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
].join(' ');
