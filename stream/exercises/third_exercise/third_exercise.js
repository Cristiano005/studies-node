const fileSystem = require('fs')
const readable = fileSystem.createReadStream('./input.txt')
const writable = fileSystem.createWriteStream('./output.txt')

readable.pipe(writable)

/*
    Answer: pipe() implementa flow control automaticamente: ele escuta o retorno de .write() (o "sinal de controle") e, quando esse sinal indica que a Writable está sobrecarregada, ele pausa a Readable sozinho — retomando só quando a Writable avisa (drain) que está pronta pra receber mais.
*/