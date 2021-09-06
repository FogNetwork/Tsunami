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
  localStorage.setItem("title", title)
}

function setfavicon(icon) {
  localStorage.setItem("favicon", icon)
}
