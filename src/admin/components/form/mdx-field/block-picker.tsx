import React, {useState} from 'react';

import {blockSections, BlockSection} from '@/ui/site/blocks/block-library';

type Props = {
    onInsert: (snippet: string) => void;
};

const sections: readonly BlockSection[] = blockSections;

// The block library next to the editor: pick a section, click a block to
// insert its snippet at the cursor.
export function BlockPicker({onInsert}: Props) {
    const [active, setActive] = useState(sections[0].id);
    const section = sections.find((item) => item.id === active) ?? sections[0];

    return (
        <aside className="flex w-72 flex-none flex-col border-l border-(--border) bg-(--surface)">
            <div className="flex flex-wrap gap-1.5 border-b border-(--border-subtle) p-3">
                {sections.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        title={item.description}
                        aria-pressed={item.id === active}
                        onClick={() => setActive(item.id)}
                        className="kv-chip"
                    >
                        {item.title}
                    </button>
                ))}
            </div>
            <p className="kv-caption px-3 pt-3">{section.description}</p>
            <ul className="flex flex-col gap-2 overflow-y-auto p-3">
                {section.blocks.map((block) => (
                    <li key={block.name}>
                        <button
                            type="button"
                            title="Wstaw w miejscu kursora"
                            onClick={() => onInsert(block.snippet)}
                            className="w-full cursor-pointer rounded-lg border border-(--border-control) p-2.5 text-left transition-colors hover:border-(--accent-dot) hover:bg-(--surface-hover)"
                        >
                            <span className="kv-kbd font-medium text-(--accent-ink)">
                                {`<${block.name}>`}
                            </span>
                            {block.parts && (
                                <span className="kv-kbd ml-2 text-(--ink-faint)">
                                    {block.parts
                                        .map((part) => `<${part}>`)
                                        .join(' ')}
                                </span>
                            )}
                            <span className="kv-caption mt-1 block font-normal">
                                {block.description}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
