var { JSDOM } = require('jsdom')
var regex = /(srcset|src|href|action|integrity|nonce|http-equiv)\s*=\s*['`"](.*?)['"`]/gi

module.exports = class HTMLRewriter {
  constructor(data, ctx) {
    return function HTML(data, ctx) {
      ctx.responseText = data.toString()

      var rewriteData = {
        tags: ['src', 'srcset', 'href'],
        removetags: ['intergity', 'nonce', 'http-equiv']
      }

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

      ctx.responseText = ctx.responseText.replace(regex, (match, p1, p2) => {
        if (p1=='integrity' || p1=='nonce' || p1=='http-equiv') return ''
        if (p1=='srcset') {
          const src_arr = [];

          p2.split(',').forEach(url => {
            url = url.trimStart().split(' ');
            url[0] = new ctx.rewrite.Base(ctx).url(url[0]);
            src_arr.push(url.join(' '));
          });

          p2 = src_arr.join(', ')
          return `${p1}="${p2}"`
        }
        return `${p1}="${new ctx.rewrite.Base(ctx).url(p2)}"`
      })

      var html = new JSDOM(ctx.responseText, {'content-type': 'text/html'}), document = html.window.document;

      document.querySelectorAll('*').forEach((node) => {
        if (node.outerHTML.includes(ctx.prefix)) {node.setAttribute('data-palladium', true)}
      })

      document.querySelectorAll('script').forEach((node) => {
        node.textContent ? node.textContent = ctx.rewrite.JSRewriter(node.textContent, ctx) : ''
      })

      rewriteData.removetags.forEach((tag) => {
        document.querySelectorAll(`*[${tag}]`).forEach((node) => {
          node.removeAttribute(tag)
        })
      })

      function InjectScript(){
        var e = document.createElement('script')
        e.setAttribute('data-config', JSON.stringify(injectData))
        e.src = injectData.prefix + 'index'
        document.querySelector('head').insertBefore(e, document.querySelector('head').childNodes[0])
      }

      InjectScript()

      ctx.responseText = html.serialize()
      return html.serialize()
    }
  }
}