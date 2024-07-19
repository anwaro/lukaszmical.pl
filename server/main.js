"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var users_1 = require("./users");
var server = (0, http_1.createServer)();
var io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
    },
});
var users = new users_1.Users();
io.on('connection', function (socket) {
    console.log('on connection', socket.id);
    io.emit('user-list', users.getAll());
    var user = users.create(socket.id);
    io.emit('user-enter', user);
    socket.on('disconnect', function () {
        console.log('on disconnect', socket.id);
        users.remove(user.id);
        io.emit('user-leave', user);
    });
    socket.on('user-move', function (mouse) {
        users.update(user.id, mouse);
        io.emit('user-move', __assign(__assign({}, user), { mouse: mouse }));
    });
});
server.listen(3000, function () {
    console.log('listening on *:3000');
});
