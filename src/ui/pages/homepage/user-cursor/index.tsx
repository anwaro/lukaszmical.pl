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
                'absolute top-0 left-0 w-full h-[100vh] text-white text-xs overflow-hidden pointer-events-none'
            }
        >
            <pre>ID {id}</pre>
            <pre>{JSON.stringify(users, null, 4)}</pre>

            {users.map((user) => (
                <div
                    key={user.id}
                    className={clsx(
                        'absolute top-0 left-0 p-1 rounded-b-full',
                        'rounded-tr-full text-black transition duration-500',
                    )}
                    style={{
                        transform: mouseTranslate(user.mouse),
                        backgroundColor: user.color,
                    }}
                >
                    <div
                        className="p-1 bg-white rounded-full"
                        style={{color: user.color}}
                    >
                        {user.name}
                    </div>
                </div>
            ))}
        </div>
    );
}
