
// mdLinks('example.md')
// .then(resolve =>{
//   console.log(resolve);
// }).catch(err=> console.log(err));



// console.log('hola mundo');

// var fs = require('fs');
// var readMe = fs.readFileSync('example.md','utf8');
// console.log(readMe);

////

var routeExample = './README.md';
var directory = '../LIM018-md-links'

// importa el path modulos
const path = require("node:path");

//Importa el file system modulo
const fs = require("fs");

const { default: axios } = require("axios");

//Verifica si la ruta existe (true / false)
const existsPath = (route) => fs.existsSync(route);
//console.log('Ruta existe:', existsPath(routeExample))

//Valida si la es ruta es absoluta (true / false)
const absolutePath = (route) => path.isAbsolute(route);
//console.log('La ruta es absoluta:', absolutePath(routeExample))

//Convirte la ruta de relativa a absoluta
const convertPath = (route) =>
    absolutePath(route) ? route : path.resolve(route);
//console.log('Convierte a ruta absoluta:', convertPath(routeExample))

//Valida si la ruta es una carpeta (true / false)
const folderPath = (route) => fs.statSync(route).isDirectory();
//console.log('La ruta es una carpeta:', folderPath(directory))

//Recorre directorio
const readDirectory = (route) => fs.readdirSync(route, "utf-8");
//console.log('Lee directorio:', readDirectory(directory))

//Valida existencia de archivos con extensión .md (true / false)
const extMdFile = (route) => path.extname(route) === ".md";
//console.log('Hay archivos con extensión .md:', extMdFile(routeExample))

//Lectura la ruta
const getMdFiles = (currentRoute) => {
    let arrayMdFiles = [];
    if (folderPath(currentRoute)) { //Si es directorio entra aquí

        readDirectory(currentRoute).forEach(elem => {
            let joinRoute = path.join(currentRoute, elem);
            arrayMdFiles = arrayMdFiles.concat(getMdFiles(joinRoute)); // Aplica recursividad
        });
    } else { //Si no es directorio, es archivo y entra acá
        if (extMdFile(currentRoute)) {
            arrayMdFiles.push(currentRoute);
        }
    }
    return arrayMdFiles;
}
//console.log('Lee la ruta:', getMdFiles(routeExample))


//Lectura de archivo .md
const readMdFiles = (MDfile) => {
    return new Promise((resolve, reject) => {
        fs.readFile(MDfile, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    route: MDfile,
                    fileContent: data,
                });
            }
        });
    });
};

//readMdFiles(routeExample).then(val => console.log('Lectura de archivo .md:', (val)))


//Extrayendo URL´s del archivo .md
const getLinksMdFiles = (routeMDfile) =>
    new Promise((resolve, reject) => {
        const regExp = /\[(.*?)\]\(.*?\)/gm;
        const regUrl = /\(.*?\)/gm;
        const regText = /\[(.*?)\]/gm;
        let arrayLinksConvert = [];

        readMdFiles(routeMDfile)
            .then((fileContent) => {
                const arrayLinks = fileContent.fileContent.match(regExp);

                if (arrayLinks === null) {
                    resolve([]);
                }

                arrayLinks.forEach((objLinks) => {
                    const objhref = objLinks.match(regUrl).join().slice(1, -1);
                    const objtext = objLinks.match(regText).join().slice(1, -1);
                    arrayLinksConvert.push({
                        href: objhref, //URL encontrada
                        text: objtext.substring(0, 50), //Texto que aparecía dentro del link (<a>).
                        file: path.basename(routeMDfile), //Ruta del archivo donde se encontró el link.
                    });
                });
                resolve(arrayLinksConvert);
                return arrayLinksConvert;
            })
            .catch((err) => {
                reject(err);
            });
    });

//getLinksMdFiles(routeExample).then(val => console.log('Extrayendo URL del archivo .md', (val)))



//Extrayendo información de cada link encontrado en archivo .md
const getObjetsLinks = (routes) => {
    const promises = routes.map(elem => {
        return getLinksMdFiles(elem).then((arrayLinksConvert) => {
            return Promise.all(
                arrayLinksConvert.map((object) => {
                    return axios
                        .get(object.href)
                        .then((result) => {
                            return {
                                href: object.href,
                                text: object.text,
                                file: object.file,
                                status: result.status,
                                message: "Ok",
                            };
                        })
                        .catch((error) => {
                            return {
                                href: object.href,
                                text: object.text,
                                file: object.file,
                                status: 404,
                                message: "Fail",
                            };
                        });
                })
            );
        });
    })
    return Promise.all(promises)
}
//console.log('Extrayendo información de cada link ',getObjetsLinks(routeExample))

//getObjetsLinks(routeExample).then(val => console.log('Extrayendo información de cada link', (val)))



const getTotalLinks = (arrayLinks) => {
    const links = arrayLinks.map((item) => item.href);
    const unique = links.filter(function (item, index, arrayLinks) {
        return arrayLinks.indexOf(item) === index;
    })
    return (`Total: ${links.length} \nUnique: ${unique.length}`);
}

const broken = (arrayLinks) => {
    const codeStatus = arrayLinks.filter((item) => item.status >= 400);
    return (`\nBroken: ${codeStatus.length}`);
}

// console.log('Extrayendo', getTotalLinks(routeExample))
// console.log('Extrayendo', broken(routeExample))







 //Función que retorna el total de links y links únicos
// const getTotalLinks = (arraylinks) => {
//     let totalLinks = 0;
//     let uniqueLinks = [];
//     arraylinks.forEach(arr => {
//         totalLinks += arr.length;
//         uniqueLinks = uniqueLinks.concat(arr)
//     })
//     uniqueLinks = new Set(uniqueLinks.map((element) => element.href)); // crear una colección de links únicos(no se repiten);
//     const stats = `${('Total :')} ${(totalLinks)}\n${('Unique :')} ${(uniqueLinks.size)}`;
//     console.log(stats);
// }

// //Función que verifica si hay algun link roto
// const broken = (arraylinks) => {
//     let broken = [];
//     arraylinks.forEach(arr => {
//         broken = broken.concat(arr.filter(elem => elem.message === 'Fail'));
//     })
//     const stats = `${('Broken :')} ${(broken.length)}`;
//     console.log(stats);
// }
// console.log('Extrayendo:', getTotalLinks(routeExample))
// //console.log('Extrayendo:', broken(routeExample))

module.exports = {
    existsPath,
    getMdFiles,
    readMdFiles,
    getLinksMdFiles,
    getObjetsLinks,
    absolutePath,
    extMdFile,
    convertPath,
    getTotalLinks,
    broken
};