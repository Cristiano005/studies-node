const fileSystem = require('fs')

const readStream = fileSystem.createReadStream('./input.txt')

/* const readStream = fileSystem.createReadStream('./input.txt', {
    highWaterMark: 98 * 1024 // valores em KB
}) */

readStream.on('data', (chunk) => {
    console.log(chunk.length)
})

readStream.on('end', () => {
    console.log('Arrived at final of file')
})

// Bacana! O tamanho do arquivo é de 99KB e com o highWaterMark definido para um acumulo de 64KB por default, 
// ele acumulou no "balde" e o resto que sobrou encheu mais um, ficando assim duas chunks.

// Posso se quiser definir um novo teto para esse highWaterMark.