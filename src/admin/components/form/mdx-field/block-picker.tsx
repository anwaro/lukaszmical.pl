import React, {useState} from 'react';

import {clsx} from 'clsx';

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
        <aside className="flex w-72 flex-none flex-col border-l border-gray-700 text-sm">
            <div className="flex flex-wrap gap-1.5 border-b border-gray-700 p-3">
                {sections.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        title={item.description}
                        onClick={() => setActive(item.id)}
                        className={clsx(
                            'rounded px-2 py-1 text-xs',
                            item.id === active
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
                        )}
                    >
                        {item.title}
                    </button>
                ))}
            </div>
            <p className="px-3 pt-3 text-xs text-slate-400">{section.description}</p>
            <ul className="flex flex-col gap-2 overflow-y-auto p-3">
                {section.blocks.map((block) => (
                    <li key={block.name}>
                        <button
                            type="button"
                            title="Insert at the cursor"
                            onClick={() => onInsert(block.snippet)}
                            className="w-full rounded border border-gray-700 p-2.5 text-left hover:border-blue-500"
                        >
                            <span className="font-mono font-bold text-blue-300">
                                {`<${block.name}>`}
                            </span>
                            {block.parts && (
                                <span className="ml-2 font-mono text-xs text-slate-400">
                                    {block.parts.map((part) => `<${part}>`).join(' ')}
                                </span>
                            )}
                            <span className="mt-1 block text-xs text-slate-400">
                                {block.description}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
