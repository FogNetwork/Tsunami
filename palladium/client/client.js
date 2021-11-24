var config = JSON.parse(document.currentScript.getAttribute('data-config'))

var module = {}

if (config.title) {
  document.title = config.title
  setInterval(() => {if (document.title!==config.title) document.title = config.title}, 100)
}

/*if (!location.pathname.startsWith(config.prefix)) {
  location.href = config.prefix + 'gateway?url=' + location.pathname.replace(config.prefix, '')
}*/

