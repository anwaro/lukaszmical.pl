import {useEffect, useRef} from 'react';

import {io} from 'socket.io-client';

import {useRefState} from '@/utils/ref-state';

const client = io('http://localhost:3000', {
    autoConnect: false,
});

export type User = {
    mouse: [number, number];
    id: string;
    name: string;
    color: string;
};

const SEND_UPDATE_INTERVAL = 500;

export function useUserCursor(mouse: User['mouse']) {
    const [users, _, setUsers] = useRefState<User[]>([]);
    const [id, idRef, setId] = useRefState<string>('');
    const lastUpdate = useRef(new Date().getTime());

    useEffect(() => {
        client.on('connect', () => {
            setId(`${client.id}`);
        });

        client.once('user-list', (users: User[]) => {
            console.log(users);
            setUsers(users);
        });

        client.on('user-move', (user: User) => {
            setUsers((users) => {
                if (users.find((u) => user.id == u.id)) {
                    return users.map((u) => (user.id == u.id ? user : u));
                }
                if (user.id !== idRef.current) {
                    return [...users, user];
                }
                return users;
            });
        });

        client.on('user-enter', (user: User) => {
            if (user.id !== idRef.current) {
                setUsers((users) => [...users, user]);
            }
        });

        client.on('user-leave', (user: User) => {
            setUsers((users) => users.filter((u) => user.id !== u.id));
        });

        client.connect();
        return () => {
            client.off('user-move');
            client.off('user-leave');
            client.off('user-enter');
            client.disconnect();
        };
    }, []);

    useEffect(() => {
        const now = new Date().getTime();
        if (now - lastUpdate.current > SEND_UPDATE_INTERVAL) {
            lastUpdate.current = now;
            client.emit('user-move', mouse);
        }
    }, [mouse]);

    return {users, id};
}
