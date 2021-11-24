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