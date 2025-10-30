import { Canvas, RandomInteger } from './canvas.js';
import { Player } from './player.js';
import { Score } from './score.js';
import { Obstacle } from './obstacles.js';
import { ObstacleSpawner } from './obstacleSpawner.js';
import { GameOver } from './gameOver.js';
import { SwitchWorld } from './switchWorld.js';
import { SelectDifficulty } from './selectDifficulty.js';
import { CollisionDetector } from './collision.js';
import { UserInput } from './Input.js';

export class Game{
    constructor(){
        //Initialise canvas and context for rendering
        this.canvas = new Canvas();
        this.context = this.canvas.context;

        this.gameOver = false;
        this.isBlackWorld = false;
        this.gameSpeed = 5;
        this.difficultyName = "normal";

        this.player = Player.createPlayer(this.canvas);
        this.score = Score.createScore();
        this.obstacles = [];

        this.obstacleSpawner = new ObstacleSpawner(this);
        this.gameOverManager = new GameOver();
        this.switchWorld = new SwitchWorld(this);
        this.selectDifficulty = new SelectDifficulty(this);
        this.selectDifficulty.chooseDifficulty();
        this.userInput = new UserInput(this);
        this.userInput.inputs();
    }

    //Start game with a countdown sequence
    startCountdown(){
        const gameStartScreen = document.getElementById('game-start-screen');
        gameStartScreen.style.opacity = 0;
        gameStartScreen.style.pointerEvents = 'none';

        const countDown = document.getElementById('game-countdown');
        countDown.style.opacity = 1;

        let count = 3;
        countDown.textContent = count;

        //Update countdown every second
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countDown.textContent = count;
            } 
            else if (count === 0) {
                countDown.textContent = "GO!";
            }
            else {
                //Hide countdown and start the game
                clearInterval(countdownInterval);
                countDown.style.opacity = 0;
                this.start();
            }
        }, 1000);
    }

    //Start the game by spawning obstacles and initialising the update loop
    start() {
        this.obstacleSpawner.start();
        this.update();
    }

    //Update game status
    update(){
        if (this.gameOver) return;

        this.canvas.clear(); //Clear canvas for the next frame
        this.player.draw();
        this.score.increase(0.01 * this.gameSpeed); 

        this.updateObstacles(); 

        //Calls the update function again for the next frame
        requestAnimationFrame(() => this.update());

    }

    //Update obstacles and handle collisions
    updateObstacles() {
        //Loop backwards through all obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            //Get the current obstacle and move it down the screen
            const obs = this.obstacles[i];
            obs.update();

            //Remove obstacles that move off-screen
            if (obs.y > this.canvas.element.height) {
                this.obstacles.splice(i, 1);
                continue;
            }

            //Check for collisions with the player
            if (CollisionDetector.collide(this.player, obs)) {
                this.endGame();
                return;
            }
        }
    }

    //Handle game over
    endGame() {
        this.gameOver = true;
        this.obstacleSpawner.stopSpawn(); //Stop spawning new obstacles
        this.gameOverManager.gameOverScreen(this); //Show game over screen
    }

}