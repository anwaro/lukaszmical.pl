import {randomAnimal} from './animals';
import {randomColor} from './color';

export type User = {
    mouse: [number, number];
    id: string;
    name: string;
    color: string;
};

export class Users {
    private users: User[] = [];

    create(id: string): User {
        const user: User = {
            id: id,
            name: randomAnimal(),
            color: randomColor(),
            mouse: [0, 0],
        };

        this.users.push(user);
        return user;
    }

    getAll(): User[] {
        return this.users;
    }

    remove(id: string) {
        this.users = this.users.filter((u) => u.id !== id);
    }

    update(id: string, mouse: User['mouse']) {
        this.users = this.users.map((u) => (u.id !== id ? u : {...u, mouse: mouse}));
    }
}
