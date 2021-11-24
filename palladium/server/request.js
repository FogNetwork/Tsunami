var http = require('http');
var https = require('https');

class makeRequest {
  constructor(ctx) {
    this.ctx = ctx;
  }
  request(ctx) {
    var reqHeaders = {}

    try {
      new URL(ctx.url)
    } catch(err) {
      try {
        ctx.url = new URL(ctx.encoding.decode(ctx.url))
      } catch(e) {
        return ctx.response.writeHead(501, {'content-type': 'text/plain'}).end('URL Parse Error')
      }
    }

    if (ctx.req.headers['cookie']) reqHeaders['cookie'] = ctx.req.headers['cookie']
    if (ctx.req.headers['referer']) reqHeaders['referer'] = ctx.req.headers['referer']
    if (ctx.req.headers['origin']) reqHeaders['origin'] = ctx.req.headers['origin']

    if (reqHeaders['origin']) {
      var newHeader = ctx.headersURL(`/${ctx.req.headers['origin'].split('/').splice(3).join('/')}`.replace(ctx.prefix, ''), true);
      if (newHeader.startsWith('https://') || newHeader.startsWith('http://')) newHeader = newHeader.split('/').splice(0, 3).join('/');
      else newHeader = ctx.url;
      reqHeaders['origin'] = newHeader;
    }

    if (reqHeaders['referer']) {
      var proxified_header = ctx.headersURL(`/${ctx.req.headers['referer'].split('/').splice(3).join('/')}`.replace(ctx.prefix, ''), true);
      if (proxified_header.startsWith('https://') || proxified_header.startsWith('http://')) proxified_header = proxified_header;
      else proxified_header = ctx.url;
      reqHeaders['referer'] = proxified_header;
    }

    var protocol = (ctx.req.url.startsWith('https') ? https : http)
    ctx.requestRequest = https.request(ctx.encoding.decode(ctx.url), {method: ctx.req.method, headers: reqHeaders}, response => {
      let pData = []
      let sendData = ''
      ctx.requestResponse = response
      response.on('data', (data) => {pData.push(data)}).on('end', () => {
        Object.entries(response.headers).forEach(([header_name, header_value]) => {
          if (header_name == 'set-cookie') {
            const cookie_array = [];
            header_value.forEach(cookie => cookie_array.push(cookie.replace(/Domain=(.*?);/gi, `Domain=` + req.headers['host'] + ';').replace(/(.*?)=(.*?);/, '$1' + '@' + proxy.spliceURL.hostname + `=` + '$2' + ';')));
            ctx.requestResponse.headers[header_name] = cookie_array;
          };
  
          if (header_name.startsWith('content-encoding') || header_name.startsWith('x-') || header_name.startsWith('cf-') || header_name.startsWith('strict-transport-security') || header_name.startsWith('content-security-policy') || header_name.startsWith('content-length')) delete ctx.requestResponse.headers[header_name];
  
          if (header_name == 'location') ctx.requestResponse.headers[header_name] = new ctx.rewrite.Base(ctx).url(header_value);
          if (header_name == 'refresh') {
            var refreshLocation = ctx.requestResponse.headers[header_name].split(';')[1]
            var refreshContent = ctx.requestResponse.headers[header_name].split(';')[0]
            new ctx.rewrite.Base(ctx).url(refreshLocation)
            ctx.requestResponse.headers[header_name] = refreshContent+';'+refreshLocation
          }
        });
        var data = Buffer.concat(pData)
        if (response.headers['content-type'] && response.headers['content-type'].startsWith('text/html')) {
          data = new ctx.rewrite.HTMLRewriter(ctx).HTML(data)
        } else if (response.headers['content-type'] && response.headers['content-type'].startsWith('text/css')) {
          data = new ctx.rewrite.CSSRewriter(ctx).CSS(data)
        } else if (response.headers['content-type'] && response.headers['content-type'].startsWith('aplication/js')) {
          data = new ctx.rewrite.JSRewriter(ctx).JS(data)
        }
        ctx.response.writeHead(response.statusCode, response.headers).end(data || 'Unknown Error')
      })
    }).on('error', err => res.end(fs.readFileSync('./lib/err.html', 'utf-8').replace('err_reason', err))).end()
    if (ctx.response.writableEnded) {
      ctx.req.on('data', (data) => ctx.requestRequest.write(data)).on('end', () => ctx.requestRequest.end())
    }
  }
}

module.exports = makeRequest