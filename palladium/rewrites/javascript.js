class JSRewriter {
  constructor(data, ctx) {
    return function JS(data, ctx) {
      return data.toString().replace(/(window|document)\.location/gi, '$1.pLocation').replace('myScript=scripts[index]||', 'myScript=').replace(/location\s*=\s*/gi, 'PLocation = ').replace(/location\.([a-zA-Z0-9]*)/gi, 'pLocation.$1')//.replace(/\.href\s*=(["'` ]*)([a-zA-Z0-9]*)(['`" ]*)/gi, (match, p1, p2, p3) => {return '.phref = '+p1+new ctx.rewrite.Base(ctx).url(p2)+p3})
    }
  }
}

if (typeof module !== undefined) module.exports = JSRewriter