import { Square, Rectangle, WideRectangle } from './obstacles.js';
import { RandomInteger } from './canvas.js';

export class SwitchWorld{
    constructor(game){
        this.game = game;
        this.laneCount = 5;
        this.laneWidth = game.canvas.element.width / this.laneCount;
        this.canSwitch = true;
        this.switchCooldown = 5000;
        this.gameFeedback = document.getElementById("game-feedback");
        this.gameOverText = document.getElementById("gameOverText");
    }

    worldSwitch(){
        if (this.game.gameOver) return;

        if (!this.canSwitch) {
            return;
        }

        this.game.isBlackWorld = !this.game.isBlackWorld;
        this.canSwitch = false;

        this.game.canvas.element.style.backgroundColor = this.game.isBlackWorld ? "black" : "white";

        if (this.game.isBlackWorld) {
            this.gameOverText.style.color = "white";
            this.gameOverText.style.textShadow = "0 5px 8px rgba(255, 255, 255, 0.5)";
            this.gameFeedback.style.color = "white";
            this.gameFeedback.style.borderColor = "white";
        } else {
            this.gameOverText.style.color = "black";
            this.gameFeedback.style.color = "black";
            this.gameFeedback.style.borderColor = "#fff"; // optional: border contrast
        }

        this.startSwitchCooldown();
        this.invertObstacles();
    }
    
    startSwitchCooldown(){
        let count = 5;
        const feedback = this.gameFeedback;


        feedback.classList.add('show');
        feedback.textContent = `Switch cooldown: ${count}s`;


        const countDownInterval = setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(countDownInterval);

                feedback.classList.remove('show');
                setTimeout(() => {
                    feedback.textContent = "";
                }, 300);
            } 
            else {
                feedback.textContent = `Switch cooldown: ${count}s`;
            }
        }, 1000);

        setTimeout(() => {
            this.canSwitch = true;
        }, this.switchCooldown);
    }


    invertObstacles(){
        const usedLanes = new Set();
        const laneObstacles = {};
        let hasWideRectangle = false;
   
        for (const obs of this.game.obstacles) {
            if (obs instanceof WideRectangle) {
                hasWideRectangle = true;
                const startLane = Math.floor(obs.x / this.laneWidth);
                for (let i = 0; i < obs.laneSpan; i++) {
                    usedLanes.add(startLane + i);
                    if (!laneObstacles[startLane + i] || obs.y > laneObstacles[startLane + i].y) {
                        laneObstacles[startLane + i] = obs;
                    }
                }
            } 
            else {
                const laneIndex = Math.floor((obs.x + (obs.size || obs.width / 2)) / this.laneWidth);
                usedLanes.add(laneIndex);
                if (!laneObstacles[laneIndex] || obs.y > laneObstacles[laneIndex].y) {
                    laneObstacles[laneIndex] = obs;
                }
            }
        }


        let refY = -70;
        if (Object.keys(laneObstacles).length > 0) {
            refY = Math.max(...Object.values(laneObstacles).map(o => o.y));
        }

        const allLanes = [...Array(this.laneCount).keys()];
        const unusedLanes = allLanes.filter(lane => !usedLanes.has(lane));


        this.game.obstacles.length = 0;

      
        const spawnWideRectangle = !hasWideRectangle && unusedLanes.length >= 2 && Math.random() < 0.3;
    

        if (spawnWideRectangle) {   
            this.spawnInvertWideRectangle(unusedLanes, refY);
        } 
        else {
            this.spawnInvertRegularObstacles(unusedLanes, refY);
        }
    }

    spawnInvertWideRectangle(unusedLanes, refY){
        const maxLaneSpan = Math.min(4, unusedLanes.length);
        const laneSpan = RandomInteger.getRandomInt(2, maxLaneSpan);
        
        let startLane = unusedLanes[0];
        
        for (let i = 0; i <= unusedLanes.length - laneSpan; i++) {
            let consecutive = true;
            for (let j = 1; j < laneSpan; j++) {
                if (unusedLanes[i + j] !== unusedLanes[i] + j) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) {
                startLane = unusedLanes[i];
                break;
            }
        }
        
        const x = startLane * this.laneWidth;
        const width = laneSpan * this.laneWidth;
        const height = RandomInteger.getRandomInt(40, 70);
        const colour = this.game.isBlackWorld ? "white" : "black";
        
        
        const obstacle = new WideRectangle(this.game.canvas.context, x, refY, width, height, colour, laneSpan, this.game.gameSpeed);
        this.game.obstacles.push(obstacle);
        
        this.lastUsedLanes = [];
        for (let i = 0; i < laneSpan; i++) {
            this.lastUsedLanes.push(startLane + i);
        }
    }


    spawnInvertRegularObstacles(unusedLanes, refY){
        for (let laneIndex of unusedLanes) {
            const x = laneIndex * this.laneWidth + (this.laneWidth / 2);
            const colour = this.game.isBlackWorld ? "white" : "black";
            const shapeType = Math.floor(Math.random() * 3);
            
            let obstacle;

            if (shapeType === 0) {
                const size = RandomInteger.getRandomInt(40, 80);
                obstacle = new Square(this.game.canvas.context, x - size / 2, refY, size, colour, this.game.gameSpeed);
            } 
            else if (shapeType === 1){
                const rectangleWidth = RandomInteger.getRandomInt(40, 80);
                const rectangleHeight = RandomInteger.getRandomInt(40, 70);
                obstacle = new Rectangle(this.game.canvas.context, x - rectangleWidth / 2, refY, rectangleWidth, rectangleHeight, colour, this.game.gameSpeed);
            }
            else if (shapeType === 2) {
                const size = RandomInteger.getRandomInt(40, 80);
                const obstacle = new RotatingSquare(this.game.canvas.context, x - size / 2, y, size, colour, this.game.gameSpeed);
            }

            this.game.obstacles.push(obstacle);
        }
    }
}