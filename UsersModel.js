'use strict';

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;

let UsersSchema = new Schema({
    username: {type: String, unique: true},
    image: {type: {
        _id: false,
        buffer: {type: String, data: Buffer},
        width: {type: Number},
        height: {type: Number}
    }, select: false},
    endPoints: {type: Schema.Types.Mixed},
    branchPoints: {type: Schema.Types.Mixed},
    __v: false
}, {
    collection: "Users"
});

module.exports = mongoose.model("UsersModel", UsersSchema);