"use strict";

const path = require('path');
const port = require('./port');
const chokidar = require('chokidar');

let workingPath = path.join(__dirname, '..', 'new', '*.bmp');

chokidar.watch(workingPath).on('add', async (filename, props) => {
    let points = await port.transform(filename, filename);
    console.log(filename, points);
});


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