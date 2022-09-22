#!/usr/bin/env node

const mdLinks = require('../src/md-links.js')
const [,, ...args ]= process.argv;
console.log(`hola ${args}`)
const {
     getTotalLinks,
     broken
} = require("../src/index.js");

var routeExample = './README.md';
//var directory = '../LIM018-md-links'


//Opciones API
const readOptions = () => {
    let options = { validate: false };
    if (args.length > 3) {
        if (args.includes('--validate') || argv.includes('--v')) {
            options.validate = true
        } else {
            options = {};
        }
    }
    return options;
}


mdLinks.mdLinks(args[2], readOptions())
    .then((res) => {
        if (args.includes('--stats') || args.includes('--s')) {
            getTotalLinks(res);
            if ((args.includes('--validate') || args.includes('--v'))) {
                broken(res);
            }
        } else if (args.includes('--validate') || args.includes('--v')) {
            res.forEach(arr => {
                arr.forEach(e => {
                    console.log((`\n${e.file} ${e.href} ${e.message} ${e.status} ${e.text}`));
                })
            })
        } else {
            res.forEach(arr => {
                arr.forEach(e => {
                    console.log((`\n${e.file} ${e.href} ${e.text}`));
                })
            })
        }
    })
    .catch((error) => {
        console.log('Ruta no valida', error);
    });

    args(routeExample).then(val => console.log('función mdLinks', (val)))







    