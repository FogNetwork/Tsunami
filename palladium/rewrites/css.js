module.exports = class CSSRewriter {
  constructor(data, ctx) {
    return function CSS(data, ctx) {
      return data.toString()
    }
  }
}