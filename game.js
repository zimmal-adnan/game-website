import { Game } from "./gameModules/gameStart.js";

window.addEventListener("load", () => {
    const game = new Game();
    const startScreen = document.getElementById("game-start-screen");
    startScreen.style.opacity = 1;
    startScreen.style.pointerEvents = "auto";
})




