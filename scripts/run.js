"use strict";

const path = require('path');
const port = require('./port');
const chokidar = require('chokidar');
const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.connect('mongodb://localhost:27017/fingers');
mongoose.Promise = Promise;

let UsersModel = require(path.join(__dirname, '..', './UsersModel'));
let HistoryModel = require(path.join(__dirname, '..', './HistoryModel'));
(async function(){
    let result = await UsersModel.findOne({username: "Yurii.Chikhrai"}).exec();

    let workingPath = path.join(__dirname, '..', 'new', '*.bmp');

    chokidar.watch(workingPath).on('add', async (filename, props) => {
        let separatorArray = filename.split(path.sep);
        let points = await port.transform(filename, separatorArray[separatorArray.length - 1], 1);
        if(!result) {
            await UsersModel.create({
                username: "Yurii.Chikhrai",
                endPoints: points.endPoints,
                branchPoints: points.branchPoints,
                image: {
                    buffer: points.buffer,
                    width: points.width,
                    height: points.height
                }
            });
            // console.log("Etalon saved success");
        } else {
            let etalons = await UsersModel.find({}).exec();
            // console.log("Etalons", etalons);
            let match = await Promise.all(etalons.map( async (etalon) => {
                // console.log("One", etalon);
                let match = await port.pointsMatching(etalon, points);
                let math = match.match/match.all*100;
                // let math = 52.51366120218579;
                console.log("MATCH with", etalon.username, ":", math);
                return {
                    username: etalon._id,
                    match: math
                };
            }));
            await HistoryModel.create({
                endPoints: points.endPoints,
                branchPoints: points.branchPoints,
                image: {
                    buffer: points.buffer,
                    width: points.width,
                    height: points.height
                },
                match: match
            });
        }
        // console.log(filename, points);
    });
})();


// const dirPath = path.join(__dirname, '..', 'tests');
//
// function createPath(name){
//     return path.join(dirPath, name);
// }
//const fileName1 = 'r2.bmp';
// const fileName2 = 'r2_v2.bmp';
// (async function(){
//     let first = await port.transform(createPath(fileName1), fileName1);
//     let second = await port.transform(createPath(fileName2), fileName2);
//     // let all = first.branchPoints.length + first.endPoints.length + second.branchPoints.length + second.endPoints.length;
//     let match = await port.pointsMatching(first, second);
//     await console.log(match, match.match/match.all*100);
// })();