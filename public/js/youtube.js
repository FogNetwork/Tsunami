window.addEventListener('load', function() {
searchyoutube = document.getElementById("searchyoutube");
searchyoutube.addEventListener('keyup', function onEvent(e) {
    if (e.keyCode === 13) {
        window.location.href = "/watch?v=" + searchyoutube.value.split("https://www.youtube.com/watch?v=")
    }
});
})