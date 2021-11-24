var fs = require('fs')
var http = require('http');
var https = require('https');

module.exports = function Smoke(req, res, ctx) {
  Object.assign(this, ctx)
  var proxy = {host: (this.getRequestUrl(req).replace(/(https:\/\/|http:\/\/|\/$)/g, '')).split('/')[0],path: (this.getRequestUrl(req)).split('/')[(this.getRequestUrl(req)).split('/').length - 1],url: this.getRequestUrl(req),docTitle: this.config.docTitle}

  /*if (ctx.url.match(/https:\/\/(www|)\.youtube\.com\/watch\?v=[a-z1-9A-Z](.*)\//g)) {
    return res.writeHead(301, {location: ctx.prefix+'gateway?url='+ctx.url}).end('')
  }*/

  proxy.options = {
    headers: {},
    method: req.method,
  };

  if (req.headers['referer']) proxy.options.headers['referer'] = /*ctx.headers.referer(*/req.headers['referer']//)

  if (req.headers['origin']) proxy.options.headers['origin'] = /*ctx.headers.origin(*/req.headers['origin']//, ctx.url)
  if (req.headers['user-agent']) proxy.options.headers['user-agent'] = req.headers['user-agent']

  /*if (req.headers.referer) {
    try {
      var ourl = req.url
      req.url = req.headers.referer
      req.headers.referer = new URL(ctx.getRequestUrl(req)).href;
      req.url = ourl
    } catch(err) {
      req.headers.referer = new URL(ctx.url).href;
    };
  };*/

  //if (req.headers['cookie']) proxy.options['cookie'] = req.headers['cookie']

  try {new URL(proxy.url)} catch(err) {return res.end('Invalid URL: '+proxy.url+', '+err)}

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

  var requestProtocol = proxy.url.startsWith('https:/') ? https : http

  if (ctx.url.endsWith(',jq.oar')) {
    ctx.url = ctx.url.replace(ctx.url.split('/')[ctx.url.split('/').length - 1], '').replace(/\/$/, '')
  }

  if(ctx.url.endsWith('.asq.oar')) {
    ctx.url = ctx.url.split('-')[0]
  }

  /*if (req.url.endsWith('/')) {
    return res.writeHead(301, {location: req.url.replace(/\/$/g, '')}).end('')
  }*/

  var requestMain = requestProtocol.request(ctx.url, proxy.options, response => {
    let pData = []
    let sendData = ''
    response.on('data', (data) => {pData.push(data)}).on('end', () => {

      Object.entries(response.headers).forEach(([header_name, header_value]) => {
          if (header_name == 'set-cookie') {
              const cookie_array = [];
              header_value.forEach(cookie => cookie_array.push(cookie.replace(/Domain=(.*?);/gi, `Domain=` + req.headers['host'] + ';').replace(/(.*?)=(.*?);/, '$1' + '@' + proxy.spliceURL.hostname + `=` + '$2' + ';')));
              response.headers[header_name] = cookie_array;
  
          };
  
          if (header_name.startsWith('content-encoding') || header_name.startsWith('x-') || header_name.startsWith('cf-') || header_name.startsWith('strict-transport-security') || header_name.startsWith('content-security-policy') || header_name.startsWith('content-length')) delete response.headers[header_name];
  
          if (header_name == 'location') response.headers[header_name] = new ctx.rewrite.Base(ctx).url(header_value)
      });

      sendData = Buffer.concat(pData)

      if (response.headers['content-type']) {
        if (response.headers['content-type'].startsWith('text/html')) {
          sendData = ctx.rewrite.HTMLRewriter(sendData.toString('utf-8'), ctx)
        } else if (response.headers['content-type'].startsWith('application/javascript')) {
          sendData = ctx.rewrite.JSRewriter(sendData.toString('utf-8'), ctx)
        } else if (response.headers['content-type'].startsWith('text/css')) {
          sendData = ctx.rewrite.CSSRewriter(sendData.toString('utf-8'), ctx)
        }
      }

      //if (sendData.includes('myScript')) fs.writeFileSync('./lib/client/discord-fix.js', sendData)

      if(response.headers['content-type'] && response.headers['content-type'].match(/text\/html\s*$/g)) {
        response.headers['content-type'] += '; charset=UTF-8'
      }

      if (req.method==='POST') delete response.headers['content-type']

      res.writeHead(response.statusCode, response.headers).end(sendData)
    })
  }).on('error', err => res.end('Error: '+err))
  if (!res.writableEnded) {
    req.on('data', (data) => requestMain.write(data)).on('end', () => requestMain.end())
  } else {
    requestMain.end()
  }
}