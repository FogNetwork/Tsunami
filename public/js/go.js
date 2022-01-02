var palladiumproxy = window.location.protocol + "//" + window.location.hostname + "/palladium/gateway?url="

var corrosionproxy = window.location.protocol + "//" + window.location.hostname + "/corrosion/gateway?url="

window.onload = function() {
    
search = document.getElementById("search");
search.addEventListener('keyup', function onEvent(e) {
    if (e.keyCode === 13) {
        go(search.value)
    }
});


function go(url) {
if (url !== '') {
if (url.includes('.')) {
open(url)
} else if (url.startsWith('https://')) {
open(url)
} else if (url.startsWith('http://')) {
open(url)
} else {
searchurl(url)
}
} else {
return false;
}
}

function searchurl(url) {
  var search = localStorage.getItem("search")
  if (search == "Google") {
    open("https://www.google.com/search?q=" + url)
  } else if (search == "DuckDuckGo") {
    open("https://duckduckgo.com/?q=" + url)
  } else if (search == "Bing") {
    open("https://www.bing.com/search?q=" + url)
  } else if (search == "Brave") {
    open("https://search.brave.com/search?q=" + url)
  } else {
    console.log("Error with search")
  }
}

function getproxy(url) {
var currentproxy = localStorage.getItem("proxy")
if (currentproxy == "Palladium") {
return palladiumproxy + url
} else if (currentproxy == "Corrosion") {
return corrosionproxy + url
}
}

function open(url) {
if (localStorage.getItem("proxy") !== null) {
var surf = document.getElementById("surf");
var closesurf = document.getElementById("closesurf");
var reloadsurf = document.getElementById("reloadsurf");
surf.style.display = "initial";
closesurf.style.display = "initial";
reloadsurf.style.display = "initial";
surf.setAttribute("src", getproxy(url));
document.getElementById("search").value = "";
}
}
    
};

function closesurf() {
var surf = document.getElementById("surf");
var closesurf = document.getElementById("closesurf");
var reloadsurf = document.getElementById("reloadsurf");
surf.style.display = "none";
closesurf.style.display = "none";
reloadsurf.style.display = "none";
surf.setAttribute("src", "");
}

function reloadsurf() {
var surf = document.getElementById("surf");
surf.contentWindow.location.reload()
}

window.addEventListener('load', function() {
var currentproxy = localStorage.getItem("proxy")
var palladium = document.getElementById("palladium")
var corrosion = document.getElementById("corrosion")

if (localStorage.getItem("proxy") !== null) {
var currentproxy2 = currentproxy.toLowerCase()
document.getElementById(currentproxy2).classList.add("proxysel")
}

})

function setproxy(proxy) {
localStorage.setItem("proxy", proxy)
if (proxy == "Palladium") {
palladium.classList.add("proxysel")
corrosion.classList.remove("proxysel")
} else if (proxy == "Corrosion") {
palladium.classList.remove("proxysel")
corrosion.classList.add("proxysel")
}
}