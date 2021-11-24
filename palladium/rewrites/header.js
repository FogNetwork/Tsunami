module.exports = class RewriteHeaders {
  constructor(ctx) {
    if (ctx.requestResponse.headers.location) ctx.requestResponse.headers.location = new ctx.rewrite.Base(ctx).url(ctx.requestResponse.headers.location);
    ['content-length','content-security-policy','content-security-policy-report-only','strict-transport-security','x-frame-options'].forEach(name => delete ctx.requestResponse.headers[name]);
    return ctx.requestResponse.headers
  }
}