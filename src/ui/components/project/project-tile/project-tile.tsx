'use client';

import React, {useMemo, useRef} from 'react';

import {useFormatter, useLocale} from 'next-intl';

import {ProjectListItem} from '@/types/supabase/projects';
import {Mouse} from '@/ui/pages/project/use-mouse';
import {ProjectCover, ProjectLink} from '@/ui/components';

type Props = {
    project: ProjectListItem;
    mouse: Mouse;
};

export function ProjectTile({project, mouse}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const locale = useLocale();

    const format = useFormatter();

    const style = useMemo(() => {
        if (!mouse.active) {
            return {};
        }

        const bounds = ref.current?.getBoundingClientRect() || {left: 0, top: 0};
        const x = mouse.x - bounds.left;
        const y = mouse.y - bounds.top;

        return {
            backgroundImage: `radial-gradient(200px at ${x}px ${y}px, rgb(100, 45, 165), transparent)`,
        };
    }, [mouse]);

    return (
        <ProjectLink type={project.type} url={project.url}>
            <div ref={ref} className="group rounded p-0.5" style={style}>
                <div className="relative aspect-video overflow-hidden rounded bg-black shadow">
                    <ProjectCover
                        project={project}
                        className="transition-transform group-hover:scale-105"
                    />
                    <div className="absolute left-0 top-0 flex size-full flex-col-reverse justify-between text-white group-hover:bg-black/50">
                        <div className="flex flex-col bg-gradient-to-t from-black/75 pt-2">
                            <div className="translate-y-4 px-2 py-1 text-2xl transition-transform will-change-transform group-hover:translate-y-0">
                                {project.name}
                            </div>
                            <div className="translate-y-full px-2 pb-1 text-xs text-gray-300 transition-transform will-change-transform group-hover:translate-y-0">
                                {project.description}&nbsp;
                            </div>
                        </div>
                        <time
                            className="flex -translate-y-full justify-end bg-gradient-to-b from-black/75 p-1 pb-5 text-xs text-gray-300 transition-transform will-change-transform group-hover:translate-y-0"
                            dateTime={project.createdAt}
                        >
                            {format.dateTime(new Date(project.createdAt), {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </time>
                    </div>
                </div>
            </div>
        </ProjectLink>
    );
}
