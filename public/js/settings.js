window.addEventListener('load', function() {
var search1 = localStorage.getItem("search")
var google = document.getElementById("google")
var duckduckgo = document.getElementById("duckduckgo")
var bing = document.getElementById("bing")
var brave = document.getElementById("brave")

if (localStorage.getItem("search") !== null) {
var search2 = search1.toLowerCase()
document.getElementById(search2).classList.add("seactive")
} else {
localStorage.setItem("search", "Google")
google.classList.add("seactive")
}
})

function setsearch(engine) {
  localStorage.setItem("search", engine)

  if (engine == "Google") {
    google.classList.add("seactive")
    duckduckgo.classList.remove("seactive")
    bing.classList.remove("seactive")
    brave.classList.remove("seactive")
  } else if (engine == "DuckDuckGo") {
    google.classList.remove("seactive")
    duckduckgo.classList.add("seactive")
    bing.classList.remove("seactive")
    brave.classList.remove("seactive")
  } else if (engine == "Bing") {
    google.classList.remove("seactive")
    duckduckgo.classList.remove("seactive")
    bing.classList.add("seactive")
    brave.classList.remove("seactive")
  } else if (engine == "Brave") {
    google.classList.remove("seactive")
    duckduckgo.classList.remove("seactive")
    bing.classList.remove("seactive")
    brave.classList.add("seactive")
  }
}