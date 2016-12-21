"use strict";

const path = require('path');
const port = require('./port');

const dirPath = path.join(__dirname, '..', 'tests');

const fileName1 = 'r1.bmp';
const fileName2 = 'r2_v2.bmp';

function createPath(name){
    return path.join(dirPath, name);
}

(async function(){
    let first = await port.transform(createPath(fileName1), fileName1);
    let second = await port.transform(createPath(fileName2), fileName2);
    let all = first.branchPoints.length + first.endPoints.length + second.branchPoints.length + second.endPoints.length;
    let match = await port.pointsMatching(first, second);
    await console.log(match/all*100);
})();