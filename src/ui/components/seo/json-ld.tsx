import React from 'react';

type Props = {
    data: Record<string, unknown>;
};

// Renders a JSON-LD structured-data script. Content is our own serialized
// object, not user HTML, so the injection is safe.
export function JsonLd({data}: Props) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
        />
    );
}
