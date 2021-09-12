function searchgames() {
  var searchgames = document.getElementById("searchgames");
  var filter = searchgames.value.toLowerCase();
  var game = document.getElementsByClassName('game');

  for (i = 0; i < game.length; i++) {
    if (game[i].innerText.toLowerCase().includes(filter)) {
      game[i].style.display = "initial";
    } else {
      game[i].style.display = "none";
    }
  }
}

function opengame(game) {
var arcade = document.getElementById("arcade");
var closearcade = document.getElementById("closearcade");
arcade.style.display = "initial";
closearcade.style.display = "initial";
arcade.setAttribute("src", game);
}
    
function closegame() {
var arcade = document.getElementById("arcade");
var closearcade = document.getElementById("closearcade");
arcade.style.display = "none";
closearcade.style.display = "none";
arcade.setAttribute("src", "");
}

document.addEventListener('keydown', function(e) {
    if(e.keyCode == 27){
        closegame()
    }
});
