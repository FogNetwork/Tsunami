const http = require('http')
const https = require('https')
const rurl = require('url')

module.exports = class WebSocket {
  constructor(ctx) {
    this.ctx = ctx
    return (req, socket, head) => {
      //try {
          var url = ctx.getRequestUrl(req)//.replace(/^\?ws=ws(s*)/g, 'https')
          url = url.replace('?ws=', '')
          var parse = new URL(url)
          parse.searchParams.delete('origin')
          url = {value: new URL(url),origin:url};
          console.log(url.origin)

          //console.log(url.origin);

          var requestProtocol = (url.value.protocol == 'https:' ? https : http)

          requestProtocol.request(url.origin, {headers: req.headers}).on('upgrade', (rres, rsocket, rhead) => {
              let handshake = 'HTTP/1.1 101 Web Socket Protocol Handshake\r\n';
              for (let key in rres.headers) {
                  handshake += `${key}: ${rres.headers[key]}\r\n`;
              };
              console.log('sending')
              handshake += '\r\n';
              socket.write(handshake);
              socket.write(head);
              rsocket.on('close', () => socket.end());
              socket.on('close', () => rsocket.end());
              rsocket.on('error', () => socket.end());
              socket.on('error', () => rsocket.end());
              rsocket.pipe(clientSocket);
              socket.pipe(rsocket);
          }).on('error', () => {
              socket.end()
          }).end();
      /*} catch(err) {
        console.log(err)
          socket.end();
      };  */
    }
  }
}