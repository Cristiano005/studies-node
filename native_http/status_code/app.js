import http from 'http'

// const webServer = http.createServer((req, res) => {
//     res.statusCode = 400
//     res.end()
// })

// or

const webServer = http.createServer((req, res) => {

    req.headers = {
        "content-type": "application/json"
    }

    const bodyChunks = []

    req.on('data', (chunk) => {
        bodyChunks.push(chunk)
    })

    res.writeHead(201)
    res.end(Buffer.concat(bodyChunks))
})

webServer.listen(3000)