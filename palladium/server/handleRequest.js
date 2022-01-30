var fs = require('fs')
var http = require('http');
var https = require('https');

module.exports = function Request(req, res, ctx) {

  //req.headers['user-agent']=='googlebot' && return(res.writeHead(403).end('Unauthorized'))

  ctx.requestMiddlewares.forEach((func) => {
    var octx = ctx
    try {ctx = eval(func)(ctx);if(!ctx)ctx=octx;} catch(err) {ctx=octx;console.log('Request Middleware Error: '+err)}
  })

  Object.assign(this, ctx)
  var proxy = {host: (this.getRequestUrl(req).replace(/(https:\/\/|http:\/\/|\/$)/g, '')).split('/')[0],path: (this.getRequestUrl(req)).split('/')[(this.getRequestUrl(req)).split('/').length - 1],url: this.getRequestUrl(req),docTitle: this.config.docTitle}

  try {new URL(ctx.url)} catch(err) {return res.end('Invalid URL: '+proxy.url+', '+err)}

  proxy.options = {
    headers: {},
    method: req.method,
  };

  if (req.headers['referer']) proxy.options.headers['referer'] = ctx.headers.referer(req.headers['referer'])

  if (req.headers['origin']) proxy.options.headers['origin'] = ctx.headers.origin(req.headers['origin'], ctx.url)
  
  if (req.headers['user-agent']) proxy.options.headers['user-agent'] = req.headers['user-agent']

  if (req.headers['authorization']) proxy.options.headers['authorization'] =req.headers['authorization']

  if (req.headers['cookie']) proxy.options.headers['cookie'] = ctx.headers.cookie(req.headers['cookie'])

  if (req.headers['accept']) proxy.options.headers['accept'] = req.headers['accept']

  if (req.headers['content-type']) proxy.options.headers['content-type'] = req.headers['content-type']

  if (req.headers['content-length']) proxy.options.headers['content-length'] = req.headers['content-length']

  if (req.headers['accept-language']) proxy.options.headers['accept-language'] = req.headers['accept-language']

  Object.entries(req.headers).forEach(([header, value]) => {
    if (header.startsWith('x-')||header.startsWith('sec-')) proxy.options.headers[header] = value
  })
  var newheaders = req.headers
  Object.entries(proxy.options.headers).forEach(([header, v]) => {
    delete newheaders[header]
  })
  delete newheaders['host']
  delete newheaders['accept-encoding']
  delete newheaders['cache-control']
  delete newheaders['upgrade-insecure-requests']
  Object.keys(newheaders).forEach(key => proxy.options.headers[key]=newheaders[key])

  if (req.headers.referer) {
    try {
      var ourl = req.url
      req.url = req.headers.referer
      req.headers.referer = new URL(ctx.getRequestUrl(req)).href;
      req.url = ourl
    } catch(err) {
      req.headers.referer = new URL(ctx.url).href;
    };
  };

  if (req.headers['cookie']) proxy.options['cookie'] = req.headers['cookie']

  if (!req.url.startsWith(ctx.prefix)) return (res.writeHead(308, { location: ctx.prefix + `${ctx.encoding.encode(new URL(proxy.url).origin.replace('https:/', 'https:'))}`}), res.end(''));

  proxy.spliceURL = new URL(proxy.url)

  var inject = {url: ctx.url,prefix: ctx.prefix,host: new URL(ctx.url).hostname}

  /*if (proxy.options.headers['cookie']) {        
    var array = [],
    newCookie = proxy.options.headers['cookie'].split('; ');
    newCookie.forEach(cookie => {
      var cname = cookie.split('=')+''
      var cvalue = cookie.split('=')+''
      if (proxy.spliceURL.hostname.includes(cookie.split('@').splice(1).join())) array.push(cname.split('@').splice(0, 1).join() + '=' + cvalue);
    });
    proxy.options.headers['cookie'] = array.join('; ');
  };*/

  if (ctx.url.endsWith(',jq.oar')) {
    ctx.url = ctx.url.replace(ctx.url.split('/')[ctx.url.split('/').length - 1], '').replace(/\/$/, '')
  }

  if(ctx.url.endsWith('.asq.oar')) {
    ctx.url = ctx.url.split('-')[0]
  }

  var requestProtocol = proxy.url.startsWith('https:/') ? https : http

  ctx.requestMiddleware.forEach((e) => {
    e(ctx)
  });

  delete proxy.options.headers['host']

  var requestMain = requestProtocol.request(ctx.url.replace(/pLocation/gi, 'location'), proxy.options, response => {
    let pData = []
    let sendData = ''
    response.on('data', (data) => {pData.push(data)}).on('end', () => {

      ctx.httpResponse = response

      Object.entries(response.headers).forEach(([header_name, header_value]) => {
          /*if (header_name == 'set-cookie') {
              const cookie_array = [];
              header_value.forEach(cookie => cookie_array.push(cookie.replace(/Domain=(.*?);/gi, `Domain=` + req.headers['host'] + ';').replace(/(.*?)=(.*?);/, '$1' + '@' + new URL(proxy.url).hostname + `=` + '$2' + ';')));
              response.headers[header_name] = cookie_array;
  
          };*/
  
          if (header_name.startsWith('content-encoding') || header_name.startsWith('x-') || header_name.startsWith('cf-') || header_name.startsWith('strict-transport-security') || header_name.startsWith('content-security-policy') || header_name.startsWith('content-length')) delete response.headers[header_name];
  
          if (header_name == 'location') response.headers[header_name] = new ctx.rewrite.Base(ctx).url(header_value)
      });

      var con = (response.headers['content-type']||'').split(';')[0]

      switch(response.headers['content-encoding']) {
          case 'gzip':
              sendData = zlib.gunzipSync(Buffer.concat(pData));
          break;
          case 'deflate':
              sendData = zlib.inflateSync(Buffer.concat(pData));
          break;
          case 'br':
              sendData = zlib.brotliDecompressSync(Buffer.concat(pData));
          break;
          default: sendData = Buffer.concat(pData); break;
      };

      if (con=='text/css') {
        sendData = ctx.rewrite.CSSRewriter(sendData.toString('utf-8'), ctx)
      } else if (response.headers['content-type']) {
        if (response.headers['content-type'].startsWith('application/javascript')) {
          sendData = ctx.rewrite.JSRewriter(sendData.toString('utf-8'), ctx)
        }
        if (response.headers['content-type'].startsWith('text/html')) {
          sendData = ctx.rewrite.HTMLRewriter(sendData.toString('utf-8'), ctx)
        }
      }

      if(response.headers['content-type'] && response.headers['content-type'].match(/text\/html\s*$/g)) {
        response.headers['content-type'] += '; charset=UTF-8'
      }

      //if (req.method==='POST') delete response.headers['content-type']

      ctx.responseMiddlewares.forEach((func) => {
        var octx = ctx
        try {ctx = eval(func)(ctx);if(!ctx)ctx=octx;} catch(err) {ctx=octx;console.log('Response Middleware Error: '+err)}
      });

      [
        'content-length',
        'content-security-policy',
        'content-security-policy-report-only',
        'strict-transport-security',
        'x-frame-options',
      ].forEach(name => delete response.headers[name]);

      response.headers['access-control-allow-origin'] = '*'

      //try {sendData = sendData.replace(/Function\.prototype\.apply\.call/gi, 'Function.prototype.call')} catch {}

      return res.writeHead(response.statusCode, response.headers).end(sendData)
    })
  }).on('error', err => res.end('Error: '+err))
  if (!res.writableEnded) {
    req.on('data', (data) => requestMain.write(data)).on('end', () => requestMain.end())
  } else {
    requestMain.end()
  }
}