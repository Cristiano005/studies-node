import http from 'node:http'

const webServer = http.createServer((req, res) => {
    res.end(JSON.stringify(
        {
            headers: req.headers,
            method: req.method,
            url: req.url
        }
    ))
})

webServer.listen(3000, () => {
    console.log('here')
})