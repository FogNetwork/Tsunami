function blackList(list, reason = 'Website Blocked') {
  return (ctx) => {
    try {if(list.indexOf(new URL(ctx.url).hostname)>-1) {
      ctx.response.end(reason)
    }} catch {}
  }
}

function allow(list, config) {
  return function(ctx) {
    try {if(list.indexOf(new URL(ctx.url).hostname)==-1) {
      if (config[0]=='redirect') {
        ctx.response.writeHead(301, {location: ctx.prefix+'gateway?url='+config[1]}).end('')
      } else {
        ctx.response.end(config[1])
      }
    }} catch {}
  }
}

function force(ctx) {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

if (!typeof module !== undefined) module.exports.blackList = blackList;
if (typeof module !== undefined) module.exports.force = force;
module.exports.allow = allow;