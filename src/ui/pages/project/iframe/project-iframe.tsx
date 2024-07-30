import React from 'react';

type Props = {
    html: string;
};

export function ProjectIframe({html}: Props) {
    return <iframe className="h-screen w-screen" srcDoc={html} />;
}
