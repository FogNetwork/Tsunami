var config = JSON.parse(document.currentScript.getAttribute('data-config'))

var module = {}

if (config.title) {
  document.title = config.title
  setInterval(() => {if (document.title!==config.title) document.title = config.title}, 100)
}


var encoding = (ctx) => {
  switch(ctx.encode) {
    case "plain":
      return {
        encode(str) {
          return str;
        },
        decode(str) {
          return str;
        }
      }
      break;
    case "xor":
      return {
        encode(str) {
          str = str.replace('https://', 'https:/').replace('https:/', 'https://')
          return (encodeURIComponent(str.split('').map((char,ind)=>ind%2?String.fromCharCode(char.charCodeAt()^2):char).join('')));
        },
        decode(str) {
          if (!str.startsWith('hvtrs')) return str
          return (decodeURIComponent(str).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''))
        }
      }
      break;
    case "base64":
      if (typeof window == 'undefined') return {
        encode(str) {
          return new Buffer.from(str).toString("base64");
        },
        decode(str) {
          if (new Buffer.from(str).toString("base64").startsWith('http')) {
            return str
          }
          return new Buffer.from(str, "base64").toString("utf-8");
        }
      }; else return {
        encode(str) {
          return btoa(str)
        },
        decode(str) {
          if (btoa(str).startsWith('http')) {
            return str
          }
          return atob(str.split('/')[0])+str.split('/')[1]
        }
      };
      break;
    default:
      return {
        encode(str) {
          return str;
        },
        decode(str) {
          return (str.split('https:/').startsWith('/') ? str : str.replace('https:/', 'https://'));
        }
      }
  }
}

if (typeof module !== undefined) module.exports = encoding;
const oFetch = window.fetch,
  XHR = window.XMLHttpRequest,
  oXHR = window.XMLHttpRequest.prototype.open,
  oPMessage = window.postMessage,
  oSBeacon = window.Navigator.prototype.sendBeacon;

var ctx = {
  prefix: config.prefix,
  url: config.url,
  config: {
    encode: config.encode,
  },
  encode: config.encode,
  getRequestUrl: (req) => {return this.encoding.decode(req.url.split(this.prefix)[1].replace(/\/$/g, ''))},
}

ctx.encoding = encoding(ctx)

window.fetch = function(url, opts) {
  if (typeof url == 'object') {
    opts = url
    url = url.url
    return oFetch.apply(this, arguments)
  }
  if (url) url = new Base(ctx).url(url)
  return oFetch.apply(this, arguments)
}

window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  if (url) url = new Base(ctx).url(url)
  return oXHR.apply(this, arguments)
}

window.postMessage = function(msg, origin, transfer) {
  if (origin) origin = location.origin;
  return oPMessage.apply(this, arguments);
};
window.Navigator.prototype.sendBeacon = function(url, data) {
  if (url) url = new Base(ctx).url(url);
  return oSBeacon.apply(this, arguments);
};

window.WebSocket = new Proxy(window.WebSocket, {
  construct(target, args) {
    if (args[0].includes('?')) var todo = '&'; else var todo = '?'
    args[0] = (location.protocol=='https:' ? 'wss:' : 'ws:') + '//' + location.origin.split('/').splice(2).join('/') + config.prefix + '?ws='+args[0].replace(location.origin.split('/').splice(2).join('/'), pLocation.origin.split('/').splice(2).join('/'))+ todo+'origin=' + new URL(config.url).origin;
    return Reflect.construct(target, args);
  }
});

/*var lStorageOrigin = window.localStorage

window._localStorage = new Proxy({}, {
  set(value, prop) {
    if (prop=='getItem') {
      return ''
    }
    if (prop=='setItem') {
      return ''
    }
    return localStorage[new URL(config.url).hostname+prop] = value
  },
  get(value, prop) {
    if (prop=='getItem') {
      return function() {
        var args = arguments
        return localStorage[new URL(config.url).hostname+args[0]]
      }
    }
    if (prop=='setItem') {
      return function() {
        var args = arguments
        return localStorage[new URL(config.url).hostname+args[0]] = args[1]
      }
    }
    return localStorage[new URL(config.url).hostname+prop]
  }
})

/*

Object.defineProperty(window, 'localStorage', {
  get() {
    return lStorageOrigin
  },
  set(value) {
    lStorageOrigin = value
  }
})

Object.keys(window.localStorage).forEach(key => {
  if (key.startsWith(new URL(config.url).hostname)) {
    localStorage[key] = localStorage[key]
  } else {
    var nkey = localStorage[key]
    //localStorage.removeItem(key)
    window.addEventListener('beforeunload', () => {
      localStorage[key] = nkey
    })
  }
})
/*
Object.defineProperty(window.localStorage, 'setItem', {

})

window.RTCPeerConnection = new Proxy(RTCPeerConnection, {
  construct(target, args) {
    if (args[1].urls.startsWith('turns:')) {
      args[1].username += `|${args[1].urls}`;
      args[1].urls = `turns:${location.host}`;
      return Reflect.apply(...arguments);
    } else if (args[1].urls.startsWith('stuns'))
      console.warn("STUN connections aren't supported!");
  }
});*/

window.Worker = new Proxy(window.Worker, {
  construct: (target, args) => {
    if (args[0])  {
      if (args[0].trim().startsWith(`blob:${pLocation.origin}`)) {
        const xhr = new XHR
        xhr.open('GET', args[0], false);
        xhr.send();
        const script = new JSRewriter(ctx)(xhr.responseText, ctx.location.origin + args[0].trim().slice(`blob:${ctx.window.location.origin}`.length), ctx);
        const blob = new Blob([ script ], { type: 'application/javascript' });
        args[0] = URL.createObjectURL(blob);
      } else {
        args[0] = new Base(ctx).url(args[0]);
      };
    };
    return Reflect.construct(target, args);
  },
}); 
function blackList(list, reason = 'Website Blocked') {
  return (ctx) => {
    try {if(list.indexOf(new URL(ctx.url).hostname)>-1) {
      ctx.response.end(reason)
    }} catch {}
  }
}

function allow(list, config) {
  return function(ctx) {
    try {if(list.indexOf(new URL(ctx.url).hostname)==-1) {
      if (config[0]=='redirect') {
        ctx.response.writeHead(301, {location: ctx.prefix+'gateway?url='+config[1]}).end('')
      } else {
        ctx.response.end(config[1])
      }
    }} catch {}
  }
}

function force(ctx) {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

if (!typeof module !== undefined) module.exports.blackList = blackList;
if (typeof module !== undefined) module.exports.force = force;
module.exports.allow = allow;
class JSRewriter {
  constructor(data, ctx) {
    return function JS(data, ctx) {
      return data.toString().replace(/(,| |=|\()document.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.pLocation`); }).replace(/(,| |=|\()window.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.pLocation`); })/*.replace(/(,| |=|\()location(,| |=|\)|\.)/gi, str => { return str.replace('location', `pLocation`); })*/.replace('myScript=scripts[index]||', 'myScript=')//.replace(/(localStorage|sessionStorage)/g, '_$1')//.replace(/location\s*=\s*/gi, 'PLocation = ')//.replace(/location\.([a-zA-Z0-9]*)/gi, 'pLocation.$1')//.replace(/\.href\s*=(["'` ]*)([a-zA-Z0-9]*)(['`" ]*)/gi, (match, p1, p2, p3) => {return '.phref = '+p1+new ctx.rewrite.Base(ctx).url(p2)+p3})
    }
  }
}

if (typeof module !== undefined) module.exports = JSRewriter
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
window.pLocation = new Proxy({}, {
  set(obj, prop, value) {

      if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return;

      return location[prop] = new Base(ctx).url(new URL(config.url).href.replace(new URL(config.url)[prop], value));
  },
  get(obj, prop) {
      // Had to be done in order to fix Discord.
      if (new URL(config.url).origin == atob('aHR0cHM6Ly9kaXNjb3JkLmNvbQ==') && new URL(config.url).pathname == '/app') return window.location[prop];

      if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return {
          assign: arg => window.location.assign(new Base(ctx).url(arg)),
          replace: arg => window.location.replace(new Base(ctx).url(arg)),
          reload: (arg) => window.location.reload(arg ? arg : null),
          toString: () => { return new URL(config.url).href },
          hash: window.location.hash,
          search: window.location.search
      }[prop];
      else return new URL(config.url)[prop];
  }    
})

var oOpen = window.open;
document.pLocation = pLocation

window.open = function(url, opts) {
  if (url) url = new Base(ctx).url(url)
  oOpen.apply(this, arguments)
}

Object.defineProperty(window, "PLocation", {
  set: function(newValue){
    if (!newValue) return;
    pLocation.href = (newValue)
  },
  get: function(){
    return this.location;
  }
});

var pushstates = history.pushState;

window.history.pushState = new Proxy(history.pushState, {
  apply(target, thisArg, args) {
  args[2] = new Base(ctx).url(args[2])
  return Reflect.apply(target, thisArg, args)
  }
});

window.history.replaceState = new Proxy(history.replaceState, {
  apply(target, thisArg, args) {
    args[2] = new Base(ctx).url(args[2])
    return Reflect.apply(target, thisArg, args)
  }
});

Object.defineProperty(document, 'domain', {
  get() {
    return new URL(ctx.url).hostname;
  },
  set(val) {
    return val;
  }
});

var oCookie = document.cookie

Object.defineProperty(document, 'cookie', {
  get() {
    var cookie = Object.getOwnPropertyDescriptor(window.Document.prototype, 'cookie').get.call(this),
      new_cookie = [],
      cookie_array = cookie.split('; ');
    cookie_array.forEach(cookie => {
      const cookie_name = cookie.split('=').splice(0, 1).join(),
        cookie_value = cookie.split('=').splice(1).join();
      if (new URL(ctx.url).hostname.includes(cookie_name.split('@').splice(1).join())) new_cookie.push(cookie_name.split('@').splice(0, 1).join() + '=' + cookie_value);
    });
    return new_cookie.join('; ');;
  },
  set(val) {
    Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').set.call(this, val);
  }
})

window.Worker = new Proxy(window.Worker, {
  construct(target, args) {
    if (args[0]) args[0] = new Base(ctx).url(args[0]);
    return Reflect.construct(target, args);
  }
});

if (config.title) {
  var oTitle = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
  document.title = config.title
  Object.defineProperty(Document.prototype, 'title', {
    set(value) {
      oTitle = config.title
      return value
    },
    get() {
      return config.title
    }
  })
}

if (location.search && !(new URLSearchParams(location.search).get('palladium-redir'))) {
  var p1 = ctx.encoding.decode(location.pathname.split(config.prefix)[1])
  console.log(p1+location.search+'&palladium-redir=true')
  location.href = config.prefix+ctx.encoding.encode(p1+location.search+'&palladium-redir=true')
}
var proxify = {}

proxify.elementHTML = element_array => {
    element_array.forEach(element => {
        Object.defineProperty(element.prototype, 'innerHTML', {
            set(value) {
                const elem = new DOMParser().parseFromString(Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this), 'text/html').body.querySelectorAll('*')[0];
                Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").set.call(elem, value);
                elem.querySelectorAll("script[src], iframe[src], embed[src], audio[src], img[src], input[src], source[src], track[src], video[src]").forEach(node => node.setAttribute('src', node.getAttribute('src')));
                elem.querySelectorAll("object[data]").forEach(node => node.setAttribute('data', node.getAttribute('data')));
                elem.querySelectorAll("a[href], link[href], area[href").forEach(node => node.setAttribute('href', node.getAttribute('href')));
                return Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").set.call(this, elem.innerHTML);
            },
            get() {
                return Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").get.call(this);
            }
        });
        Object.defineProperty(element.prototype, 'outerHTML', {
            set(value) {
                const elem = new DOMParser().parseFromString(Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this), 'text/html').body;
                Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").set.call(elem.querySelectorAll('*')[0], value);
                elem.querySelectorAll("script[src], iframe[src], embed[src], audio[src], img[src], input[src], source[src], track[src], video[src]").forEach(node => node.setAttribute('src', node.getAttribute('src')));
                elem.querySelectorAll("object[data]").forEach(node => node.setAttribute('data', node.getAttribute('data')));
                elem.querySelectorAll("a[href], link[href], area[href").forEach(node => node.setAttribute('href', node.getAttribute('href')));
                return Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").set.call(this, elem.innerHTML);
            },
            get() {
                return Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this);
            }
        });
    });
};

proxify.elementAttribute = (element_array, attribute_array) => {
    element_array.forEach(element => {

        if (element == window.HTMLScriptElement) {
            Object.defineProperty(element.prototype, 'integrity', {
                set(value) {
                    return this.removeAttribute('integrity')
                },
                get() {
                    return this.getAttribute('integrity');
                }
            });
            Object.defineProperty(element.prototype, 'nonce', {
                set(value) {
                    return this.removeAttribute('nonce')
                },
                get() {
                    return this.getAttribute('nonce');
                }
            });
        }

        element.prototype.setAttribute = new Proxy(element.prototype.setAttribute, {
            apply(target, thisArg, [ element_attribute, value ]) {
                attribute_array.forEach(array_attribute => {

                    if (array_attribute == 'srcset' && element_attribute.toLowerCase() == array_attribute) {
                        var arr = [];

                        value.split(',').forEach(url => {
                            url = url.trimStart().split(' ');
                            url[0] = new Base(ctx).url(url[0] || '');
                            arr.push(url.join(' '));
                        });

                        return Reflect.apply(target, thisArg, [ element_attribute, arr.join(', ') ]);
                    };

                    if (array_attribute == 'http-equiv' && element_attribute.toLowerCase() == array_attribute) {
                      value = 'No-U-Content-Security-Policy'
                      return Reflect.apply(target, thisArg, [ element_attribute, value ])
                    }

                    if (element_attribute.toLowerCase() == array_attribute) value = new Base(ctx).url(value || '');
                });
                return Reflect.apply(target, thisArg, [ element_attribute, value ]);
            }
        });

        attribute_array.forEach(attribute => {

            Object.defineProperty(element.prototype, attribute, {
                set(value) {
                    return this.setAttribute(attribute, value);
                },
                get() {
                    return this.getAttribute(attribute);
                }
            }); 

        });

    });
};

proxify.elementHTML([ window.HTMLDivElement ]);

proxify.elementAttribute([ window.HTMLAnchorElement, window.HTMLAreaElement, window.HTMLLinkElement ], [ 'href' ]);

proxify.elementAttribute([ window.HTMLScriptElement, window.HTMLIFrameElement, window.HTMLEmbedElement, window.HTMLAudioElement, window.HTMLInputElement, window.HTMLTrackElement ], [ 'src' ]);

proxify.elementAttribute([ window.HTMLImageElement, HTMLSourceElement ], [ 'src', 'srcset' ]);

proxify.elementAttribute([ window.HTMLObjectElement ], [ 'data' ]);

proxify.elementAttribute([ window.HTMLFormElement ], [ 'action' ]); 

//if (new URL(config.url).hostname===ctx.encoding.decode('hvtrs8%2F-dksaopd%2Ccmm').replace('https://', '')) myScript = {src: '//'}

setInterval(() => {
  document.querySelectorAll('a').forEach(node => {
    if (!node.getAttribute('data-palladium')) {
      if (node.href) node.setAttribute('href', new Base(ctx).url(node.href))
      node.setAttribute('data-palladium', true)
    }
  })
}, 100)

var inserthtmlproto = Element.prototype.insertAdjacentHTML

Element.prototype.insertAdjacentHTML = function(place, text) {
  var regex = /(srcset|src|href|action|integrity|nonce|http-equiv)\s*=\s*['`"](.*?)['"`]/gi
  text = text.toString()
  text = text.replace(regex, (match, p1, p2) => {
    if (p1=='integrity' || p1=='nonce' || p1=='http-equiv') return ''
    if (p1=='srcset') {
      const src_arr = [];

      p2.split(',').forEach(url => {
        url = url.trimStart().split(' ');
        url[0] = new Base(ctx).url(url[0]);
        src_arr.push(url.join(' '));
      });

      p2 = src_arr.join(', ')
      return `${p1}="${p2}"`
    }
    return `${p1}="${new Base(ctx).url(p2)}"`
  })
  return inserthtmlproto.apply(this, arguments)
}

window.Document.prototype.writeln = new Proxy(window.Document.prototype.writeln, {
  apply: (target, that , args) => {
    if (args.length) args = [ ctx.html.process(args.join(''), ctx.meta) ];
    return Reflect.apply(target, that, args);
  },
});

var docWriteHTML = document.write

window.Document.prototype.write = function() {
  if (arguments[0]) {
    var regex = /(srcset|src|href|action|integrity|nonce|http-equiv)\s*=\s*['`"](.*?)['"`]/gi
    arguments[0] = arguments[0].toString()
    arguments[0] = arguments[0].replace(regex, (match, p1, p2) => {
      if (p1=='integrity' || p1=='nonce' || p1=='http-equiv') return ''
      if (p1=='srcset') {
        const src_arr = [];

        p2.split(',').forEach(url => {
          url = url.trimStart().split(' ');
          url[0] = new Base(ctx).url(url[0]);
          src_arr.push(url.join(' '));
        });

        p2 = src_arr.join(', ')
        return `${p1}="${p2}"`
      }
      return `${p1}="${new Base(ctx).url(p2)}"`
    })
  }
  return docWriteHTML.apply(this, arguments)
}

window.Audio = new Proxy(window.Audio, {
  construct: (target, args) => {
    if (args[0]) args[0] = new Base(ctx).url(args[0])
    return Reflect.construct(target, args);
  },
});

//Function.prototype.apply.call = function() {return Function.prototype.call.apply(this, arguments)}

document.currentScript.remove()