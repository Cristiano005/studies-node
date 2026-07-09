const fileSystem = require('fs')
const { Transform } = require('stream')

// Importa Classe 'Transform', que é um recurso de stream e que permite transformar dados passados pelo writable para readable. 

const customOutput = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toUpperCase()) // Pode ser toString caso não seja passado 'encoding: utf8' no readable.
        callback()
        // Função que avisa que o chunk/dado atual terminou de ser processado, pode seguir para o próximo.
    },
    decodeStrings: false // diz pro writable do transform que não é pra reconverter de buffer pra string!
})

const readable = fileSystem.createReadStream('./input.txt', {
    encoding: 'utf8'
})
const writable = fileSystem.createWriteStream('./custom_output.txt')

readable.pipe(customOutput).pipe(writable)