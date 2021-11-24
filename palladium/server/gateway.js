const urlp = require('url');

module.exports = class {
  constructor(ctx) {
    Object.entries(ctx).forEach((entry) => {
      this[entry[0]] = entry[1]
    })
    this.ctx = ctx
  }
  create(req, res) {
    if (req.url.startsWith(this.config.prefix+'gateway')) {
      var pdata = []
      req.on('data', data => pdata.push(data))
      req.on('end', () => {
        var string = Buffer.concat(pdata).toString()
        if (string==='') {
          if (!new URLSearchParams(urlp.parse(req.url, true).query).get('url')) return res.writeHead(500, {refresh: '5; /'}).end('Missing Parameter: URL')
          var url = new URLSearchParams(urlp.parse(req.url, true).query).get('url')
        } else {
          if (!new URLSearchParams(string).get('url')) return res.writeHead(500, {refresh: '5; /'}).end('Missing Parameter: URL')
          var url = new URLSearchParams(string).get('url')
        }
        if (!url.startsWith('http')) url = 'https:\/'+url

        url = url.replace(/http(s|):\/([a-zA-Z0-9]+)/g, 'https:/\/\/\/\/\\//$2')
        url = this.ctx.encoding.encode(url);
        res.writeHead(301, {location: `${this.prefix}${url}/`}).end('')
        console.log(url)
      })
    } else {
      res.writeHead(500, {refresh: '5; /'}).end('Unknown Error')
    }
  }
}