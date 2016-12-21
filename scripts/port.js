"use strict";

const jimp = require('jimp');
const jsQR = require("jsqr");
const _ = require('lodash');
const debug = require('debug')('fingerprint');

let originImage = null;
let binarizedImage = [];
let width = null;
let height = null;

// вызов процедуры скелетизации, на входе список списков(после бинаризации)
async function tmpDelete() {
    let count = 1;
    // повторять пока удалялся хотя бы один пиксель
    let test = 0;
    while (count != 0) {
        count = await deleteMainTemplatePixel('main');
        if (count) await deleteMainTemplatePixel('noise');
        test++;
    }
    debug("Thinning repeats: " + test);
}

// удаление пикселя по основному или шумовому набору набору, возврат кол-ва удаленных
async function deleteMainTemplatePixel (type) {
    let count = 0;
    for (let i = 1; i < (width - 1); i++){
        for (let j = 1; j < (height - 1); j++) {
            // пиксель посредине черный
            if (binarizedImage[j][i] == false){
                if (await deletable(i, j, type)) {
                    binarizedImage[j][i] = true;
                    count += 1;
                }
            }
        }
    }
    return await count;
}

// определение принадлежности 3*3 к шумам
async function fringe(a) {
    let t = [
        [true,true,true,true,false,true,true,true,true],

        [true,true,true,true,false,true,true,false,false],
        [true,true,true,false,false,true,false,true,true],
        [false,false,true,true,false,true,true,true,true],
        [true,true,false,true,false,false,true,true,true],

        [true,true,true,true,false,true,false,false,true],
        [false,true,true,false,false,true,true,true,true],
        [true,false,false,true,false,true,true,true,true],
        [true,true,true,true,false,false,true,true,false],

        [true,true,true,true,false,true,false,false,false],
        [false,true,true,false,false,true,false,true,true],
        [false,false,false,true,false,true,true,true,true],
        [true,true,false,true,false,false,true,true,false]
    ];

    for (let i in t) if (_.isEqual(a, t[i])) return true;
}

// определение принадлежности 3*3 к основным шаблонам
async function check(a){
    let t123457=[true,true,false,false,true,false];
    let t013457=[true,true,true,false,false,false];
    let t134567=[false,true,false,false,true,true];
    let t134578=[false,false,false,true,true,true];
    let t0123457=[true,true,true,false,false,false,false];
    let t0134567=[true,false,true,false,false,true,false];
    let t1345678=[false,false,false,false,true,true,true];
    let t1234578=[false,true,false,false,true,false,true];

    if (_.isEqual([a[1],a[2],a[3],a[4],a[5],a[7]], t123457)) return true;
    else if (_.isEqual([a[0],a[1],a[3],a[4],a[5],a[7]], t013457)) return true;
    else if (_.isEqual([a[1],a[3],a[4],a[5],a[6],a[7]], t134567)) return true;
    else if (_.isEqual([a[1],a[3],a[4],a[5],a[7],a[8]], t134578)) return true;
    else if (_.isEqual([a[0],a[1],a[2],a[3],a[4],a[5],a[7]], t0123457)) return true;
    else if (_.isEqual([a[1],a[3],a[4],a[5],a[6],a[7],a[8]], t1345678)) return true;
    else if (_.isEqual([a[0],a[1],a[3],a[4],a[5],a[6],a[7]], t0134567)) return true;
    else if (_.isEqual([a[1],a[2],a[3],a[4],a[5],a[7],a[8]], t1234578)) return true;
    return false;
}

// получение 3*3, передача на проверку для осн.
async function deletable (x, y, param='main'){
    let a=[];
    for (let i = y-1; i < y+2; i++){
        for (let j = x-1; j < x+2; j++){
            a.push(binarizedImage[i][j]);
        }
    }
    if (param == 'main') return await check(a);
    else if (param == 'noise') return await fringe(a);
}

// подсчет количества черных в окрестности
async function checkThisPoint(x, y) {
    let c = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (binarizedImage[i][j] == true) c += 1;
        }
    }
    return await (c - 1); //Будет минимум 1 вхождение - центр.
}

// формирование списков точек ветвления и конечных
async function findCheckPoint() {
    let branchPoint = [];
    let endPoint = [];
    let t;
    for (let i = 1; i < (height - 1); i++) {
        for (let j = 1; j < (width -1); j++) {
            if (binarizedImage[i][j] == true) {
                t = await checkThisPoint(i, j);
                // console.log("Coordinates", t, i, j);
                // x => j, y => i;
                if (t >= 1 && t<=2) endPoint.push([j, i]);
                else if (t >= 3 && t<=4) branchPoint.push([j, i]);
            }
        }
    }
    return await {
        branchPoints: branchPoint,
        endPoints: endPoint
    };
}

// // возвращает список элементов, у которых нет одинакового в другом  списке
// async function removeDouble(x,y){
//     let z = [];
//     let i;
//     let j;
//     let c;
//     for (i in x) {
//         c = true;
//         for (let j in y) {
//             console.log('doublee1', i, j, x, y);
//             if (i == j) c = false;
//         }
//         if (c) z.push(i);
//     }
//     for (i in y) {
//         c = true;
//         for (j in x) {
//             console.log('doublee2', i, j, x, y);
//             if (i == j) c = false;
//         }
//         if (c) z.push(i);
//     }
//     return await z;
// }
//
// // на входе кортеж (ветвление, конечные)
// async function delNoisePoint(r){
//     let tmp = [];
//     let tmp2 = [];
//     let i;
//     let j;
//     for (i in r.endPoint){
//         for (j in r.branchPoint) {
//             // console.log('noise', i, j);
//             if (j[0] >= i[0]-5 && j[0] < i[0]+5 && j[1] >= i[1]-5 && j[1] < i[1]+5) {
//                 tmp.push(i);
//                 tmp2.push(j);
//             }
//         }
//     }
//     return {
//         branchPoint: await removeDouble(r.branchPoint, tmp2),
//         endPoint: await removeDouble(r.endPoint, tmp)
//     };
// }

exports.transform = async (img, exitName) => {
    debug('Open image' + img);
    let image = await jimp.read(img);
    // Замылим изображение, чтобы отсеят шумы
    image = await image.gaussian(2);
    debug('Image opened');
    originImage = image.bitmap.data;
    width = image.bitmap.width;
    height = image.bitmap.height;
    if(width > 12 && height > 12) {
        let binary = await jsQR.binarizeImage(originImage, width, height).data;
        await binary.forEach((pixel, index) => {
            let row = parseInt(index / width);
            if (typeof(binarizedImage[row]) == "undefined") binarizedImage[row] = [];
            let col = index % width;
            binarizedImage[row][col] = pixel;
        });
        debug('Image binarized and transformed to 2d array');
        await tmpDelete();
        debug('Image skeleton created');
        let checkpoints = await findCheckPoint();
        debug('checkPoints and endPoints founded');
        // let deleteNoise = await delNoisePoint(checkpoints);
        debug("White pixels start");
        let data_u32 = await new Uint32Array(image.bitmap.data.buffer);
        let imageData = [];

        // Pass Purple pixels
        debug("Purple pixels start");
        await checkpoints.branchPoints.forEach( (point) => {
            binarizedImage[point[1]][point[0]] = 100;
            binarizedImage[point[1]-1][point[0]-1] = 100;
            binarizedImage[point[1]-1][point[0]+1] = 100;
            binarizedImage[point[1]+1][point[0]-1] = 100;
            binarizedImage[point[1]+1][point[0]+1] = 100;
        });
        debug("Purple pixels complete");
        // Pass Green pixels
        debug("Green pixels start");
        await checkpoints.endPoints.forEach( (point) => {
            binarizedImage[point[1]][point[0]] = 200;
            binarizedImage[point[1]-1][point[0]-1] = 200;
            binarizedImage[point[1]-1][point[0]+1] = 200;
            binarizedImage[point[1]+1][point[0]-1] = 200;
            binarizedImage[point[1]+1][point[0]+1] = 200;
        });
        debug("Green pixels complete");

        await binarizedImage.forEach(async (col) => {
            await col.forEach((row) => {
                imageData.push(row == 0 ? 255 : row);
            });
        });

        let alpha = (0xff << 24);
        let pix = 0;
        let i = width * height;
        while (--i >= 0) {
            pix = imageData[i];
            // console.log(pix, i);
            if (pix == 100) data_u32[i] = -1231231;
            else if (pix == 200) data_u32[i] = -8665791;
            else {
                if (pix === true) pix = 0;
                data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
            }
        }
        debug("White pixels complete");
        // image.bitmap.data.buffer = binarizedImage;
        image.write(exitName, (err) => {
            if(!err) console.log("Image save successful");
        });
        return checkpoints;
    } else console.error("Too small image for jsQR library");
};

exports.pointsMatching = async (first, second) => {
    const size = 20;
    let match = 0;
    let i;
    let j;
    for (i in first.branchPoints){
        for(j in second.branchPoints){
            if ((j[0] >= i[0]-size || j[0] < i[0]+size) && (j[1] >= i[1]-size || j[1] < i[1]+size)) {
                match += 1;
                break;
            }
        }
    }
    for (i in first.endPoints){
        for(j in second.endPoints){
            if ((j[0] >= i[0]-size || j[0] < i[0]+size) && (j[1] >= i[1]-size || j[1] < i[1]+size)) {
                match += 1;
                break;
            }
        }
    }
    return await match;
};