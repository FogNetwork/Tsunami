module.exports = class CSSRewriter {
  constructor(data, ctx) {
    return function CSS(data, ctx) {
      return data.toString().replace(/url\("(.*?)"\)/gi, str => {var url = str.replace(/url\("(.*?)"\)/gi, '$1');return `url("${new ctx.rewrite.Base(ctx).url(url)}")`;}).replace(/url\('(.*?)'\)/gi, str => {var url = str.replace(/url\('(.*?)'\)/gi, '$1');return `url('${new ctx.rewrite.Base(ctx).url(url)}')`;}).replace(/url\((.*?)\)/gi, str => {var url = str.replace(/url\((.*?)\)/gi, '$1');if (url.startsWith(`"`) || url.startsWith(`'`)) return str;return `url("${new ctx.rewrite.Base(ctx).url(url)}")`;}).replace(/@import (.*?)"(.*?)";/gi, str => {var url = str.replace(/@import (.*?)"(.*?)";/, '$2');return `@import "${new ctx.rewrite.Base(ctx).url(url)}";`}).replace(/@import (.*?)'(.*?)';/gi, str => {var url = str.replace(/@import (.*?)'(.*?)';/, '$2');return `@import '${new ctx.rewrite.Base(ctx).url(url)}';`})
  };
  }
}