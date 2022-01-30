var https = require('https'),
  http = require('http')

module.exports = class {
  constructor(con) {
    return function(ctx) {
      var requestProtocol = ctx.url.startsWith('https') ? https : http
      var requestMain = requestProtocol.request(ctx.url.replace(/pLocation/gi, 'location'), ctx.options, response => {
        let pData = []
        let sendData = ''
        response.on('data', (data) => {pData.push(data)}).on('end', () => {
          ctx.arrayData = pData
          ctx.httpResponse = response
          return ctx.respond(ctx)
        })
      }).on('error', err => ctx.response.end('Error: '+err))
      if (!ctx.response.writableEnded) {
        ctx.req.on('data', (data) => requestMain.write(data)).on('end', () => requestMain.end())
      } else {
        requestMain.end()
      }
    }
  }
}