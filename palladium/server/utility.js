function blackList(ctx) {
  if (ctx.middleware.blackList) {
    
  } else return ctx
}

function force(ctx) {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

if (!typeof module !== undefined) module.exports.blackList = blackList;
if (typeof module !== undefined) module.exports.force = force;