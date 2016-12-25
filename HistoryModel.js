'use strict';

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;

let HistorySchema = new Schema({
    image: {type: {
        _id: false,
        buffer: {type: String, data: Buffer},
        width: {type: Number},
        height: {type: Number}
    }, select: false},
    endPoints: {type: Schema.Types.Mixed},
    branchPoints: {type: Schema.Types.Mixed},
    match: {type: [{
        _id: false,
        username: {type: Schema.ObjectId, ref: "UsersModel"},
        match: {type: Number}
    }]},
    __v: false
}, {
    collection: "History"
});

module.exports = mongoose.model("HistoryModel", HistorySchema);