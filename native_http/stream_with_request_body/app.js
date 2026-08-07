import http from 'http'

const webServer = http.createServer((req, res) => {

    const bodyStream = []

    req.on('data', (chunk) => {
        bodyStream.push(chunk)
    })

    req.on('end', () => {

        console.log(bodyStream)

        // como req trabalha com stream com os dados vindo do cliente, ele processa em pedaços os dados da requisição
        // evitando sobrecarregamento

        const bufferData = Buffer.concat(bodyStream)
        const requestBody = JSON.parse(bufferData)

        console.log('Request Body :>> ', requestBody);
        res.end('All good!');
    })
})

webServer.listen(3000)