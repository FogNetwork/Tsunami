var makeRequest = require('./request'),
  gateway = require('./gateway'),
  utilities = require('./utility'),
  fs = require('fs'),
  Compile = require('./compile'),
  handleRequest = require('./handleRequest'),
  qs = require('querystring'),
  path = require('path')
  ws = require('ws'),
  Upgrade = require('./websocket'),
  btoa = str => new Buffer.from(str).toString('base64'),
  atob = str => new Buffer.from(str, 'base64').toString('utf-8');

module.exports = class Smoke {
  constructor(config) {
    var defaults = {
      prefix: '/service/',
      encode: 'plain',
      ssl: false,
      requestMiddleware: [],
      title: 'Service',
      debug: false,
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
    this.encoding = require('../encoding.js')(this)
    this.makeRequest = makeRequest
    this.handleRequest = handleRequest
    this.gateway = gateway
    this.middleware = {force: utilities.force}
    this.rewrite = new Compile(this)
    this.upgrade = new Upgrade(this)
    this.headersURL = (url) => {return this.encoding.decode(url.replace(this.prefix, ''))}
    this.getRequestUrl = (req) => {
      return this.encoding.decode(req.url.split(this.prefix)[1].replace(/\/$/g, '').replace(/^https:\/([a-z1-9A-Z])/g, "https://$1"))
    }
    this.headers = (require('./headers'))
  }
  request(req, res, next = function() {res.end('')}) {
    if (!req.url.startsWith(this.prefix)) return next()

    if (this.debug==true) console.log('Request', this.getRequestUrl(req))

    if (req.url.startsWith(this.prefix+'gateway')) return new this.gateway(this).create(req, res)

    this.url = this.getRequestUrl(req)
    var requestConfig = {}
    Object.entries(this).forEach((entry) => {
      requestConfig[entry[0]] = entry[1]
    })

    this.req = req
    this.response = res

    this.headers = new (require('./headers'))(this)
    
    if (req.url.replace(this.prefix, '').startsWith('index')) {
      return res.writeHead(200, {'content-type': 'application/javascript'}).end(fs.readFileSync('./palladium/client/index.js', 'utf-8'))
    } else if (req.url=='/surf/index') console.log('ierfwdc')

    this.handleRequest(req, res, this)
    
    //new this.makeRequest(this).request(this)
  }
  express(smoke, server) {
    smoke.clientScript()
    smoke.ws(server)
    return function(req, res, next) {
      return smoke.request(req, res, next)
    }
  }
  clientScript(ctx) {
    var base = path.parse(__dirname).dir
    var data1 = fs.readFileSync(path.join(base, 'encoding.js'))
    var data2 = fs.readFileSync(path.join(base,'client/xml.js'))
    var data3 = fs.readFileSync(path.join(base, 'server/utility.js'))
    var data4 = fs.readFileSync(path.join(base, 'client/client.js'))
    var data5 = fs.readFileSync(path.join(base, 'rewrites/base.js'))
    var data6 = fs.readFileSync(path.join(base, 'client/location.js'))
    var data7 = fs.readFileSync(path.join(base, 'client/element.js'))

    var fullData = [data4, data1, data2, data3, data5, data6, data7]
    fs.writeFileSync(path.join(base, 'client/index.js'), fullData.join('\n'))
    console.log('Client Script Bundled')
    return this
  }
  ws(http) {
    new ws.Server({server: http}).on('connection', (cli, req) => {

      var params = qs.parse(req.url.split('?').splice(1).join('?')), url, options = { headers: {},followRedirects: true}
      
      var protocol = [];
  
      if (!params.ws) return cli.close();
  
      url = this.encoding.decode(params.ws);

      try { new URL(url) } catch { return cli.close() };
  
      Object.entries(req.headers).forEach(([name, value]) => {
        if (name == 'sec-websocket-protocol') value.split(', ').forEach(proto => protocol.push(proto));
        if (name.startsWith('cf-') || name.startsWith('cdn-loop'));
        else if (!name.startsWith('sec-websocket'))  options.headers[name] = value;
      })
  
      if (params.origin) (options.origin = this.encoding.decode(params.origin), options.headers.origin = this.encoding.decode(params.origin));        
  
      delete options.headers['host'];
      delete options.headers['cookie'];
  
      if (typeof this.config.localAddress == 'object' &&  this.config.localAddress.length != 0) options.localAddress = this.config.localAddress[Math.floor(Math.random() * this.config.localAddress.length)];

      console.log('Websocket Connection', url)

      const proxySocket = new ws(url, protocol, options)
      
      const chunks = [];
  
      if (proxySocket.readyState == 0) cli.on('message', data => chunks.push(data));

      proxySocket.on('error', () => console.log('websocket proxy error'))
      proxySocket.on('close', () => console.log('websocket proxy close'))
      cli.on('error', () => console.log('websocket client error'))
      cli.on('close', () => console.log('websocket client close'))
  
      cli.on('close', () => proxySocket.close());
      proxySocket.on('close', () => cli.close());
      cli.on('error', () => proxySocket.terminate())
      proxySocket.on('error', () => cli.terminate());
  
      proxySocket.on('open', () => {
        if (chunks.length != 0) chunks.forEach(data => proxySocket.send(JSON.stringify(data)))
        cli.on('message', data => proxySocket.send(JSON.stringify(data)));
        proxySocket.on('message', data => cli.send(JSON.stringify(data)));
      });
    });
    if (this.debug==true) console.log('Websocket Loaded')
    return this
  }
}

//module.exports = Smoke