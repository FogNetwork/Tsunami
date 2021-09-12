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
open('https://www.google.com/search?q=' + url)
}
} else {
return false;
}
}

function getproxy(url) {
var currentproxy = localStorage.getItem("proxy")
if (currentproxy == "Smoke") {
return "/smoke/" + url
} else if (currentproxy == "Corrosion") {
return "/corrosion/gateway?url=" + url
} else if (currentproxy == "Womginx") {
return window.location.protocol + "//" + "w." + window.location.hostname + "/main/" + url
} else if (currentproxy == "PyDodge") {
return window.location.protocol + "//" + "p." + window.location.hostname + "/course/" + url
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
surf.src += '';
}

window.addEventListener('load', function() {
var currentproxy = localStorage.getItem("proxy")
var smoke = document.getElementById("smoke")
var corrosion = document.getElementById("corrosion")
var womginx = document.getElementById("smoke")
var pydodge = document.getElementById("pydodge")

if (localStorage.getItem("proxy") !== null) {
var currentproxy2 = currentproxy.toLowerCase()
document.getElementById(currentproxy2).classList.add("proxysel")
}

})

function setproxy(proxy) {
localStorage.setItem("proxy", proxy)
if (proxy == "Smoke") {
smoke.classList.add("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
} else if (proxy == "Corrosion") {
smoke.classList.remove("proxysel")
corrosion.classList.add("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
} else if (proxy == "Womginx") {
smoke.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.add("proxysel")
pydodge.classList.remove("proxysel")
} else if (proxy == "PyDodge") {
smoke.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.add("proxysel")
}
}

document.addEventListener('keydown', function(e) {
    if(e.keyCode == 27){
        closesurf()
    }
});
