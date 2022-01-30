const zlib = require('zlib')

module.exports = class {
  constructor(ctx) {
    return function(response, data) {
      var sendData = ''
      switch(response.headers['content-encoding']) {
          case 'gzip':
              sendData = zlib.gunzipSync(Buffer.concat(data));
          break;
          case 'deflate':
              sendData = zlib.inflateSync(Buffer.concat(data));
          break;
          case 'br':
              sendData = zlib.brotliDecompressSync(Buffer.concat(data));
          break;
          default: sendData = Buffer.concat(data); break;
      };
      return sendData
    }
  }
}