var config = JSON.parse(document.currentScript.getAttribute('data-config'))

var module = {}

if (config.title) {
  document.title = config.title
  setInterval(() => {if (document.title!==config.title) document.title = config.title}, 100)
}

/*if (!location.pathname.startsWith(config.prefix)) {
  location.href = config.prefix + 'gateway?url=' + location.pathname.replace(config.prefix, '')
}*/


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
          return (encodeURIComponent(str.split('').map((char,ind)=>ind%2?String.fromCharCode(char.charCodeAt()^2):char).join('')));
        },
        decode(str) {
          if (!str.startsWith('hvtrs')) return str
          return (decodeURIComponent(str).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''))
        }
      }
      break;
    case "base64":
      return {
        encode(str) {
          return new Buffer.from(str).toString("base64");
        },
        decode(str) {
          if (new Buffer.from(str).toString("base64").startsWith('http')) {
            return str
          }
          return new Buffer.from(str, "base64").toString("utf-8");
        }
      }
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
function blackList(ctx) {
  if (ctx.middleware.blackList) {
    
  } else return ctx
}

function force(ctx) {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

if (!typeof module !== undefined) module.exports.blackList = blackList;
if (typeof module !== undefined) module.exports.force = force;
//Client and Server Side

class Base {
  constructor(ctx) {
    this.ctx = ctx
  }
  url(url, ext) { 
    url = url.toString()
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
    if (url.startsWith(this.ctx.prefix)) return url
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
    if (!ext) return this.ctx.prefix + this.ctx.encoding.encode(url)
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

document.currentScript.remove()