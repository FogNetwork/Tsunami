var corrosionproxy = window.location.protocol + "//" + window.location.hostname + "/corrosion/gateway?url="

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

var game1 = document.getElementsByClassName("game")[0].style.display == "none"; 
var game2 = document.getElementsByClassName("game")[1].style.display == "none"; 
var game3 = document.getElementsByClassName("game")[2].style.display == "none"; 
var game4 = document.getElementsByClassName("game")[3].style.display == "none"; 
var game5 = document.getElementsByClassName("game")[4].style.display == "none"; 
var game6 = document.getElementsByClassName("game")[5].style.display == "none"; 
var game7 = document.getElementsByClassName("game")[6].style.display == "none"; 
var game8 = document.getElementsByClassName("game")[7].style.display == "none"; 
var game9 = document.getElementsByClassName("game")[8].style.display == "none"; 
var game10 = document.getElementsByClassName("game")[9].style.display == "none"; 
var game11 = document.getElementsByClassName("game")[10].style.display == "none"; 
var game12 = document.getElementsByClassName("game")[11].style.display == "none"; 
var game13 = document.getElementsByClassName("game")[12].style.display == "none"; 
var game14 = document.getElementsByClassName("game")[13].style.display == "none"; 
var game15 = document.getElementsByClassName("game")[14].style.display == "none"; 
var game16 = document.getElementsByClassName("game")[15].style.display == "none"; 
var game17 = document.getElementsByClassName("game")[16].style.display == "none"; 
var game18 = document.getElementsByClassName("game")[17].style.display == "none"; 
var game19 = document.getElementsByClassName("game")[18].style.display == "none"; 
var game20 = document.getElementsByClassName("game")[19].style.display == "none"; 
var game21 = document.getElementsByClassName("game")[20].style.display == "none"; 
var game22 = document.getElementsByClassName("game")[21].style.display == "none"; 
var game23 = document.getElementsByClassName("game")[22].style.display == "none"; 
var game24 = document.getElementsByClassName("game")[23].style.display == "none"; 

if (game1 == true & game2 == true & game3 == true & game4 == true & game5 == true & game5 == true & game6 == true & game7 == true & game8 == true & game9 == true & game10 == true & game11 == true & game12 == true & game14 == true & game15 == true & game16 == true & game17 == true & game18 == true & game19 == true & game20 == true & game21 == true & game22 == true & game23 == true & game24 == true) {
document.getElementById("nogame").style.display = "inherit"
} else {
document.getElementById("nogame").style.display = "none"
}
}

function opengame(game) {
var arcade = document.getElementById("arcade");
var closearcade = document.getElementById("closearcade");
var fullarcade = document.getElementById("fullarcade");
arcade.style.display = "initial";
closearcade.style.display = "initial";
fullarcade.style.display = "initial";
arcade.setAttribute("src", game);
}
    
function closegame() {
var arcade = document.getElementById("arcade");
var closearcade = document.getElementById("closearcade");
var fullarcade = document.getElementById("fullarcade");
arcade.style.display = "none";
closearcade.style.display = "none";
fullarcade.style.display = "none";
arcade.setAttribute("src", "");
}

function fullgame() {
  var arcade = document.getElementById("arcade")
  arcade.requestFullscreen()
}