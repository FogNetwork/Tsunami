const http = require('http'),fs = require('fs'),WebSocket = require('ws'),querystring = require('querystring'),{ JSDOM } = require('jsdom'),https = require('https'),regex = /\s+(href|src|integrity|nonce|action|srcset|data-unscoped-search-url)=['"](.*?)['"]/gi,regex2 = /\s*(location.href|location)\s+=\s+['"](.*?)['"]/g,request = require('request');

btoa = str => new Buffer.from(str).toString('base64'),
atob = str => new Buffer.from(str, 'base64').toString('utf-8')

//var { prefix, port } = require('../config.json')

const port = 8080
const prefix = "/smoke/"

if(!prefix.includes("/", 2)) {prefix = prefix.replace("/", "");prefix = "/"+prefix+"/"}

module.exports = class {
  constructor(prefix, config = {}) {
    this.prefix = prefix
    this.config = config
    this.proxyURL = (req) => {return atob(req.url.replace(prefix, ''))}
    this.headersURL = (url) => {return atob(url.replace(prefix, ''))}
  }
  request(req, res) {
    if (req.url.replace(prefix, '')==='smoke') {
      res.writeHead(200, {'content-type': 'application/javascript'})
      return res.end(fs.readFileSync('./smoke/client.js'))
    }
    var proxy = {host: (this.proxyURL(req).replace(/(https:\/\/|http:\/\/|\/$)/g, '')).split('/')[0],path: (this.proxyURL(req)).split('/')[(this.proxyURL(req)).split('/').length - 1],url: this.proxyURL(req),docTitle: this.config.docTitle}

    proxy.options = {
      headers: {},
      method: req.method || 'GET'
    };

    if (req.headers['referer']) proxy.options['referer'] = req.headers['referer']

    if (req.headers['origin']) proxy.options['origin'] = req.headers['origin']

    //if (req.headers['cookie']) proxy.options['cookie'] = req.headers['cookie']

    try {new URL(proxy.url)} catch(err) {return res.end('Invalid URL: '+proxy.url+', '+err)}

    proxy.spliceURL = new URL(proxy.url)

    var inject = {url: proxy.url,prefix: prefix,host: proxy.host}

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

    if (proxy.options.headers['origin']) {
      var newHeader = this.headersURL(`/${proxy.options.headers['origin'].split('/').splice(3).join('/')}`.replace(this.prefix, ''), true);
      if (newHeader.startsWith('https://') || newHeader.startsWith('http://')) newHeader = newHeader.split('/').splice(0, 3).join('/');
      else newHeader = proxy.url;
      proxy.options.headers['origin'] = newHeader;
    }

    if (proxy.options.headers['referer']) {
      var proxified_header = this.headersURL(`/${proxy.options.headers['referer'].split('/').splice(3).join('/')}`.replace(this.prefix, ''), true);
      if (proxified_header.startsWith('https://') || proxified_header.startsWith('http://')) proxified_header = proxified_header;
      else proxified_header = proxy.url;
      proxy.options.headers['referer'] = proxified_header;
    }

    var requestProtocol = proxy.url.startsWith('https://') ? https : http

    var requestMain = requestProtocol.request(this.proxyURL(req), proxy.options, response => {
      let pData = []
      let sendData = ''
      response.on('data', (data) => {pData.push(data)}).on('end', () => {
        var proxify = {
          url: function(url) {
            var host = proxy.host
            url = url.replace(/\/$/gi, '')
            //console.log(url)
            if (url.match(/^(about:|javascript:|#|tel:|mailto:)/g)) return url
            if (url.startsWith('http')) {
              url = prefix + btoa(url)
            } else if (url.startsWith('//')) {
              url = prefix + btoa(url.replace(/^\/{2}/gi, 'https://'))
            } else {
              url = prefix + btoa('https://' + host + '/' + url)
            }
            if (url==prefix + 'aHR0cHM6Ly9kaXNjb3JkLmNvbS8vZGlzY29yZC5jb20vbG9naW4=') {
              url = prefix + btoa('https://discord.com/login')
            }
            return url
          },
          css: function(code) {
            var host = proxy.host
            //code = code.replace("'", '"')
            code = code.replace(/@import\s*url\(['"`](.*?)['"`]\);*/gmi, function(match, p1) {
              p1 = p1.replace(/['"`]/gi, '')
              return `@import url('${proxify.url(p1)}')`
            })
            code = code.replace(/url\(['"`](.*?)['"`]\)/gi, function(match, p1, p2) {
              p1 = p1.replace(/['"`]/gi, '')
              return match.replace(p1, proxify.url(p1))
            })
            /*code = code.replace(/url\((.*?)\)/gi, function(match, p1) {
              p1 = p1.replace(/['"`]/gi, '')
              return match.replace(p1, proxify.url(p1))
            })*/
            return code
          },
          js: function(code) {
            return code.toString().replace(/location/g, 'sLocation').replace('myScript.src', '(myScript.src ? myScript.src : "")')
            //Discord Homepage Fix
            
            //.replace(/\s*(src|href)\s*=\s*['"`](.*?)['"`]/gmi, function(match, p1, p2) {
              //return ` ${p1}="${proxify.url(p2)}"`;
            //})
          },
          html: function(code) {
            code = code.toString().replace(/\s*onclick=["'`](.*)["'`]/gi, function(match, p1) {
              return match.replace(match, proxify.js(match))
            })
            code = code.replace(/<style.*>(.*?)<\/style>/gi, function(match, p1) {
              return match.replace(p1, proxify.css(p1))
            })
            code = code.replace(regex, (match, p1, p2)=>{
              if (p2 = p2.replace(/^\//gi, '')) 
              if (p1=="srcset") {
                var arr = [];

                p2.split(',').forEach(url => {
                    url = url.trimStart().split(' ');
                    url[0] = proxify.url(url[0]);
                    arr.push(url.join(' '));
                });

                p2 = arr.join(', ')
                return
              }
              if (p1=='integrity' || p1=='nonce') {
                return ''
              }
              let newUrl = 'https://example.com';
              if(p2.indexOf('https') !== -1) {
                  newUrl = p2;
              } else if (p2.substr(0,2) === '//') {
                  newUrl = 'https:' + p2;
              } else {
                  const searchURL = new URL(proxy.url);
                  newUrl = '//' + searchURL.host + '/' + p2;
              }
              if (!p2.includes(proxy.host))
              if (p2.match(/^(#|about:|data:|blob:|mailto:|javascript:|\{|\*)/)) return match
              if (proxy.url.startsWith('javascript:')) return 'javascript:'+proxify.js(poxy.url);
              match.replace(p2, proxify.url(p2));
              return ` ${p1}="${proxify.url(newUrl)}"`;
            });
            const html = new JSDOM(code, {contentType: 'text/html'}), document = html.window.document;
            document.querySelectorAll('*[style]').forEach(node => {
              node.style = proxify.css(node.getAttribute('style'))
            })
            var inject_script = document.createElement('script');inject_script.src = prefix+'smoke';inject_script.setAttribute('data-proxyConfig', JSON.stringify(inject));proxy.docTitle ? inject_script.setAttribute('data-docTitle', proxy.docTitle) : null;document.querySelector('head').insertBefore(inject_script, document.querySelector('head').childNodes[0])
            code = html.serialize();
            return code
          }
        }

        Object.entries(response.headers).forEach(([header_name, header_value]) => {
            if (header_name == 'set-cookie') {
                const cookie_array = [];
                header_value.forEach(cookie => cookie_array.push(cookie.replace(/Domain=(.*?);/gi, `Domain=` + req.headers['host'] + ';').replace(/(.*?)=(.*?);/, '$1' + '@' + proxy.spliceURL.hostname + `=` + '$2' + ';')));
                response.headers[header_name] = cookie_array;
    
            };
    
            if (header_name.startsWith('content-encoding') || header_name.startsWith('x-') || header_name.startsWith('cf-') || header_name.startsWith('strict-transport-security') || header_name.startsWith('content-security-policy') || header_name.startsWith('content-length')) delete response.headers[header_name];
    
            if (header_name == 'location') response.headers[header_name] = proxify.url(header_value);
        });

        sendData = Buffer.concat(pData)
        if (!response.headers['content-type']) {
          response.headers['content-type'] = 'text/plain; charset=UTF-8'
        }
        if (response.headers['content-type'].startsWith('text/html')) {
          sendData = proxify.html(sendData.toString())
        } else if (response.headers['content-type'].startsWith('application/javascript' || 'text/javascript')) {
          sendData = proxify.js(sendData.toString())
        } else if (response.headers['content-type'].startsWith('text/css')) {
          sendData = proxify.css(sendData.toString())
        }

        res.writeHead(response.statusCode, response.headers).end(sendData)
      })
    }).on('error', err => res.end(fs.readFileSync('./smoke/err.html', 'utf-8').replace('err_reason', err))).end()
    /*if (!res.writableEnded) {
      req.on('data', (data) => requestMain.write(data)).on('end', () => requestMain.end())
    }*/
  }
  post(req, res) {
    var url = atob(req.url.replace(prefix, ''))
    request.post(url, {json: req.body}, function (error, response, body) {response.on('end', () => res.end(body))})
  };
}