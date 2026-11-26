import React, {useState} from 'react';

import {X} from 'lucide-react';

import {IconButton} from '@/admin/components/button/icon-button';
import {chipClassName} from '@/admin/components/chip-class-name';
import {BlockPreview} from '@/admin/components/form/mdx-field/block-preview';
import {Locale} from '@/types/locale';
import {blockSections, BlockSection} from '@/ui/site/blocks/block-library';

type Props = {
    locale: Locale;
    onInsert: (snippet: string) => void;
    onClose: () => void;
};

const sections: readonly BlockSection[] = blockSections;

// The block library next to the editor: pick a section, click a block to
// insert its snippet at the cursor. Collapsible — see `onClose` — so the
// editor can take the full width on small screens.
export function BlockPicker({locale, onInsert, onClose}: Props) {
    const [active, setActive] = useState(sections[0].id);
    const section = sections.find((item) => item.id === active) ?? sections[0];

    return (
        <aside className="flex max-h-[50vh] w-full flex-none flex-col border-t border-slate-200 bg-white lg:h-full lg:max-h-none lg:w-80 lg:border-t-0 lg:border-l dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 p-3 dark:border-slate-800">
                <div className="flex flex-1 flex-wrap gap-1.5">
                    {sections.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            title={item.description}
                            aria-pressed={item.id === active}
                            onClick={() => setActive(item.id)}
                            className={chipClassName()}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
                <IconButton
                    icon={X}
                    label="Zamknij bloczki"
                    onClick={onClose}
                    className="flex-none"
                />
            </div>
            <p className="px-3 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                {section.description}
            </p>
            <ul className="flex flex-col gap-2 overflow-y-auto p-3">
                {section.blocks.map((block) => (
                    <li key={block.name}>
                        <button
                            type="button"
                            title="Wstaw w miejscu kursora"
                            onClick={() => onInsert(block.snippet)}
                            className="w-full cursor-pointer rounded-lg border border-slate-200 p-2.5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                        >
                            <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
                                {`<${block.name}>`}
                            </span>
                            {block.parts && (
                                <span className="ml-2 font-mono text-xs text-slate-400">
                                    {block.parts
                                        .map((part) => `<${part}>`)
                                        .join(' ')}
                                </span>
                            )}
                            <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">
                                {block.description}
                            </span>
                            <BlockPreview snippet={block.snippet} locale={locale} />
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
