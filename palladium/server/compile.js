module.exports = class {
  constructor(ctx) {
    return {
      Base: require('../rewrites/base'),
      HTMLRewriter: new (require('../rewrites/html'))(ctx),
      CSSRewriter: new (require('../rewrites/css'))(ctx),
      JSRewriter: new (require('../rewrites/javascript'))(ctx),
      CookieRewriter: require('../rewrites/cookie'),
      RewriteHeaders: require('../rewrites/header'),
    }
  }
}