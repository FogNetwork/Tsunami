var palladiumproxy = window.location.protocol + "//" + window.location.hostname + "/palladium/gateway?url="
var power="https://f.schoolbooks.ga/"
var corrosionproxy = window.location.protocol + "//" + window.location.hostname + "/corrosion/gateway?url="
var siteproxy="https://e.schoolbooks.ga/https/"
var womginxproxy = "https://a.schoolbooks.ga"+"/main/"
var miniprox="https://geographystudies4school.000webhostapp.com/history.php?"
var pydodgeproxy = "https://algebrapractice.herokuapp.com/course/"
var nodeproxy="https://c.schoolbooks.ga"+"/proxy/"
var censordodge="https://b.schoolbooks.ga/p13?cdURL="
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
}else if (currentproxy == "Power") {
return power + url
}else if (currentproxy == "Site") {
return siteproxy + url
}else if (currentproxy == "Mini") {
return miniprox + url
}else if (currentproxy == "Censor") {
return censordodge + btoa(url)}else if (currentproxy == "Node") {
return nodeproxy + url} else if (currentproxy == "Womginx") {
return womginxproxy + url
} else if (currentproxy == "PyDodge") {
return pydodgeproxy + url
}else if(currentproxy=="Mini"){
  return miniprox+url
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
var site=document.getElementById("site")
var palladium = document.getElementById("palladium")
var corrosion = document.getElementById("corrosion")
var womginx = document.getElementById("womginx")
var pydodge = document.getElementById("pydodge")
var node=document.getElementById("node")
var censor=document.getElementById("censor")
var mini=document.getElementById("mini")
var powers=document.getElementById("power")
if (localStorage.getItem("proxy") !== null) {
var currentproxy2 = currentproxy.toLowerCase()
document.getElementById(currentproxy2).classList.add("proxysel")
}

})

function setproxy(proxy) {
localStorage.setItem("proxy", proxy)
if (proxy == "Palladium") {
palladium.classList.add("proxysel")

powers.classList.remove("proxysel")
site.classList.remove("proxysel")
mini.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
node.classList.remove("proxysel")
censor.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
} else if (proxy == "Corrosion") {powers.classList.remove("proxysel")
  site.classList.remove("proxysel")
palladium.classList.remove("proxysel")
mini.classList.remove("proxysel")
corrosion.classList.add("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
node.classList.remove("proxysel")
censor.classList.remove("proxysel")
} else if (proxy == "Womginx") {powers.classList.remove("proxysel")
  site.classList.remove("proxysel")
palladium.classList.remove("proxysel")
mini.classList.remove("proxysel")
censor.classList.remove("proxysel")
node.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.add("proxysel")
pydodge.classList.remove("proxysel")
} else if (proxy == "PyDodge") {powers.classList.remove("proxysel")
  site.classList.remove("proxysel")
  node.classList.remove("proxysel")
  mini.classList.remove("proxysel")
palladium.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
censor.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.add("proxysel")
}else if(proxy=="Node"){powers.classList.remove("proxysel")
  site.classList.remove("proxysel")
  node.classList.add("proxysel")
  mini.classList.remove("proxysel")
  censor.classList.remove("proxysel")
  palladium.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
}else if(proxy=="Censor"){powers.classList.remove("proxysel")
  site.classList.remove("proxysel")
  censor.classList.add("proxysel")
  mini.classList.remove("proxysel")
   node.classList.remove("proxysel")
  palladium.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
}
else if(proxy=="Mini"){powers.classList.remove("proxysel")
  site.classList.remove("proxysel")
  mini.classList.add("proxysel")
  censor.classList.remove("proxysel")
  
   node.classList.remove("proxysel")
  palladium.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
}
else if(proxy=="Site"){powers.classList.remove("proxysel")
  site.classList.add("proxysel")
  mini.classList.remove("proxysel")
  censor.classList.remove("proxysel")
  
   node.classList.remove("proxysel")
  palladium.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
}else if(proxy=="Power"){
  powers.classList.add("proxysel")
  site.classList.remove("proxysel")
  mini.classList.remove("proxysel")
  censor.classList.remove("proxysel")
  
   node.classList.remove("proxysel")
  palladium.classList.remove("proxysel")
corrosion.classList.remove("proxysel")
womginx.classList.remove("proxysel")
pydodge.classList.remove("proxysel")
}
}
