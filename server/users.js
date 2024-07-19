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
exports.Users = void 0;
var animals_1 = require("./animals");
var color_1 = require("./color");
var Users = /** @class */ (function () {
    function Users() {
        this.users = [];
    }
    Users.prototype.create = function (id) {
        var user = {
            id: id,
            name: (0, animals_1.randomAnimal)(),
            color: (0, color_1.randomColor)(),
            mouse: [0, 0],
        };
        this.users.push(user);
        return user;
    };
    Users.prototype.getAll = function () {
        return this.users;
    };
    Users.prototype.remove = function (id) {
        this.users = this.users.filter(function (u) { return u.id !== id; });
    };
    Users.prototype.update = function (id, mouse) {
        this.users = this.users.map(function (u) { return (u.id !== id ? u : __assign(__assign({}, u), { mouse: mouse })); });
    };
    return Users;
}());
exports.Users = Users;
