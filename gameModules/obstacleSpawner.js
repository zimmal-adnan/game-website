import { RandomInteger } from './canvas.js';
import { Square, Rectangle, RotatingSquare, WideRectangle } from './obstacles.js';

//Handles spawning random obstacles
export class ObstacleSpawner{
    constructor(game){
        this.game = game;
        this.laneCount = 5; 
        this.laneWidth = game.canvas.element.width / this.laneCount;
        this.lastUsedLanes = []; //Teack lanes used by obstacles to avoid overlap
        this.spawnTimer = null; //scheduling obstacle spawns
    }

    //Start spawning obstacles
    start(){
        this.stopSpawn(); 
        this.spawn();
    }

    //Stop spawning obstacles by clearing the timer
    stopSpawn(){
        if(this.spawnTimer){
            clearTimeout(this.spawnTimer);
            this.spawnTimer = null;
        }
    }

    //Main spawn method to generate obstacles
    spawn(){
        if(this.game.gameOver) return;

        const spawnWideRectangle = Math.random() < 0.3;
        const spawnRotatingObstacle = Math.random() < 0.4;
        
        //Spawn different obstacle types based on possibility
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
        //Spawn delay based on difficulty level
        if(this.game.difficultyName === "easy"){
            nextSpawnDelay = RandomInteger.getRandomInt(700, 1000);
        }
        else if(this.game.difficultyName === "normal"){
            nextSpawnDelay = RandomInteger.getRandomInt(600, 800);
        }
        else if(this.game.difficultyName === "hard"){
            nextSpawnDelay = RandomInteger.getRandomInt(600, 700);
        }
        //Schedule next spawn with delay
        this.spawnTimer = setTimeout(() => this.spawn(), nextSpawnDelay);
    }

    //Spawn a wide rectangle that spans multiple lanes
    spawnWideRectangle(){
        const laneSpan = RandomInteger.getRandomInt(2, 4);
        const maxStartLane = this.laneCount - laneSpan; //obstacle fits within canvas
        const startLane = Math.floor(Math.random() * (maxStartLane + 1));
     
        const x = startLane * this.laneWidth; 
        const y = -70;
        const width = laneSpan * this.laneWidth;
        const height = RandomInteger.getRandomInt(40, 70);
        const colour = this.game.isBlackWorld ? "white" : "black";
        
        //Create and add the wide rectangle to game obstacles
        const obstacle = new WideRectangle(this.game.canvas.context, x, y, width, height, colour, laneSpan, this.game.gameSpeed);
        this.game.obstacles.push(obstacle);
        
        //Track the lanes used by this obstacle
        this.lastUsedLanes = []
        for(let i = 0; i < laneSpan; i++) {
            this.lastUsedLanes.push(startLane + i);
        }
    }

    //Spawn multiple rotating square obstacles
    spawnRotatingObstacle(){
        const obstacleNumber = RandomInteger.getRandomInt(2, 4); // Spawn 2-4 rotating squares
        const usedLanes = new Set();

        for (let i = 0; i < obstacleNumber; i++) {
            let laneIndex;
            
            //Keep selecting lanes until an unused one is found
            do {
                laneIndex = Math.floor(Math.random() * this.laneCount);
            } 
            while (usedLanes.has(laneIndex)); 
            usedLanes.add(laneIndex);

            const x = laneIndex * this.laneWidth + (this.laneWidth / 2);
            const y = -70;
            const size = RandomInteger.getRandomInt(40, 80);
            const colour = this.game.isBlackWorld ? "white" : "black";

            //Create and add rotating square to game obstacles
            const obstacle = new RotatingSquare(this.game.canvas.context, x - size / 2, y, size, colour, this.game.gameSpeed);
            this.game.obstacles.push(obstacle);
        }

        //Update last used lanes
        this.lastUsedLanes = Array.from(usedLanes);
    }

    //Spawn rectangular or square obstacles in random lanes
    spawnRegularObstacles(){
        const obstacleNumber = RandomInteger.getRandomInt(1, 4);
        const usedLanes = new Set(); //No duplicate lanes so multiple obstacles don't spawn in the same lane

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

            //Randomly choose between square or rectangle
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
            //Add obstacle to the game
            this.game.obstacles.push(obstacle); 
        }    
        
        //Update last used lanes
        this.lastUsedLanes = Array.from(usedLanes);
    }
}