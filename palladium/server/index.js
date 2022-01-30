var request = require('./request'),
  gateway = require('./gateway'),
  utilities = require('./utility'),
  fs = require('fs'),
  Compile = require('./compile'),
  handleRequest = require('./handleRequest'),
  qs = require('querystring'),
  path = require('path')
  ws = require('ws'),
  WebSocket = require('./websocket'),
  zlib = require('zlib'),
  decompress = require('../decompress'),
  btoa = str => new Buffer.from(str).toString('base64'),
  atob = str => new Buffer.from(str, 'base64').toString('utf-8');

module.exports = class Smoke {
  constructor(config) {
    var server = config.server || {}
    delete config.server
    if (server!={}) server.on('request', (req, res) => {if(req.headers.useragent === 'googlebot') return res.writeHead(403).end('');})
    var defaults = {
      prefix: '/service/',
      encode: 'plain',
      ssl: false,
      requestMiddleware: [],
      responseMiddleware: [],
      requestMiddlewares: [],
      responseMiddlewares: [],
      title: 'Service',
      debug: false,
      Corrosion: [false, {}],
    }
    this.config = defaults
    if (config.prefix) {
      if (config.prefix.startsWith('/') && config.prefix.endsWith('/'));
      else {
        config.prefix = config.prefix.replace(/\//g, '')
        config.prefix = '/'+config.prefix+'/'
      }
    }
    defaults = Object.assign(defaults, config);
    Object.entries(defaults).forEach((entry) => {
      this[entry[0]] = entry[1]
    })
    this.headersURL = (url) => {return this.encoding.decode(url.replace(this.prefix, ''))}
    this.getRequestUrl = (req) => {
      return this.encoding.decode(req.url.split(this.prefix)[1].replace(/\/$/g, '').replace(/^https:\/([a-z1-9A-Z])/g, "https://$1")).replace('../', '').replace('./', '')
    }
    this.encoding = require('../encoding.js')(this)
    this.make = new request(this)
    this.handleRequest = handleRequest
    this.gateway = gateway
    this.middleware = {force: utilities.force,blackList: utilities.blackList}
    this.decompress = new decompress(this)
    this.rewrite = new Compile(this)
    this.websocket = new WebSocket(this)
    this.headers = (require('./headers'))
    if (server!={}) this.websocket(server)
  }
  request(req, res, next = function() {res.end('')}) {
    if (!req.url.startsWith(this.prefix)) return next()

    req.headers.useragent === 'googlebot' && next();

    if (this.debug==true) console.log('Request', this.getRequestUrl(req))

    if (req.url.startsWith(this.prefix+'gateway')) return new this.gateway(this).create(req, res)
    
    var requestConfig = {}
    Object.entries(this).forEach((entry) => {
      requestConfig[entry[0]] = entry[1]
    })

    Object.assign(this, {host: (this.getRequestUrl(req).replace(/(https:\/\/|http:\/\/|\/$)/g, '')).split('/')[0],path: (this.getRequestUrl(req)).split('/')[(this.getRequestUrl(req)).split('/').length - 1],url: this.getRequestUrl(req),docTitle: this.config.docTitle})

    /*if (req.url.replace(this.prefix, '')==('index')) {
      return res.writeHead(200, {'content-type': 'application/javascript'}).end(fs.readFileSync('./lib/client/index.js', 'utf-8'))
    }*/

    //try {new URL(this.url)} catch(err) {return res.end('Invalid URL: '+this.url+', '+err)}

    //if (!this.url.endsWith('/')) return res.writeHead(301, {location: req.url+'/'}).end('')

    this.req = req
    this.response = res

    this.headers = new (require('./headers'))(this)
    
    if (req.url.replace(this.prefix, '').startsWith('index')) {
      return res.writeHead(200, {'content-type': 'application/javascript'}).end(fs.readFileSync(path.join(path.parse(__dirname).dir, 'client/index.js'), 'utf-8'))
    }

    //this.options = this.handle(this)

    //this.handleRequest(this)

    this.handleRequest(req, res, this)
  }
  express(smoke, server) {
    smoke.clientScript()
    smoke.ws(server)
    return function(req, res, next) {
      return smoke.request(req, res, next)
    }
  }
  init(ctx) {
    var base = path.parse(__dirname).dir
    var data1 = fs.readFileSync(path.join(base, 'encoding.js'))
    var data2 = fs.readFileSync(path.join(base,'client/xml.js'))
    var data3 = fs.readFileSync(path.join(base, 'server/utility.js'))
    var data4 = fs.readFileSync(path.join(base, 'client/client.js'))
    var data5 = fs.readFileSync(path.join(base, 'rewrites/base.js'))
    var data6 = fs.readFileSync(path.join(base, 'client/location.js'))
    var data7 = fs.readFileSync(path.join(base, 'client/element.js'))
    var data8 = fs.readFileSync(path.join(base, 'rewrites/javascript.js'))

    var fullData = [data4, data1, data2, data3, data8, data5, data6, data7]
    fs.writeFileSync(path.join(base, 'client/index.js'), fullData.join('\n'))
    return ctx
  }
  ws(http) {
    try {
      var wss = new ws.Server({server: http})
      wss.on('connection', (cli, req) => {
        try {
          var proxyURL = req.url.split('?ws=')[1].replace(this.prefix, '')
          try {new URL(proxyURL)} catch(err) {return cli.close(err)}
          var wsProxy = new ws(proxyURL, {
            origin: proxyURL.split('&origin=')[1]
          })
          wsProxy.on('error', () => cli.terminate())
          cli.on('error', () => wsProxy.terminate())
          wsProxy.on('close', () => cli.close())
          cli.on('close', () => wsProxy.close())
          wsProxy.on('open', () => {
            cli.on('message', message => {
              wsProxy.send(message.toString())
            })
            wsProxy.on('message', message => {
              message = message.toString().includes('�') ? message : message.toString()
              cli.send(message)
            })
          })
        } catch {
          cli.close()
        }
      });
      if (this.debug==true) console.log('Websocket Loaded')
    } catch(err) {
      throw new Error('Error: Unknown Websocket Error\n\n'+err)
    }
    return this
  }
  onrequest(func) {
    this.requestMiddlewares.push(func)
  }
  onresponse(func) {
    this.requestMiddlewares.push(func)
  }
}

module.exports.blackList = utilities.blackList

//module.exports = Smoke