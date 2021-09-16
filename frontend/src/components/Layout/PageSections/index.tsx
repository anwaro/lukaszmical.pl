import React, {useMemo} from 'react';

import Section from '~components/Layout/Section';
import {PageQuery_pages, PageQuery_pages_sections} from '~types/PageQuery';

export type PageSectionsProps = {
    page: PageQuery_pages;
};

const PageSections: React.FC<PageSectionsProps> = ({page}) => {
    const sections = useMemo(() => {
        return (page?.sections || []).filter((b): b is PageQuery_pages_sections =>
            Boolean(b),
        );
    }, [page]);

    return (
        <>
            {sections.map((section) => (
                <Section key={section.id} section={section} />
            ))}
        </>
    );
};

export default PageSections;
