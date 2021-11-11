//  _____             _   _      _                      _    
// |  ___|__   __ _  | \ | | ___| |___      _____  _ __| | __
// | |_ / _ \ / _` | |  \| |/ _ \ __\ \ /\ / / _ \| '__| |/ /
// |  _| (_) | (_| | | |\  |  __/ |_ \ V  V / (_) | |  |   < 
// |_|  \___/ \__, | |_| \_|\___|\__| \_/\_/ \___/|_|  |_|\_\
//            |___/                                          

var title = localStorage.getItem("title")
var favicon = localStorage.getItem("favicon")

if (localStorage.hasOwnProperty("title")) {
    document.title = title
}

if (localStorage.hasOwnProperty("favicon")) {
    document.querySelector("link[rel='shortcut icon']").href = favicon;
}

function settitle(title) {
  if (title !== "") {
  localStorage.setItem("title", title)
  document.title = title
  } else {
  localStorage.removeItem("title")
  document.title = "\u200E"
  }
}

function setfavicon(icon) {
  if (icon !== "") {
  localStorage.setItem("favicon", icon)
  document.querySelector("link[rel='shortcut icon']").href = icon;
  } else {
  localStorage.removeItem("favicon")
  document.querySelector("link[rel='shortcut icon']").href = "/img/logo.svg";
  }
}

function setgoogle() {
  settitle("Google")
  setfavicon("https://www.google.com/favicon.ico")
}

function setgoogled() {
  settitle("Google Drive")
  setfavicon("https://www.drive.google.com/favicon.ico")
}

function setedpuzzle() {
  settitle("Edpuzzle")
  setfavicon("https://edpuzzle.imgix.net/favicons/favicon-32.png")
}

function setzoom() {
  settitle("Zoom")
  setfavicon("https://st1.zoom.us/zoom.ico")
}

function setreset() {
  localStorage.removeItem("title")
  localStorage.removeItem("favicon")
  location.reload();
}

var info = document.getElementById("info")
var isinfo = "no"

function goinfo() {
  if (isinfo == "no") {
    document.getElementById("info").style.display = "flex"
    isinfo = "yes"
  } else {
    document.getElementById("info").style.display = "none"
    isinfo = "no"
  }
}

if (localStorage.getItem("search") == null) {
localStorage.setItem("search", "Google")
}

window.addEventListener('load', function() {

var appearance = localStorage.getItem("appearance")

if (localStorage.hasOwnProperty("appearance")) {
    document.getElementsByTagName("body")[0].setAttribute("appearance", appearance)
} else {
    localStorage.setItem("appearance", "dark")
    document.getElementsByTagName("body")[0].setAttribute("appearance", "dark")
}

var css = localStorage.getItem("css")

if (css !== null) {
  var csselm = document.createElement("style")
  csselm.innerText = css
  document.body.appendChild(csselm)
}

})

window.addEventListener('load', function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('../sw.js');
  }
})