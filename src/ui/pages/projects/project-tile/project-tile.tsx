'use client';

import React, {useMemo, useRef} from 'react';
import {ProjectRow} from '@/types/supabase/projects';
import {Mouse} from '@/ui/pages/projects/use-mouse';
import Image from 'next/image';
import {ProjectLink} from '@/ui/atoms';

type Props = {
    project: ProjectRow;
    mouse: Mouse;
};

export function ProjectTile({project, mouse}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const backgroundImage = useMemo(() => {
        if (!mouse.active) {
            return 'none';
        }

        const bounds = ref.current?.getBoundingClientRect() || {left: 0, top: 0};
        const x = mouse.x - bounds?.left;
        const y = mouse.y - bounds?.top;

        return `radial-gradient(200px at ${x}px ${y}px, rgb(100, 45, 165), transparent)`;
    }, [mouse]);

    return (
        <ProjectLink project={project}>
            <div
                ref={ref}
                className="text-white p-0.5 rounded"
                style={{backgroundImage}}
            >
                <div className="text-white min-h-16 bg-black rounded">
                    <Image
                        src={`/projects/${project.slug}/image/cover.jpg`}
                        alt={project.name}
                        width={400}
                        height={300}
                    />
                    <span>{project.name}</span>
                    <span>{project.description}</span>
                </div>
            </div>
        </ProjectLink>
    );
}
