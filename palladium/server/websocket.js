const http = require('http')
const https = require('https')
const rurl = require('url')
const ws = require('ws')

module.exports = class WebSocket {
  constructor(ctx) {
    this.ctx = ctx
    return (http) => {
      if (ctx.Corrosion[0]==false) {
        try {
          var wss = new ws.Server({server: http})
          wss.on('connection', (cli, req) => {
            try {
              var proxyURL = req.url.split('?ws=')[1].replace(this.prefix, '')
              try {new URL(proxyURL)} catch(err) {return cli.close()}
              var wsProxy = new ws(proxyURL.split('&origin')[0].split('?origin')[0], {
                origin: proxyURL.split('&origin=')[1].split('?origin=')[0]
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
      } else {
        try {
          var wss = new ws.Server({server: http})
          wss.on('connection', (cli, req) => {
            if (req.url.startsWith(ctx.prefix)) {
              try {
                var proxyURL = req.url.split('?ws=')[1].replace(this.prefix, '')
                try {new URL(proxyURL)} catch(err) {return cli.close()}
                var wsProxy = new ws(proxyURL.split('&origin')[0].split('?origin')[0], {
                  origin: proxyURL.split('&origin=')[1].split('?origin=')[0]
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
            } else if (req.url.startsWith(ctx.Corrosion[1].prefix)) {
              try {new URL(ctx.Corrosion[1].url.unwrap(req.url))} catch(err) {return cli.close()}
              var url = ctx.Corrosion[1].url.unwrap(req.url).replace(/^http/g, 'ws')
              var eurl = require('url')
              var wsProxy = new ws(url, {origin: eurl.parse(req.url).query.split('origin=')[1]})
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
            }
          });
          if (this.debug==true) console.log('Websocket Loaded')
        } catch(err) {
          throw new Error('Error: Unknown Websocket Error\n\n'+err)
        }
      }
    }
  }
}