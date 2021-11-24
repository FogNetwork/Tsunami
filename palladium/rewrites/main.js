const mime = require('mime')
const url = require('url')


module.exports = class Main {
  constructor(ctx) {
    var newctx = ctx.req.url.replace(ctx.prefix, '/').replace(/\/_(.*)\/(.*)/, (m, p1, p2) => {return [p1, ctx.encoding.decode(p2)]}).split(',')
    ctx.url = newctx[1]
    var contentt;
    switch(newctx[0]) {
      case "js":
        ctx.response.headers = {'content-type': 'application/javascript; charset=UTF-8'}
        break;
      case "css":
        ctx.response.headers = {'content-type': 'text/css; charset=UTF-8'}
        break;
      case "xhr":
        break;
      case "img":
        ctx.response.headers = {'content-type': mime.lookup(rurl.parse(req.url, true).pathname)}
        break;
    }
    return new ctx.makeRequest(ctx)
  }
}