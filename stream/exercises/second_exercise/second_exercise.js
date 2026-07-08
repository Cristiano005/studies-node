const fileSystem = require('fs')
const file = fileSystem.createWriteStream('./output.txt')

for (let index = 1; index <= 5; index++) {
    file.write(`line ${index} \n`)
}

/* file.on('finish', () => {
    console.log('File saved successfully')
})

file.end() */

/* Ou poderia ser assim, passando a mensagem por callback já que o método end possui um event de listener 'finish' para captar o fim do arquivo */

file.end(() => console.log('File saved successfully'))

file.write('line 6\n') // Aqui não é possível pegar escrever algo a mais no arquivo após encerrar.

file.on('error', (error) => {
    console.log('Catch error: ', error)
})