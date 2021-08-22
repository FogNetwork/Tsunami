search = document.getElementById('search');
search.addEventListener('keyup', function onEvent(e) {
    if (e.keyCode === 13) {
        go(search.value)
    }
});


function go(url) {
if (url !== '') {
if (url.includes('.')) {
open('https://' + url)
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
alert(url)
}

function open2(url) {
var surf = document.getElementById("surf");
surf.style.display = "initial";
surf.setAttribute("src", "");
}
