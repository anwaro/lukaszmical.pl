import {createServer} from 'http';

import {Server} from 'socket.io';

import {User, Users} from './users';

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
    },
});

const users = new Users();

io.on('connection', (socket) => {
    console.log('on connection', socket.id);

    io.emit('user-list', users.getAll());

    const user = users.create(socket.id);

    io.emit('user-enter', user);

    socket.on('disconnect', () => {
        console.log('on disconnect', socket.id);
        users.remove(user.id);
        io.emit('user-leave', user);
    });

    socket.on('user-move', (mouse: User['mouse']) => {
        users.update(user.id, mouse);
        io.emit('user-move', {...user, mouse});
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
