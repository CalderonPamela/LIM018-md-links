//const mdLinks = require('../');


// describe('mdLinks', () => {

//   it('should...', () => {
//     console.log('FIX ME!');
//   });

// });

const { mdLinks } = require('../src/md-links.js');
const process = require('process');

const options = { validate: false, stats: false };
const route = `${process.cwd()}\\test\\folder-test\\file-test.md`;
const invalidRoute = 'test\\folder-folder\\file-test.md';
const fileWithoutLinks = 'C:\\Users\\pamel\\Desktop\\Cuarto proyecto\\LIM018-md-links\\test\\folder-test\\file-test.md';

const arrayLinksValidated = [{
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Este es un link',
    file: 'file-test2.md',
    status: 200,
    message: 'Ok'
}];


describe('mdLinks', () => {

    it('should be a function', () => {
        expect(typeof mdLinks).toBe('function');
    });
});

describe('mdLinks', () => {

    it('debe retornar promesa', () => {
        expect(mdLinks(route) instanceof Promise).toBeTruthy();
    });

    it("Debe retornar array de objetos de links validos", () =>
        mdLinks(route)
            .then((e) => {
                console.log('que debe ser E', e)
                expect(e).toEqual(arrayLinksValidated)
            })
            .catch(errr => console.log('hay un error', errr))
    )

    it('debe ser un string de ruta no valida', () =>
        mdLinks(invalidRoute).then((e) =>
            expect(e).toBe(arrayLinksValidated)
        )
            .catch(errr => console.log('hay un error 1', errr))
    )

    it("Debe retornar mensaje de que el archivo no contiene links", () => {
        mdLinks(fileWithoutLinks).catch((e) => {
            expect(e).toMatch('El archivo no contiene Links')
        });
    });
});