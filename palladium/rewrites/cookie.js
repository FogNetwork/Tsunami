module.exports = class CookieRewriter {
  constructor(ctx) {
    if (!ctx.requestResponse.headers['cookie']) return {};
    else console.log(ctx.requestResponse.headers['cookie'])
  }
}