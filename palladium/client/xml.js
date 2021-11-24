const oFetch = window.fetch,
  oXHR = window.XMLHttpRequest.prototype.open;

var ctx = {
  prefix: config.prefix,
  url: config.url,
  config: {
    encode: config.encode,
  },
  getRequestUrl: (req) => {return this.encoding.decode(req.url.split(defaults.prefix)[1].replace(/\/$/g, ''))},
}

ctx.encoding = encoding(ctx)

window.fetch = function(url, opts) {
  if (url) url = new Base(ctx).url(url)
  oFetch.apply(this, arguments)
}

window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  if (url) url = new Base(ctx).url(url)
  console.log(url)
  oXHR.apply(this, arguments)
}

window.WebSocket = new Proxy(window.WebSocket, {
  construct(target, args) {
    args[0] = (location.protocol=='https:' ? 'wss:' : 'ws:') + '//' + location.origin.split('/').splice(2).join('/') + config.prefix + '?ws=' + ctx.encoding.encode(args[0].replace('ws', 'http')).replace('http', 'ws') + '&origin=' + new URL(config.url).origin;
    //console.log((location.protocol=='https:' ? 'wss:' : 'ws:') + '//' + location.origin.split('/').splice(2).join('/') + config.prefix + '?ws=' + ctx.encoding.encode(args[0].replace('ws', 'http')) + '&origin=' + new URL(config.url).origin)
    return Reflect.construct(target, args);
  }
});