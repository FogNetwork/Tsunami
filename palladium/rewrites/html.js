var { JSDOM } = require('jsdom')
var regex = /srcset\s*=\s*['`"](.*?)['"`]/gi

module.exports = class HTMLRewriter {
  constructor(data, ctx) {
    return function HTML(data, ctx) {
      ctx.responseText = data.toString()

      var HTML_REWRITE_CONFIG = [
        {
          tags: ['http-equiv'],
          action: ['replace'],
          new: 'No-U-Content-Security-Policy',
        },
        {
          tags: ['href', 'src', 'action'],
          action: ['rewrite'],
        },
        {
          tags: ['srcset'],
          action: ['srcset'],
        },
        {
          tags: ['integrity'],
          action: ['replace'],
          newtag: 'nointegrity',
        },
        {
          tags: ['nonce'],
          action: ['replace'],
          newtag: 'nononce'
        }
      ]

      var injectData = {
        prefix: ctx.prefix,
        //encurl: ctx.encoding.decode(new ctx.rewrite.Base(ctx).url(ctx.url).replace(ctx.prefix, '')),
        url: ctx.url,
        title: ctx.title,
        encode: ctx.encode,
        req: {
          url: ctx.req.url,
        },
      }

      JSDOM.prototype.removeAttribute=function(attr) {}

      var html = new JSDOM(ctx.responseText, {'content-type': 'text/html'}), document = html.window.document;

      var sample = `https://github.githubassets.com/images/modules/site/home/globe-700.jpg 700w,https://github.githubassets.com/images/modules/site/home/globe.jpg 1400w`

      HTML_REWRITE_CONFIG.forEach((_config) => {
        if (_config.action[0]=='rewrite') {
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              node.setAttribute(tag, new ctx.rewrite.Base(ctx).url(node.getAttribute(tag)))
            })
          })
        }
        if (_config.action[0]=='srcset') {
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              node.setAttribute(tag, RewriteSrcset(node.getAttribute(tag)))
            })
          })
        }
        if (_config.action[0]=='replace') {
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              if (_config.new) {
                node.setAttribute(tag, _config.new)
                node.removeAttribute(tag)
              }
              if (_config.newtag) {
                node.setAttribute(_config.newtag, node.getAttribute(tag))
                node.removeAttribute(tag)
              }
            })
          })
        }
      })

      function RewriteSrcset(sample) {
        return sample.split(',').map(e => {
          return(e.split(' ').map(a => {
            if (a.startsWith('http')||a.startsWith('/')) {
              var url = new ctx.rewrite.Base(ctx).url(a)
            }
            return a.replace(a, (url||a))
          }).join(' '))
        }).join(',')
      }

      function InjectScript(){
        var e = document.createElement('script')
        e.setAttribute('data-config', JSON.stringify(injectData))
        e.src = injectData.prefix + 'index'
        document.querySelector('head').insertBefore(e, document.querySelector('head').childNodes[0])
      }

      InjectScript();

      ctx.responseText = html.serialize()

      ctx.httpResponse.text = ctx.responseText

      return html.serialize();
    }
  }
}