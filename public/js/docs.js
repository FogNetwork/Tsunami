async function fetchtext() {
let response = await fetch("https://raw.githubusercontent.com/wiki/FogNetwork/Tsunami/Docs.md")
let text = await response.text()
var converter = new showdown.Converter()
var html = converter.makeHtml(text);

var docspage = document.getElementById("docspage")
docspage.innerHTML = html
}

fetchtext()