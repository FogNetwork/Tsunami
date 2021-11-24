window.pLocation = new Proxy({}, {
  set(obj, prop, value) {

      if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return;

      return location[prop] = new Base(ctx).url(new URL(config.url).href.replace(new URL(config.url)[prop], value));
  },
  get(obj, prop) {
      // Had to be done in order to fix Discord.
      if (new URL(config.url).origin == atob('aHR0cHM6Ly9kaXNjb3JkLmNvbQ==') && new URL(config.url).pathname == '/app') return window.location[prop];

      if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return {
          assign: arg => window.location.assign(new Base(ctx).url(arg)),
          replace: arg => window.location.replace(new Base(ctx).url(arg)),
          reload: (arg) => window.location.reload(arg ? arg : null),
          toString: () => { return new URL(config.url).href },
          hash: window.location.hash,
          search: window.location.search
      }[prop];
      else return new URL(config.url)[prop];
  }    
})

var oOpen = window.open;
document.pLocation = pLocation

window.open = function(url, opts) {
  if (url) url = new Base(ctx).url(url)
  oOpen.apply(this, arguments)
}

Object.defineProperty(window, "PLocation", {
  set: function(newValue){
    if (!newValue) return;
    pLocation.href = (newValue)
  },
  get: function(){
    return this.location;
  }
});