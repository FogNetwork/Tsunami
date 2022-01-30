var palladiumproxy = window.location.protocol + "//" + window.location.hostname + "/palladium/gateway?url="

var corrosionproxy = window.location.protocol + "//" + window.location.hostname + "/corrosion/gateway?url="

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

window.onload = function() {
    
search = document.getElementById("search");
search.addEventListener('keyup', function onEvent(e) {
    if (e.keyCode === 13) {
        go(search.value)
    }
});
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

function hidesugg() {
  document.getElementById("search").style.borderRadius = "5px";
  document.getElementById("suggestions").style.display = "none";
}

function showsugg() {
  document.getElementById("search").style.borderRadius = "5px 5px 0 0";
  document.getElementById("suggestions").style.display = "inherit"
}

function sugggo(suggtext) {
  if (localStorage.getItem("proxy") !== null) {
  go(suggtext)
  document.getElementById("search").value = ""
  hidesugg()
  }
}

window.addEventListener("load", function() {
var search = document.getElementById("search")
search.addEventListener("keyup", function(event) {
    event.preventDefault()
    if (event.keyCode == 13)
        if (this.value !== "") {
             go(this.value)
             this.value = ""
        }
});

search.addEventListener("keyup", function(event) {
event.preventDefault()
if (search.value.trim().length !== 0) {
document.getElementById("suggestions").innerText = ""
showsugg()
async function getsuggestions() {
var term = search.value || "";
var response = await fetch("/suggestions?q=" + term);
var result = await response.json();
var suggestions = result.slice(0, 8);
for (sugg in suggestions) {
var suggestion = suggestions[sugg]
var sugg = document.createElement("div")
sugg.innerText = suggestion
sugg.setAttribute("onclick", "sugggo(this.innerText)")
sugg.className = "sugg"
document.getElementById("suggestions").appendChild(sugg)
}
}
getsuggestions()
} else {
hidesugg()
}
});

search.addEventListener("click", function(event) {
if (search.value.trim().length !== 0) {
showsugg()
}
})

})

function hidesuggclick(){
if (window.event.srcElement.id !== "search" && window.event.srcElement.id !== "suggestions" && window.event.srcElement.className !== "sugg") {
hidesugg()
}
}

document.onclick = hidesuggclick