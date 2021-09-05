function searchgames() {
  var searchgames = document.getElementById("searchgames");
  var filter = search.value.toLowerCase();
  var game = document.getElementsByClassName('game');

  for (i = 0; i < game.length; i++) {
    if (game[i].innerText.toLowerCase().includes(filter)) {
      game[i].style.display = "initial";
    } else {
      game[i].style.display = "none";
    }
  }
}
