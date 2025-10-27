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
    }

    worldSwitch(){
        if (this.game.gameOver) return;

        if (!this.canSwitch) {
            return;
        }

        this.game.isBlackWorld = !this.game.isBlackWorld;
        this.canSwitch = false;

        this.startSwitchCooldown();
        this.invertObstacles();
    }
    
    startSwitchCooldown(){
        let count = 5;
        const feedback = this.gameFeedback;


        feedback.classList.add('show');
        feedback.textContent = `Cannot switch! ${count}s`;


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
                feedback.textContent = `Cannot switch! ${count}s`;
            }
        }, 1000);

        setTimeout(() => {
            this.canSwitch = true;
        }, this.switchCooldown);
    }


    invertObstacles(){
        const usedLanes = new Set();
   
        for (const obs of this.game.obstacles) {
            if (obs instanceof WideRectangle) {
                const startLane = Math.floor(obs.x / this.laneWidth);
                for (let i = 0; i < obs.laneSpan; i++) {
                    usedLanes.add(startLane + i);
                }
            } 
            else {
                const laneIndex = Math.floor((obs.x + (obs.size || obs.width / 2)) / this.laneWidth);
                usedLanes.add(laneIndex);
            }
        }


        let refY = -70;
        if (this.game.obstacles.length > 0) {
            refY = Math.min(...this.game.obstacles.map(o => o.y));
        }


        const allLanes = [...Array(this.laneCount).keys()];
        const unusedLanes = allLanes.filter(lane => !usedLanes.has(lane));


        this.game.obstacles.length = 0;

      
        const spawnWideRectangle = unusedLanes.length >= 2 && Math.random() < 0.3;

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
        const colour = this.game.isBlackWorld ? "black" : "red";
        
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
            const colour = this.game.isBlackWorld ? "black" : "red";
            const shapeType = Math.floor(Math.random() * 2);
            
            let obstacle;

            if (shapeType === 0) {
                const size = RandomInteger.getRandomInt(40, 80);
                obstacle = new Square(this.game.canvas.context, x - size / 2, refY, size, colour, this.game.gameSpeed);
            } else {
                const rectangleWidth = RandomInteger.getRandomInt(40, 80);
                const rectangleHeight = RandomInteger.getRandomInt(40, 70);
                obstacle = new Rectangle(this.game.canvas.context, x - rectangleWidth / 2, refY, rectangleWidth, rectangleHeight, colour, this.game.gameSpeed);
            }

            this.game.obstacles.push(obstacle);
        }
    }
}