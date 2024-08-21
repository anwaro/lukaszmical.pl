import React, {ReactNode} from 'react';

type Props = {
    children: ReactNode;
};

export default function LayoutGuest({children}: Props) {
    return <div className="bg-slate-800 text-slate-100">{children}</div>;
}
