import { RandomInteger } from './canvas.js';
import { Square, Rectangle, RotatingSquare, WideRectangle } from './obstacles.js';

export class ObstacleSpawner{
    constructor(game){
        this.game = game;
        this.laneCount = 5;
        this.laneWidth = game.canvas.element.width / this.laneCount;
        this.lastUsedLanes = [];
        this.spawnTimer = null;
    }

    start(){
        this.stopSpawn();
        this.spawn();
    }

    stopSpawn(){
        if(this.spawnTimer){
            clearTimeout(this.spawnTimer);
            this.spawnTimer = null;
        }
    }

    spawn(){
        if(this.game.gameOver) return;

        const spawnWideRectangle = Math.random() < 0.3;
        const spawnRotatingObstacle = Math.random() < 0.5;
        
        if (spawnWideRectangle) {
            this.spawnWideRectangle();
        } 
        else if(spawnRotatingObstacle){
            this.spawnRotatingObstacle();
        }
        else {
            this.spawnRegularObstacles();
        }

        let nextSpawnDelay;
        if(this.game.difficultyName === "easy"){
            nextSpawnDelay = RandomInteger.getRandomInt(700, 1000);
        }
        else if(this.game.difficultyName === "normal"){
            nextSpawnDelay = RandomInteger.getRandomInt(600, 800);
        }
        else if(this.game.difficultyName === "hard"){
            nextSpawnDelay = RandomInteger.getRandomInt(600, 700);
        }
        this.spawnTimer = setTimeout(() => this.spawn(), nextSpawnDelay);
    }


    spawnWideRectangle(){
        const laneSpan = RandomInteger.getRandomInt(2, 4);
        const maxStartLane = this.laneCount - laneSpan;
        const startLane = Math.floor(Math.random() * (maxStartLane + 1));
     
        const x = startLane * this.laneWidth;
        const y = -70;
        const width = laneSpan * this.laneWidth;
        const height = RandomInteger.getRandomInt(40, 70);
        const colour = this.game.isBlackWorld ? "white" : "black";
        
        const obstacle = new WideRectangle(this.game.canvas.context, x, y, width, height, colour, laneSpan, this.game.gameSpeed);
        this.game.obstacles.push(obstacle);
        
        this.lastUsedLanes = []
        for(let i = 0; i < laneSpan; i++) {
            this.lastUsedLanes.push(startLane + i);
        }
    }

    spawnRotatingObstacle(){
        const obstacleNumber = RandomInteger.getRandomInt(2, 4); // Spawn 2-4 rotating squares
        const usedLanes = new Set();

        for (let i = 0; i < obstacleNumber; i++) {
            let laneIndex;
            
            do {
                laneIndex = Math.floor(Math.random() * this.laneCount);
            } 
            while (usedLanes.has(laneIndex)); 
            usedLanes.add(laneIndex);

            const x = laneIndex * this.laneWidth + (this.laneWidth / 2);
            const y = -70;
            const size = RandomInteger.getRandomInt(40, 80);
            const colour = this.game.isBlackWorld ? "white" : "black";

            const obstacle = new RotatingSquare(this.game.canvas.context, x - size / 2, y, size, colour, this.game.gameSpeed);
            this.game.obstacles.push(obstacle);
        }

        this.lastUsedLanes = Array.from(usedLanes);
    }

    spawnRegularObstacles(){
        const obstacleNumber = RandomInteger.getRandomInt(1, 4);
        const usedLanes = new Set();

        for (let i = 0; i < obstacleNumber; i++){        
            let laneIndex;
            
            do {
                laneIndex = Math.floor(Math.random() * this.laneCount);
            } 
            while (usedLanes.has(laneIndex)); 
            usedLanes.add(laneIndex);

            const x = laneIndex * this.laneWidth + (this.laneWidth / 2);
            const y = -70; 
            const colour = this.game.isBlackWorld ? "white" : "black";

            const shapeType = Math.floor(Math.random() * 2);
            let obstacle;

            if(shapeType === 0){
                const size = RandomInteger.getRandomInt(40, 80);
                obstacle = new Square(this.game.canvas.context, x - size / 2, y, size, colour, this.game.gameSpeed);
            }
            else if(shapeType === 1){
                const rectangleWidth = RandomInteger.getRandomInt(40, 80);
                const rectangleHeight = RandomInteger.getRandomInt(40, 70);
                obstacle = new Rectangle(this.game.canvas.context, x - rectangleWidth / 2, y, rectangleWidth, rectangleHeight, colour, this.game.gameSpeed);
            }
            this.game.obstacles.push(obstacle); 
        }     
        this.lastUsedLanes = Array.from(usedLanes);
    }
}