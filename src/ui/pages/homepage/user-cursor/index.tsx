import React from 'react';

import {clsx} from 'clsx';

import {User, useUserCursor} from './index.hook';

type Props = {
    mouse: [number, number];
};

const x = (factor: number) => factor * window.innerWidth;
const y = (factor: number) => factor * window.innerHeight;
const mouseTranslate = (m: User['mouse']) => `translate(${x(m[0])}px, ${y(m[1])}px)`;

export function HomepageUserCursor({mouse}: Props) {
    const {users, id} = useUserCursor(mouse);

    return (
        <div
            className={
                'pointer-events-none absolute left-0 top-0 h-screen w-full overflow-hidden text-xs text-white'
            }
        >
            <pre>ID {id}</pre>
            <pre>{JSON.stringify(users, null, 4)}</pre>

            {users.map((user) => (
                <div
                    key={user.id}
                    className={clsx(
                        'absolute left-0 top-0 rounded-b-full p-1',
                        'rounded-tr-full text-black transition duration-500',
                    )}
                    style={{
                        transform: mouseTranslate(user.mouse),
                        backgroundColor: user.color,
                    }}
                >
                    <div
                        className="rounded-full bg-white p-1"
                        style={{color: user.color}}
                    >
                        {user.name}
                    </div>
                </div>
            ))}
        </div>
    );
}
