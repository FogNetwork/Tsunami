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

window.addEventListener('load', function() {

var appearance = localStorage.getItem("appearance")
var appdark = document.getElementById("appdark")
var applight = document.getElementById("applight")

if (localStorage.getItem("appearance") !== null) {
    document.getElementsByTagName("body")[0].setAttribute("appearance", appearance)
    if (appearance == "dark") {
      appdark.classList.add("chooseappactive")
      applight.classList.remove("chooseappactive")
    } else {
      applight.classList.add("chooseappactive")
      appdark.classList.remove("chooseappactive")
    }
} else {
    localStorage.setItem("appearance", "dark")
    document.getElementsByTagName("body")[0].setAttribute("appearance", "dark")
}

})

function setapp(theme) {
    if (theme == "dark") {
      localStorage.setItem("appearance", "dark")
      appdark.classList.add("chooseappactive")
      applight.classList.remove("chooseappactive")
      document.getElementsByTagName("body")[0].setAttribute("appearance", "dark")
    } else {
      localStorage.setItem("appearance", "light")
      applight.classList.add("chooseappactive")
      appdark.classList.remove("chooseappactive")
      document.getElementsByTagName("body")[0].setAttribute("appearance", "light")
    }
}

function setcss(input) {
if (input !== "") {
  localStorage.setItem("css", input)
  location.reload();
} else {
  localStorage.removeItem("css")
  location.reload();
}
}

window.addEventListener('load', function() {

var css = localStorage.getItem("css")

if (css !== null) {
  document.getElementById("setcssinput").value = css
}

})