import { Game } from "../gameModules/gameStart.js";

//Initialise game when the window finishes loading
window.addEventListener("load", () => {
    //Create a new instance of the Game class
    const game = new Game();

    //Display the game start screen
    const startScreen = document.getElementById("game-start-screen");
    startScreen.style.opacity = 1;
    startScreen.style.pointerEvents = "auto";
})






