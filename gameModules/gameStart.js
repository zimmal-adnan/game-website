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

    startCountdown(){
        const gameStartScreen = document.getElementById('game-start-screen');
        gameStartScreen.style.opacity = 0;
        gameStartScreen.style.pointerEvents = 'none';

        const countDown = document.getElementById('game-countdown');
        countDown.style.opacity = 1;

        let count = 3;
        countDown.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countDown.textContent = count;
            } 
            else if (count === 0) {
                countDown.textContent = "GO!";
            }
            else {
                clearInterval(countdownInterval);
                countDown.style.opacity = 0;
                this.start();
            }
        }, 1000);
    }

    start() {
        this.obstacleSpawner.start();
        this.update();
    }

    update(){
        if (this.gameOver) return;

        this.canvas.clear();
        this.player.draw();
        this.score.increase(0.01 * this.gameSpeed);

        this.updateObstacles();

        requestAnimationFrame(() => this.update());

    }

    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.update();

            if (obs.y > this.canvas.element.height) {
                this.obstacles.splice(i, 1);
                continue;
            }

            if (CollisionDetector.collide(this.player, obs)) {
                this.endGame();
                return;
            }
        }
    }

    endGame() {
        this.gameOver = true;
        this.obstacleSpawner.stopSpawn();
        this.gameOverManager.gameOverScreen(this);
    }

}