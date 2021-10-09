config = JSON.parse(document.currentScript.dataset.proxyconfig)
config.oldURL = config.url
config.url = new URL(config.url)
config.host += '/'
const prefix = config.prefix

console.log('Smoke Proxy Loaded')

if (document.currentScript.dataset.doctitle) document.title = document.currentScript.dataset.doctitle

var proxify = {
  url: function(url) {
    var host = config.host
    url = url.replace(/\/$/gi, '')
    //console.log(url)
    if (url.match(/^(about:|javascript:|#|tel:|mailto:)/g)) return url
    if (url.startsWith('http')) {
      url = prefix + btoa(url)
    } else if (url.startsWith('//')) {
      url = prefix + btoa(url.replace(/^\/{2}/gi, 'https://'))
    } else {
      url = prefix + btoa('https://' + host + '/' + url)
    }
    if (url==prefix + 'aHR0cHM6Ly9kaXNjb3JkLmNvbS8vZGlzY29yZC5jb20vbG9naW4=') {
      url = prefix + btoa('https://discord.com/login')
    }
    return url
  },
  requrl: function(url) {
    try {url.replace()} catch(e) {return url}
    url = url.replace(/^\//g, '')
    if (url.startsWith('http')) {
      return proxify.url(url)
    } else {
      return proxify.url('https://'+config.url.hostname+'/'+url)
    }
  },
  element: function(elem) {
    document.querySelectorAll(elem).forEach(node => {
      if (node.href) node.href = proxify.url(node.href);
      if (node.src) node.src = proxify.url(node.src);
    })
  }
}

window.sLocation = new Proxy({}, {
  set(obj, prop, value) {

      if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return;

      console.log(proxify.url(config.url.href.replace(config.url[prop], value)));

      console.log((config.url.href.replace(config.url[prop], value)));


      return location[prop] = proxify.url(config.url.href.replace(config.url[prop], value));
  },
  get(obj, prop) {
      // Had to be done in order to fix Discord.
      if (config.url.origin == atob('aHR0cHM6Ly9kaXNjb3JkLmNvbQ==') && config.url.pathname == '/app') return window.location[prop];

      if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return {
          assign: arg => window.location.assign(proxify.url(arg)),
          replace: arg => window.location.replace(proxify.url(arg)),
          reload: (arg) => window.location.reload(arg ? arg : null),
          toString: () => { return config.url.href },
          hash: window.location.hash,
          search: window.location.search
      }[prop];
      else return config.url[prop];
  }    
})

window.sLocation.hash = window.location.hash

sLocation = window.sLocation

document.sLocation = window.sLocation

var Ofetch = window.fetch,XMLOpen = window.XMLHttpRequest.prototype.open,Open = window.open,SendBeacon = window.Navigator.prototype.sendBeacon,Clog = console.log;

console.log = function(data) {
  data = urlify(data)
  return Clog.apply(console, arguments)
}

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return 'https://'+window.location.host+proxify.url(url);
  })
}

window.fetch = function(url, options) {
  url = proxify.requrl(url);
  return Ofetch.apply(this, arguments);
}

window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  url = proxify.requrl(url);
  return XMLOpen.apply(this, arguments);
};

window.Navigator.prototype.sendBeacon = function(url, data) {
    url = proxify.requrl(url)
    return SendBeacon.apply(this, arguments);
};

window.open = function(url, name, features) {
  url = proxify.requrl(url)
  return Open.apply(this, arguments)
}

window.WebSocket = new Proxy(window.WebSocket, {
    construct(target, args) {
        var protocol;
        if (location.protocol == 'https:') protocol = 'wss://'; else protocol = 'ws://'; 

        args[0] = protocol + location.origin.split('/').splice(2).join('/') + config.prefix + '?ws=' + btoa(args[0]) + '&origin=' + btoa(config.url.origin);

        return Reflect.construct(target, args);
    }
});

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
                            url[0] = proxify.requrl(url[0]);
                            arr.push(url.join(' '));
                        });

                        return Reflect.apply(target, thisArg, [ element_attribute, arr.join(', ') ]);
                    };

                    if (element_attribute.toLowerCase() == array_attribute) value = proxify.requrl(value);
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

document.currentScript.remove()