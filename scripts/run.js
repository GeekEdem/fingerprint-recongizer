"use strict";

const path = require('path');
const port = require('./port');

const dirPath = path.join(__dirname, '..', 'tests');

const fileName = 'r1.bmp';
const filePath = path.join(dirPath, fileName);

port.transform(filePath, fileName, (err, result) => {
    console.log(err, result);
});
