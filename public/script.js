search = document.getElementById('search');
search.addEventListener('keyup', function onEvent(e) {
    if (e.keyCode === 13) {
        go(search.value)
    }
});


function go(url) {
if (url !== '') {
if (url.includes('.')) {
alert(url)
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

function open (url) {
alert(url)
}
