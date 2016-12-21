'use strict';

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;

let UsersSchema = new Schema({
    username: {type: String, unique: true},
    fingerImage: {type: String, data: Buffer},
    endPoints: {type: [Number]},
    branchPoints: {type: [Number]}
}, {
    collection: "Users"
});

module.exports = mongoose.model("UsersModel", UsersSchema);