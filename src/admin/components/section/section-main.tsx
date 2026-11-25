import React, {ReactNode} from 'react';

type Props = {
    children: ReactNode;
};

// The content column of an admin page (up to size-content-max).
export default function SectionMain({children}: Props) {
    return <main className="kv-main">{children}</main>;
}
