module.exports = class Headers {
  constructor(ctx) {
    return {
      origin(header, url) {
        console.log(new URL(url).origin)
        return new URL(url).origin
      },
      referer(header) {
        console.log(header)
        console.log(ctx.getRequestUrl({url: header}))
        return ctx.getRequestUrl({url: header})
      }
    }
  }
}