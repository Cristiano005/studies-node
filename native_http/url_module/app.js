import http from 'http'
import url from 'url'

const webServer = http.createServer((request, response) => {
    const urlData = url.parse(request.url, true)
    console.log(urlData.query.page)
})

webServer.listen(3000, () => {
    console.log('here')
})