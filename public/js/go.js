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

function open(url) {
var surf = document.getElementById("surf");
var closesurf = document.getElementById("closesurf");
var reloadsurf = document.getElementById("reloadsurf");
surf.style.display = "initial";
closesurf.style.display = "initial";
reloadsurf.style.display = "initial";
surf.setAttribute("src", url);
document.getElementById("search").value = "";
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
