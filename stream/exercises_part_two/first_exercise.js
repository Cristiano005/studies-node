const fileSystem = require('fs') // lib do node embutida para trabalhar com gerenciamento de arquivos, incluindo com stream ou não.
const writeInFile = fileSystem.createWriteStream('./random_numbers.txt')
const total = 1000 * 2000

let increment = 1
let countBackpressure = 0

function writeLinesInFile() {

    let isNotArrivedAtBackpressure = true

    while (increment <= total && isNotArrivedAtBackpressure) {

        increment++

        const getRandomIntNumber = Math.floor(Math.random() * 1000)
        isNotArrivedAtBackpressure = writeInFile.write(`${getRandomIntNumber}\n`)

        if (!isNotArrivedAtBackpressure) {
            countBackpressure++
        }
    }

    if (increment < total) writeInFile.once('drain', writeLinesInFile)

    else writeInFile.end(`Escrita encerrada! Backpressure ocorreu ${countBackpressure}`)
}

writeLinesInFile()