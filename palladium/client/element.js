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