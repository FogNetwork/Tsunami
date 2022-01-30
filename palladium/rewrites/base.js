//Client and Server Side

class Base {
  constructor(ctx) {
    this.ctx = ctx
  }
  url(url, ext) { 
    if (typeof window == 'undefined') {
      function co(num) { return (num % 2)==1;}
      var headers = this.ctx.req.rawHeaders || []
      var fullHeaders = {}
      headers.map((e, ind) => {
        if (co(ind+1)) {
          fullHeaders[e] = headers[ind+1]
        }
      })
    }
    var hostname = ((fullHeaders||{})['Host']||(fullHeaders||{})['host']||location.hostname)
    if (!url) return url
    /*
    if (typeof url == 'object') {
      throw new Error('no')
      var object = url
      console.log(object)
      url = url.url
    }*/
    url = (url).toString()
    if (url.match(/^(javascript:|about:|mailto:|data:|blob:|#)/gi)) return url
    url = url.replace(/^\/\//, 'https://')

    try{url = url.replace(location.origin, new URL(ctx.url).origin)}catch{}

    /*if (url.includes('https://')) {
      url = url.replace('https://', '')
      url = url.split('/')
      url[0] = ''
      Object.keys(url).forEach((e) => {
        if (!e==0||!e==1) url[e]='/'+url[e]
      })
      url = url.join('')
      console.log(url)
    }*/
    if (!this.ctx.encode==='base64') {
      url = this.ctx.encoding.decode(url)
    }
    if (url.startsWith(this.ctx.prefix)) return url;
    if (!url.startsWith('http')) {
      try {
        var host = new URL(this.ctx.url).hostname
      } catch(err) {
        try {var host = new URL(this.ctx.encoding.decode(this.ctx)).hostname} catch(e) {}
      }
      url = 'https://'+ host + (url.startsWith('/') ? '' : '/') + url
    }
    if(new URL(url).protocol.startsWith('ws')) {
      console.log(new URLSearchParams(new URL(url).search))
    }
    if (url.includes('https://')) url = url.replace('https://', 'https:/')
    /*var test = 'https://'+hostname+this.ctx.prefix + this.ctx.encoding.encode(url.replace('../', '').replace('./', '').replace('http://', 'https://'))
    test = this.ctx.encoding.decode(test.split(this.ctx.prefix)[1])
    if (test.includes(this.ctx.prefix)) {
      url = this.ctx.encoding.decode(test.split(this.ctx.prefix)[1])
    }*/
    var eslash = url.endsWith('/') ? '/' : ''
    if (!ext) return /*'https://'+hostname+*/this.ctx.prefix + this.ctx.encoding.encode(url.replace('../', '').replace('./', '').replace('http://', 'https://'))+eslash
    return this.ctx.prefix + ext + this.ctx.encoding.encode(url)
  }
  element(attr, ext) {
    if (ext==='_plain/') {
      var url = this.url(attr)
    } else {
      var url = this.url(attr, ext)
    }

    return url
  }
}

if (typeof module !== undefined) module.exports = Base;