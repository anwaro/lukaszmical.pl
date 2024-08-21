/* eslint-disable @next/next/no-img-element */
// Why disabled:
// avatars.dicebear.com provides svg avatars
// next/image needs dangerouslyAllowSVG option for that

import React, {ReactNode} from 'react';

type Props = {
    username: string;
    className?: string;
    children?: ReactNode;
};

export function UserAvatar({username, className = '', children}: Props) {
    const avatarImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.replace(
        /[^a-z0-9]+/gi,
        '-',
    )}`;

    return (
        <div className={className}>
            <img
                src={avatarImage}
                alt={username}
                className="block h-auto w-full max-w-full rounded-full bg-slate-800"
            />
            {children}
        </div>
    );
}
