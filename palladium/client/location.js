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

var pushstates = history.pushState;

window.history.pushState = new Proxy(history.pushState, {
  apply(target, thisArg, args) {
  args[2] = new Base(ctx).url(args[2])
  return Reflect.apply(target, thisArg, args)
  }
});

window.history.replaceState = new Proxy(history.replaceState, {
  apply(target, thisArg, args) {
    args[2] = new Base(ctx).url(args[2])
    return Reflect.apply(target, thisArg, args)
  }
});

Object.defineProperty(document, 'domain', {
  get() {
    return new URL(ctx.url).hostname;
  },
  set(val) {
    return val;
  }
});

var oCookie = document.cookie

Object.defineProperty(document, 'cookie', {
  get() {
    var cookie = Object.getOwnPropertyDescriptor(window.Document.prototype, 'cookie').get.call(this),
      new_cookie = [],
      cookie_array = cookie.split('; ');
    cookie_array.forEach(cookie => {
      const cookie_name = cookie.split('=').splice(0, 1).join(),
        cookie_value = cookie.split('=').splice(1).join();
      if (new URL(ctx.url).hostname.includes(cookie_name.split('@').splice(1).join())) new_cookie.push(cookie_name.split('@').splice(0, 1).join() + '=' + cookie_value);
    });
    return new_cookie.join('; ');;
  },
  set(val) {
    Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').set.call(this, val);
  }
})

window.Worker = new Proxy(window.Worker, {
  construct(target, args) {
    if (args[0]) args[0] = new Base(ctx).url(args[0]);
    return Reflect.construct(target, args);
  }
});

if (config.title) {
  var oTitle = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
  document.title = config.title
  Object.defineProperty(Document.prototype, 'title', {
    set(value) {
      oTitle = config.title
      return value
    },
    get() {
      return config.title
    }
  })
}

if (location.search && !(new URLSearchParams(location.search).get('palladium-redir'))) {
  var p1 = ctx.encoding.decode(location.pathname.split(config.prefix)[1])
  console.log(p1+location.search+'&palladium-redir=true')
  location.href = config.prefix+ctx.encoding.encode(p1+location.search+'&palladium-redir=true')
}