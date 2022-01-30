module.exports = class Headers {
  constructor(ctx) {
    return {
      origin(header, url) {
        var newHeader = ctx.headersURL(`/${ctx.req.headers['origin'].split('/').splice(3).join('/')}`.replace(ctx.prefix, ''), true);
        if (newHeader.startsWith('https://') || newHeader.startsWith('http://')) newHeader = newHeader.split('/').splice(0, 3).join('/');
        else newHeader = new URL(ctx.url).origin;
        return newHeader;
      },
      referer(header) {
        var proxified_header = ctx.headersURL(`/${ctx.req.headers['referer'].split('/').splice(3).join('/')}`.replace(ctx.prefix, ''), true);
        if (proxified_header.startsWith('https://') || proxified_header.startsWith('http://')) proxified_header = proxified_header;
        else proxified_header = ctx.url;
        return proxified_header;
      },
      cookie(header) {
        return header
      }
    }
  }
}